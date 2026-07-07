import { CATEGORIES, COMMERCE_PLATFORM_KEYWORDS } from "./config.js";
import { daysBetweenUtc } from "./date.js";
import type { GitHubSearchItem, Project, RecentStarCount, Snapshot } from "./types.js";

type Candidate = {
  item: GitHubSearchItem;
  matchedCategories: Set<string>;
};

export function addCandidate(candidates: Map<number, Candidate>, item: GitHubSearchItem, categorySlug: string): void {
  if (item.archived || item.disabled || item.fork) {
    return;
  }

  if (!isCommerceRelevant(item)) {
    return;
  }

  const existing = candidates.get(item.id);
  if (existing) {
    existing.matchedCategories.add(categorySlug);
    if (new Date(item.pushed_at ?? item.updated_at) > new Date(existing.item.pushed_at ?? existing.item.updated_at)) {
      existing.item = item;
    }
    return;
  }

  candidates.set(item.id, {
    item,
    matchedCategories: new Set([categorySlug])
  });
}

export function toProjects(candidates: Iterable<Candidate>, fetchedAt: string): Project[] {
  return Array.from(candidates, (candidate) => {
    const categories = classify(candidate.item, candidate.matchedCategories);
    const primaryCategory = categories[0] ?? "llm";
    return {
      id: candidate.item.id,
      name: candidate.item.name,
      fullName: candidate.item.full_name,
      owner: candidate.item.owner.login,
      url: candidate.item.html_url,
      avatarUrl: candidate.item.owner.avatar_url,
      description: candidate.item.description?.trim() || "No description provided.",
      stars: candidate.item.stargazers_count,
      forks: candidate.item.forks_count,
      watchers: candidate.item.watchers_count,
      openIssues: candidate.item.open_issues_count,
      language: candidate.item.language ?? "Unknown",
      topics: candidate.item.topics ?? [],
      license: candidate.item.license?.spdx_id || candidate.item.license?.name || "Unknown",
      homepage: candidate.item.homepage ?? "",
      createdAt: candidate.item.created_at,
      updatedAt: candidate.item.updated_at,
      pushedAt: candidate.item.pushed_at ?? candidate.item.updated_at,
      category: primaryCategory,
      categories,
      dailyStars: 0,
      weeklyStars: 0,
      dailyStarsCapped: false,
      weeklyStarsCapped: false,
      starGrowthSource: "snapshots",
      hotScore: 0,
      fetchedAt
    };
  });
}

export function applyDeltas(projects: Project[], snapshots: Snapshot[], today: string): Project[] {
  const dailyBaseline = findBaseline(snapshots, today, 1);
  const weeklyBaseline = findBaseline(snapshots, today, 7);
  const dailyStars = snapshotStars(dailyBaseline);
  const weeklyStars = snapshotStars(weeklyBaseline);
  const hasAnyBaseline = Boolean(dailyBaseline || weeklyBaseline);

  return projects
    .map((project) => {
      const daily = deltaFrom(project, dailyStars);
      const weekly = deltaFrom(project, weeklyStars);
      return {
        ...project,
        dailyStars: daily,
        weeklyStars: weekly,
        dailyStarsCapped: false,
        weeklyStarsCapped: false,
        starGrowthSource: "snapshots" as const,
        hotScore: hotScore(project, daily, weekly, hasAnyBaseline)
      };
    })
    .sort((a, b) => b.hotScore - a.hotScore || b.weeklyStars - a.weeklyStars || b.dailyStars - a.dailyStars || b.stars - a.stars);
}

export function applyRecentStarCounts(projects: Project[], recentStars: Map<string, RecentStarCount>): Project[] {
  return projects
    .map((project) => {
      const recent = recentStars.get(project.fullName);
      if (!recent) {
        return project;
      }

      return {
        ...project,
        dailyStars: recent.dailyStars,
        weeklyStars: recent.weeklyStars,
        dailyStarsCapped: recent.dailyStarsCapped,
        weeklyStarsCapped: recent.weeklyStarsCapped,
        starGrowthSource: "stargazers" as const,
        hotScore: hotScore(project, recent.dailyStars, recent.weeklyStars, true)
      };
    })
    .sort((a, b) => b.hotScore - a.hotScore || b.weeklyStars - a.weeklyStars || b.dailyStars - a.dailyStars || b.stars - a.stars);
}

