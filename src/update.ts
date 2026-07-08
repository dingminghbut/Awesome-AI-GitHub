import { CATEGORIES, SETTINGS, buildSearchJobs } from "./config.js";
import { daysAgoUtc, todayUtc } from "./date.js";
import { fetchOfficialDiscoverySeeds } from "./discovery.js";
import { fromRoot, readSnapshots, writeJson } from "./fs.js";
import { GitHubClient } from "./github.js";
import { addCandidate, applyDeltas, applyRecentStarCounts, toProjects, toSnapshot } from "./rank.js";
import type { GitHubSearchItem, OfficialDiscoverySeed, ProjectsFile } from "./types.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const generatedAt = new Date().toISOString();
const today = todayUtc();
const activeSince = daysAgoUtc(SETTINGS.activeDays);
const sinceDaily = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const sinceWeekly = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const delayMs = Number(process.env.SEARCH_DELAY_MS ?? (token ? 300 : 6500));
const repoDelayMs = Number(process.env.REPO_FETCH_DELAY_MS ?? (token ? 100 : 1200));
const officialDiscoveryEnabled = process.env.OFFICIAL_DISCOVERY !== "false";

type CandidateMap = Map<number, { item: GitHubSearchItem; matchedCategories: Set<string> }>;

const OFFICIAL_DISCOVERY_SCOPE_KEYWORDS = [
  "ai",
  "artificial intelligence",
  "machine learning",
  "ml",
  "llm",
  "gpt",
  "chatgpt",
  "openai",
  "claude",
  "agent",
  "agents",
  "copilot",
  "rag",
  "embedding",
  "vector",
  "semantic",
  "generative",
  "diffusion",
  "computer vision",
  "recommendation",
  "recommender",
  "automation",
  "workflow",
  "skill",
  "skills",
  "playbook",
  "prompt",
  "chatbot",
  "bot",
  "analytics",
  "attribution",
  "ab testing",
  "robot",
  "robotics",
  "vision",
  "智能",
  "智能体",
  "大模型",
  "自动化",
  "生成",
  "技能",
  "运营"
] as const;

