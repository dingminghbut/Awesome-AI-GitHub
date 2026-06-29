import type { GitHubSearchResponse, SearchSort } from "./types.js";

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
