import { SETTINGS } from "./config.js";
import type { GitHubSearchResponse, RecentStarCount, SearchSort } from "./types.js";

const API_ROOT = "https://api.github.com";

export type GitHubClientOptions = {
  token?: string | undefined;
};

export class GitHubClient {
  private readonly token: string | undefined;

  constructor(options: GitHubClientOptions = {}) {
    this.token = options.token;
  }

  async searchRepositories(query: string, sort: SearchSort, perPage: number): Promise<GitHubSearchResponse> {
    return this.searchRepositoriesWithRetry(query, sort, perPage, 0);
  }

  async recentStarCounts(fullNames: string[], sinceDaily: string, sinceWeekly: string): Promise<Map<string, RecentStarCount>> {
    const states = fullNames.map((fullName, index) => {
      const [owner, ...nameParts] = fullName.split("/");
      const name = nameParts.join("/");
      if (!owner || !name) {
        throw new Error(`Invalid repository full name: ${fullName}`);
      }

      return {
        alias: `r${index}`,
        fullName,
        owner,
        name,
        after: null as string | null,
        pages: 0,
        done: false,
        dailyStars: 0,
        weeklyStars: 0,
        dailyStarsCapped: false,
        weeklyStarsCapped: false,
        failed: false
      };
    });

    while (states.some((state) => !state.done)) {
      const batch = states.filter((state) => !state.done).slice(0, SETTINGS.recentStarBatchSize);
      let data: Record<string, unknown>;
      try {
        data = await this.fetchRecentStarBatch(batch, 0);
      } catch (error) {
        console.warn(`Skipping recent star batch after retries: ${batch.map((repo) => repo.fullName).join(", ")}`);
        console.warn(error);
        for (const state of batch) {
          state.failed = true;
          state.done = true;
        }
        continue;
      }

      for (const state of batch) {
        const repository = data[state.alias] as GraphQlStargazerRepository | null | undefined;
        state.pages += 1;

        if (!repository) {
          state.done = true;
          continue;
        }

        const edges = repository.stargazers.edges;
        for (const edge of edges) {
          if (edge.starredAt >= sinceDaily) {
            state.dailyStars += 1;
          }
          if (edge.starredAt >= sinceWeekly) {
            state.weeklyStars += 1;
          }
        }

        const lastStarredAt = edges.at(-1)?.starredAt;
        const hasMoreDailyStars = Boolean(lastStarredAt && lastStarredAt >= sinceDaily);
        const hasMoreWeeklyStars = Boolean(lastStarredAt && lastStarredAt >= sinceWeekly);
        const hitPageLimit = state.pages >= SETTINGS.recentStarPages;

        state.dailyStarsCapped = repository.stargazers.pageInfo.hasNextPage && hasMoreDailyStars && hitPageLimit;
        state.weeklyStarsCapped = repository.stargazers.pageInfo.hasNextPage && hasMoreWeeklyStars && hitPageLimit;
        state.done = !repository.stargazers.pageInfo.hasNextPage || !hasMoreWeeklyStars || hitPageLimit;
        state.after = repository.stargazers.pageInfo.endCursor;
      }
    }

    return new Map(
      states
        .filter((state) => !state.failed)
        .map((state) => [
          state.fullName,
          {
            dailyStars: state.dailyStars,
            weeklyStars: state.weeklyStars,
            dailyStarsCapped: state.dailyStarsCapped,
            weeklyStarsCapped: state.weeklyStarsCapped
          }
        ])
    );
  }

  private async searchRepositoriesWithRetry(
    query: string,
    sort: SearchSort,
    perPage: number,
    attempt: number
  ): Promise<GitHubSearchResponse> {
    const url = new URL("/search/repositories", API_ROOT);
    url.searchParams.set("q", query);
    url.searchParams.set("sort", sort);
    url.searchParams.set("order", "desc");
    url.searchParams.set("per_page", String(perPage));

    const response = await fetch(url, {
      headers: this.headers()
    });

    const reset = response.headers.get("x-ratelimit-reset");
    const remaining = response.headers.get("x-ratelimit-remaining");

    if (!response.ok && response.status === 403 && remaining === "0" && reset && attempt < 1) {
      const waitMs = Math.max(0, Number(reset) * 1000 - Date.now() + 2000);
      console.warn(`GitHub rate limit reached. Waiting ${Math.ceil(waitMs / 1000)}s before retrying.`);
      await sleep(waitMs);
      return this.searchRepositoriesWithRetry(query, sort, perPage, attempt + 1);
    }

    if (!response.ok) {
      const resetText = reset ? ` Rate limit resets at ${new Date(Number(reset) * 1000).toISOString()}.` : "";
      const body = await response.text();
      throw new Error(`GitHub search failed (${response.status}) for "${query}".${resetText} ${body}`);
    }

    return (await response.json()) as GitHubSearchResponse;
  }

  private async fetchRecentStarBatch(
    batch: Array<{
      alias: string;
      owner: string;
      name: string;
      after: string | null;
    }>,
    attempt: number
  ): Promise<Record<string, unknown>> {
    const query = `query RecentStars {
      ${batch
        .map(
          (repo) => `${repo.alias}: repository(owner: ${JSON.stringify(repo.owner)}, name: ${JSON.stringify(repo.name)}) {
            stargazers(first: ${SETTINGS.recentStarPerPage}, after: ${repo.after ? JSON.stringify(repo.after) : "null"}, orderBy: {field: STARRED_AT, direction: DESC}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                starredAt
              }
            }
          }`
        )
        .join("\n")}
    }`;

    const response = await this.postGraphQl(query, attempt);

    if (!response.ok && [502, 503, 504].includes(response.status) && attempt < 3) {
      const waitMs = 1500 * 2 ** attempt;
      console.warn(`GitHub GraphQL returned ${response.status}; retrying in ${waitMs}ms.`);
      await sleep(waitMs);
      return this.fetchRecentStarBatch(batch, attempt + 1);
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub GraphQL request failed (${response.status}). ${body}`);
    }

    const result = (await response.json()) as {
      data?: Record<string, unknown>;
      errors?: Array<{ message: string }>;
    };

    if (result.errors?.length) {
      throw new Error(`GitHub GraphQL returned errors: ${result.errors.map((error) => error.message).join("; ")}`);
    }

    return result.data ?? {};
  }

  private async postGraphQl(query: string, attempt: number): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      const response = await fetch(`${API_ROOT}/graphql`, {
        method: "POST",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query }),
        signal: controller.signal
      });

      if (!response.ok && [502, 503, 504].includes(response.status) && attempt < 3) {
        const waitMs = 1500 * 2 ** attempt;
        console.warn(`GitHub GraphQL returned ${response.status}; retrying in ${waitMs}ms.`);
        await sleep(waitMs);
        return this.postGraphQl(query, attempt + 1);
      }

      return response;
    } catch (error) {
      if (attempt < 3) {
        const waitMs = 1500 * 2 ** attempt;
        console.warn(`GitHub GraphQL network error; retrying in ${waitMs}ms.`);
        await sleep(waitMs);
        return this.postGraphQl(query, attempt + 1);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private headers(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "awesome-ai-github-updater"
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type GraphQlStargazerRepository = {
  stargazers: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{
      starredAt: string;
    }>;
  };
};