async function main(): Promise<void> {
  const jobs = buildSearchJobs(activeSince);
  const client = new GitHubClient({ token });
  const candidates: CandidateMap = new Map();

  console.log(`Fetching ${jobs.length} GitHub search slices since ${activeSince}.`);
  console.log(token ? "Using authenticated GitHub API requests." : "No token found; using slower unauthenticated requests.");

  for (const [index, job] of jobs.entries()) {
    console.log(`[${index + 1}/${jobs.length}] ${job.categorySlug} ${job.sort}: ${job.query}`);
    const result = await client.searchRepositories(job.query, job.sort, SETTINGS.perPage);
    for (const item of result.items) {
      addCandidate(candidates, item, job.categorySlug);
    }
    if (index < jobs.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  if (officialDiscoveryEnabled) {
    await addOfficialDiscoveryCandidates(client, candidates);
  } else {
    console.log("Official discovery sources disabled by OFFICIAL_DISCOVERY=false.");
  }

  const snapshots = await readSnapshots();
  let projects = applyDeltas(toProjects(candidates.values(), generatedAt), snapshots, today).slice(0, SETTINGS.maxProjects);
  if (token) {
    try {
      console.log(`Fetching recent stargazers for ${projects.length} repositories.`);
      const recentStars = await client.recentStarCounts(
        projects.map((project) => project.fullName),
        sinceDaily,
        sinceWeekly
      );
      projects = applyRecentStarCounts(projects, recentStars).slice(0, SETTINGS.maxProjects);
    } catch (error) {
      console.warn("Recent stargazer lookup failed; falling back to snapshot deltas.");
      console.warn(error);
    }
  } else {
    console.log("No token found; skipping recent stargazer lookup and using snapshot deltas.");
  }
  const data = buildProjectsFile(projects);
  const snapshot = toSnapshot(projects, today, generatedAt);

  if (dryRun) {
    console.log(`Dry run complete. ${projects.length} projects found.`);
    for (const [index, project] of projects.slice(0, 10).entries()) {
      console.log(`${index + 1}. ${project.fullName} stars=${project.stars} +24h=${project.dailyStars} +7d=${project.weeklyStars}`);
    }
    return;
  }

  await writeJson(fromRoot("data", "projects.json"), data);
  await writeJson(fromRoot("data", "snapshots", `${today}.json`), snapshot);
  console.log(`Wrote ${projects.length} projects to data/projects.json and data/snapshots/${today}.json.`);
}

function buildProjectsFile(projects: ReturnType<typeof applyDeltas>): ProjectsFile {
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);

  return {
    generatedAt,
    date: today,
    source: {
      name: "GitHub REST Search API + official GitHub discovery pages",
      url: "https://github.com/explore",
      ranking: "Hot score based on 24h/7d star deltas, repository freshness, Search/API discovery, and official Trending/Topics/Explore seeds."
    },
    summary: {
      totalProjects: projects.length,
      totalStars,
      totalForks,
      categories: CATEGORIES.length,
      topDailyGrowth: Math.max(0, ...projects.map((project) => project.dailyStars)),
      topWeeklyGrowth: Math.max(0, ...projects.map((project) => project.weeklyStars))
    },
    categories: CATEGORIES.map((category) => ({
      slug: category.slug,
      nameEn: category.nameEn,
      nameZh: category.nameZh,
      descriptionEn: category.descriptionEn,
      descriptionZh: category.descriptionZh,
      count: projects.filter((project) => project.category === category.slug).length
    })),
    projects
  };
}

async function addOfficialDiscoveryCandidates(client: GitHubClient, candidates: CandidateMap): Promise<void> {
  const seeds = await fetchOfficialDiscoverySeeds();
  const selectedSeeds = selectBalancedSeeds(seeds, SETTINGS.officialDiscoveryRepoLimit);
  const before = candidates.size;
  let lookedUp = 0;
  let inScope = 0;

  console.log(`Official discovery found ${seeds.length} unique repo seeds (${summarizeSeeds(seeds)}).`);
  console.log(`Looking up ${selectedSeeds.length} official discovery repositories.`);

  for (const [index, seed] of selectedSeeds.entries()) {
    try {
      const item = await client.getRepository(seed.fullName);
      lookedUp += 1;
      if (!officialDiscoveryMatchesScope(item)) {
        continue;
      }
      inScope += 1;
      addCandidate(candidates, item, seed.categorySlug);
    } catch (error) {
      console.warn(`Skipping official discovery seed ${seed.fullName} from ${seed.label}.`);
      console.warn(error);
    }

    if (index < selectedSeeds.length - 1 && repoDelayMs > 0) {
      await sleep(repoDelayMs);
    }
  }

  console.log(`Official discovery looked up ${lookedUp}/${selectedSeeds.length}; ${inScope} matched AI/skill scope; candidate pool ${before} -> ${candidates.size}.`);
}

function selectBalancedSeeds(seeds: OfficialDiscoverySeed[], limit: number): OfficialDiscoverySeed[] {
  const groups = new Map<string, OfficialDiscoverySeed[]>();
  for (const seed of seeds) {
    const group = groups.get(seed.label);
    if (group) {
      group.push(seed);
    } else {
      groups.set(seed.label, [seed]);
    }
  }

  const selected: OfficialDiscoverySeed[] = [];
  while (selected.length < limit && [...groups.values()].some((group) => group.length > 0)) {
    for (const group of groups.values()) {
      const seed = group.shift();
      if (!seed) {
        continue;
      }
      selected.push(seed);
      if (selected.length >= limit) {
        break;
      }
    }
  }

  return selected;
}

function summarizeSeeds(seeds: OfficialDiscoverySeed[]): string {
  const counts = new Map<string, number>();
  for (const seed of seeds) {
    counts.set(seed.source, (counts.get(seed.source) ?? 0) + 1);
  }

  return [...counts.entries()].map(([source, count]) => `${source}=${count}`).join(", ");
}

function officialDiscoveryMatchesScope(item: GitHubSearchItem): boolean {
  const text = [
    item.name,
    item.full_name,
    item.description ?? "",
    item.homepage ?? "",
    item.language ?? "",
    ...(item.topics ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return OFFICIAL_DISCOVERY_SCOPE_KEYWORDS.some((keyword) => includesKeyword(text, keyword));
}

function includesKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase();
  if (/^[a-z0-9+#.-]{1,3}$/.test(normalizedKeyword)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}(?=$|[^a-z0-9])`).test(text);
  }
  return text.includes(normalizedKeyword);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
