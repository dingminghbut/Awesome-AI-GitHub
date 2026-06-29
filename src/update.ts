import { CATEGORIES, SETTINGS, buildSearchJobs } from "./config.js";
import { daysAgoUtc, todayUtc } from "./date.js";
import { fromRoot, readSnapshots, writeJson } from "./fs.js";
import { GitHubClient } from "./github.js";
import { addCandidate, applyDeltas, applyRecentStarCounts, toProjects, toSnapshot } from "./rank.js";
import type { GitHubSearchItem, ProjectsFile } from "./types.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const generatedAt = new Date().toISOString();
const today = todayUtc();
const activeSince = daysAgoUtc(SETTINGS.activeDays);
const sinceDaily = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const sinceWeekly = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const delayMs = Number(process.env.SEARCH_DELAY_MS ?? (token ? 300 : 6500));

async function main(): Promise<void> {
  const jobs = buildSearchJobs(activeSince);
  const client = new GitHubClient({ token });
  const candidates = new Map<number, { item: GitHubSearchItem; matchedCategories: Set<string> }>();

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

  const snapshots = await readSnapshots();
  let projects = applyDeltas(toProjects(candidates.values(), generatedAt), snapshots, today).slice(0, SETTINGS.maxProjects);
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
      name: "GitHub REST Search API",
      url: "https://docs.github.com/rest/search/search#search-repositories",
      ranking: "Hot score based on 24h/7d star deltas, repository freshness, and a first-run stars fallback."
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