export function toSnapshot(projects: Project[], date: string, generatedAt: string): Snapshot {
  return {
    date,
    generatedAt,
    projects: projects.map((project) => ({
      id: project.id,
      fullName: project.fullName,
      stars: project.stars,
      forks: project.forks,
      category: project.category,
      pushedAt: project.pushedAt
    }))
  };
}

function classify(item: GitHubSearchItem, matchedCategories: Set<string>): string[] {
  const haystack = [
    item.name,
    item.full_name,
    item.description ?? "",
    item.language ?? "",
    ...(item.topics ?? [])
  ]
    .join(" ")
    .toLowerCase();

  const scored = CATEGORIES.map((category) => {
    const keywordScore = category.keywords.reduce((score, keyword) => score + (haystack.includes(keyword.toLowerCase()) ? 2 : 0), 0);
    const topicScore = (item.topics ?? []).some((topic) => category.keywords.includes(topic.toLowerCase())) ? 4 : 0;
    const matchedScore = matchedCategories.has(category.slug) ? 8 : 0;
    return {
      slug: category.slug,
      score: keywordScore + topicScore + matchedScore
    };
  })
    .filter((category) => category.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const slugs = scored.map((category) => category.slug);
  for (const slug of matchedCategories) {
    if (!slugs.includes(slug)) {
      slugs.push(slug);
    }
  }

  return slugs.length > 0 ? slugs.slice(0, 3) : ["llm"];
}

function isCommerceRelevant(item: GitHubSearchItem): boolean {
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

  const relevanceKeywords = [
    ...COMMERCE_PLATFORM_KEYWORDS,
    "ecommerce",
    "e-commerce",
    "commerce",
    "shopping",
    "shop",
    "store",
    "seller",
    "merchant",
    "retail",
    "customer service",
    "customer support",
    "product",
    "catalog",
    "sku",
    "listing",
    "pricing",
    "order",
    "inventory",
    "fulfillment",
    "warehouse",
    "delivery",
    "fashion",
    "try-on",
    "ad creative",
    "marketing",
    "campaign",
    "conversion",
    "attribution",
    "sales",
    "商品",
    "电商",
    "店铺",
    "商家",
    "零售",
    "导购",
    "客服",
    "选品",
    "上架",
    "投放",
    "订单",
    "库存",
    "履约",
    "营销",
    "转化"
  ] as const;

  return relevanceKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function findBaseline(snapshots: Snapshot[], today: string, days: number): Snapshot | null {
  const targetDate = dateBefore(today, days);
  const olderThanTarget = snapshots
    .filter((snapshot) => snapshot.date <= targetDate)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (olderThanTarget[0]) {
    return olderThanTarget[0];
  }

  return snapshots
    .filter((snapshot) => snapshot.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

function snapshotStars(snapshot: Snapshot | null): Map<number, number> {
  return new Map(snapshot?.projects.map((project) => [project.id, project.stars]) ?? []);
}

function deltaFrom(project: Project, stars: Map<number, number>): number {
  const previous = stars.get(project.id);
  if (previous === undefined) {
    return 0;
  }
  return Math.max(0, project.stars - previous);
}

function hotScore(project: Project, dailyStars: number, weeklyStars: number, hasAnyBaseline: boolean): number {
  const ageDays = Math.max(30, daysBetweenUtc(project.createdAt));
  const pushedDays = daysBetweenUtc(project.pushedAt);
  const velocity = Math.min(40, project.stars / ageDays);
  const freshness = Math.max(0, 30 - pushedDays) / 30;
  const starFallbackWeight = hasAnyBaseline ? 3 : 14;

  return round(
    dailyStars * 20 +
      weeklyStars * 8 +
      Math.log10(project.stars + 1) * starFallbackWeight +
      velocity * 2 +
      freshness * 8
  );
}

function dateBefore(date: string, days: number): string {
  const current = new Date(`${date}T00:00:00.000Z`);
  current.setUTCDate(current.getUTCDate() - days);
  return current.toISOString().slice(0, 10);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
