import { OFFICIAL_DISCOVERY_SOURCES, SETTINGS } from "./config.js";
import type { OfficialDiscoverySeed, OfficialDiscoverySource } from "./types.js";

const REPOSITORY_HREF_RE = /href=["']\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}[A-Za-z0-9])?)\/([A-Za-z0-9._-]+)(?=["'/?#])/g;

const RESERVED_FIRST_SEGMENTS = new Set([
  "about",
  "account",
  "apps",
  "business",
  "codespaces",
  "collections",
  "contact",
  "customer-stories",
  "dashboard",
  "events",
  "explore",
  "features",
  "git-guides",
  "login",
  "marketplace",
  "new",
  "notifications",
  "organizations",
  "orgs",
  "pricing",
  "pulls",
  "readme",
  "search",
  "settings",
  "showcases",
  "signup",
  "site",
  "sponsors",
  "topics",
  "trending",
  "users",
  "watching"
]);

export async function fetchOfficialDiscoverySeeds(
  sources: readonly OfficialDiscoverySource[] = OFFICIAL_DISCOVERY_SOURCES
): Promise<OfficialDiscoverySeed[]> {
  const seeds = new Map<string, OfficialDiscoverySeed>();

  for (const source of sources) {
    try {
      const html = await fetchOfficialPage(source.url);
      const fullNames = extractRepositoryFullNames(html);
      for (const fullName of fullNames) {
        const key = fullName.toLowerCase();
        const existing = seeds.get(key);
        if (existing) {
          if (!existing.categorySlug && source.categorySlug) {
            existing.categorySlug = source.categorySlug;
          }
          continue;
        }
        if (seeds.size >= SETTINGS.officialDiscoverySeedLimit) {
          continue;
        }

        const seed: OfficialDiscoverySeed = {
          fullName,
          source: source.kind,
          label: source.label,
          url: source.url
        };
        if (source.categorySlug) {
          seed.categorySlug = source.categorySlug;
        }
        seeds.set(key, seed);
      }
    } catch (error) {
      console.warn(`Official discovery source failed: ${source.label} (${source.url})`);
      console.warn(error);
    }
  }

  return [...seeds.values()];
}

export function extractRepositoryFullNames(html: string): string[] {
  const names = new Map<string, string>();
  for (const match of html.matchAll(REPOSITORY_HREF_RE)) {
    const owner = match[1];
    const repo = match[2];
    if (!owner || !repo || !isLikelyRepositoryPath(owner, repo)) {
      continue;
    }

    const fullName = `${owner}/${repo}`;
    names.set(fullName.toLowerCase(), fullName);
  }

  return [...names.values()];
}

async function fetchOfficialPage(url: string, attempt = 0): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "awesome-ai-github-updater"
      },
      signal: controller.signal
    });

    if (!response.ok && [429, 500, 502, 503, 504].includes(response.status) && attempt < 2) {
      const waitMs = 1500 * 2 ** attempt;
      console.warn(`GitHub discovery page returned ${response.status}; retrying in ${waitMs}ms.`);
      await sleep(waitMs);
      return fetchOfficialPage(url, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(`GitHub discovery page failed (${response.status}) for ${url}.`);
    }

    return response.text();
  } catch (error) {
    if (attempt < 2) {
      const waitMs = 1500 * 2 ** attempt;
      console.warn(`GitHub discovery page network error; retrying in ${waitMs}ms.`);
      await sleep(waitMs);
      return fetchOfficialPage(url, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function isLikelyRepositoryPath(owner: string, repo: string): boolean {
  const lowerOwner = owner.toLowerCase();
  const lowerRepo = repo.toLowerCase();
  if (RESERVED_FIRST_SEGMENTS.has(lowerOwner)) {
    return false;
  }
  if (lowerRepo.endsWith(".atom") || lowerRepo.endsWith(".rss")) {
    return false;
  }
  if (["followers", "following", "repositories", "stars"].includes(lowerRepo)) {
    return false;
  }
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
