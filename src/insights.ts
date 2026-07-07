import { CATEGORIES, COMMERCE_PLATFORM_KEYWORDS, COMMERCE_SKILL_KEYWORDS } from "./config.js";
import { daysBetweenUtc } from "./date.js";
import type { Project, ProjectsFile } from "./types.js";

export type PickReasonLanguage = "en" | "zh";
export type ProjectSignal = {
  slug: string;
  en: string;
  zh: string;
};

export function todaysPicks(projects: Project[], count = 5): Project[] {
  const selected: Project[] = [];
  const usedCategories = new Set<string>();
  const sorted = [...projects].sort((a, b) => insightScore(b) - insightScore(a) || b.stars - a.stars);

  for (const project of sorted) {
    if (selected.length >= count) {
      break;
    }
    if (usedCategories.has(project.category) && selected.length < Math.min(count, CATEGORIES.length)) {
      continue;
    }
    selected.push(project);
    usedCategories.add(project.category);
  }

  for (const project of sorted) {
    if (selected.length >= count) {
      break;
    }
    if (!selected.some((item) => item.id === project.id)) {
      selected.push(project);
    }
  }

  return selected;
}

export function weeklyDigestProjects(projects: Project[], count = 20): Project[] {
  return [...projects]
    .sort((a, b) => b.weeklyStars - a.weeklyStars || b.dailyStars - a.dailyStars || b.hotScore - a.hotScore || b.stars - a.stars)
    .slice(0, count);
}

export function categoryGrowthSummary(data: ProjectsFile): Array<{
  slug: string;
  nameEn: string;
  nameZh: string;
  count: number;
  weeklyStars: number;
  dailyStars: number;
}> {
  return data.categories
    .map((category) => {
      const projects = data.projects.filter((project) => project.category === category.slug);
      return {
        slug: category.slug,
        nameEn: category.nameEn,
        nameZh: category.nameZh,
        count: projects.length,
        weeklyStars: projects.reduce((sum, project) => sum + project.weeklyStars, 0),
        dailyStars: projects.reduce((sum, project) => sum + project.dailyStars, 0)
      };
    })
    .sort((a, b) => b.weeklyStars - a.weeklyStars || b.dailyStars - a.dailyStars || b.count - a.count);
}

export function pickReason(project: Project, language: PickReasonLanguage): string {
  const category = CATEGORIES.find((item) => item.slug === project.category);
  const categoryName = language === "zh" ? category?.nameZh : category?.nameEn;
  const weekly = growthText(project.weeklyStars, project.weeklyStarsCapped);
  const daily = growthText(project.dailyStars, project.dailyStarsCapped);

  if (language === "zh") {
    if (project.weeklyStars > 0 || project.dailyStars > 0) {
      return `近期关注度很高：7 日增星 ${weekly}，24 小时增星 ${daily}，属于 ${categoryName ?? project.category} 方向。`;
    }
    return `总 stars 和近期活跃度较高，适合作为 ${categoryName ?? project.category} 方向的基准项目观察。`;
  }

  if (project.weeklyStars > 0 || project.dailyStars > 0) {
    return `Strong recent attention: ${weekly} stars over 7d and ${daily} over 24h in ${categoryName ?? project.category}.`;
  }
  return `High overall traction and recent activity make it a useful baseline to watch in ${categoryName ?? project.category}.`;
}

export function projectSignals(project: Project): ProjectSignal[] {
  const text = searchableProjectText(project);
  const signals: ProjectSignal[] = [];

  if (project.dailyStars > 25 || project.weeklyStars > 100) {
    signals.push({ slug: "fast-growing", en: "Fast growing", zh: "增长快" });
  }

  if (daysBetweenUtc(project.pushedAt) <= 30) {
    signals.push({ slug: "active", en: "Recently active", zh: "近期活跃" });
  }

  if (containsAny(text, [...COMMERCE_SKILL_KEYWORDS, ...COMMERCE_PLATFORM_KEYWORDS, "seller", "merchant", "commerce", "retail"])) {
    signals.push({ slug: "commerce-skill", en: "Commerce skill", zh: "电商技能" });
  }

  if (project.license !== "Unknown" && project.license !== "NOASSERTION") {
    signals.push({ slug: "open-license", en: "Open license", zh: "开源许可" });
  }

  if (project.homepage || containsAny(text, ["docs", "documentation", "guide", "tutorial", "quickstart"])) {
    signals.push({ slug: "docs", en: "Docs available", zh: "有文档" });
  }

  if (containsAny(text, ["beginner", "starter", "example", "examples", "course", "tutorial", "awesome", "template"])) {
    signals.push({ slug: "starter", en: "Good starting point", zh: "适合入门" });
  }

  if (
    containsAny(text, ["production", "deploy", "deployment", "serving", "scale", "enterprise", "workflow"]) ||
    (project.stars >= 5000 && daysBetweenUtc(project.pushedAt) <= 60)
  ) {
    signals.push({ slug: "production", en: "Production oriented", zh: "偏生产可用" });
  }

  if (containsAny(text, ["paper", "arxiv", "research", "benchmark", "evaluation", "eval", "leaderboard"])) {
    signals.push({ slug: "research", en: "Research signal", zh: "研究/评测" });
  }

  if (containsAny(text, ["self-hosted", "self hosted", "local", "offline", "private", "privacy"])) {
    signals.push({ slug: "self-hosted", en: "Self-host friendly", zh: "适合自托管" });
  }

  if (containsAny(text, ["demo", "playground", "webui", "web-ui", "ui", "app"])) {
    signals.push({ slug: "demo", en: "Demo or app", zh: "有演示/应用" });
  }

  return dedupeSignals(signals).slice(0, 4);
}

export function projectSignalText(project: Project, language: PickReasonLanguage): string {
  const signals = projectSignals(project);
  if (signals.length === 0) {
    return language === "zh" ? "值得观察" : "Worth watching";
  }
  return signals.map((signal) => (language === "zh" ? signal.zh : signal.en)).join(", ");
}

export function growthText(value: number, capped: boolean): string {
  return `+${new Intl.NumberFormat("en").format(value)}${capped ? "+" : ""}`;
}

function insightScore(project: Project): number {
  return project.dailyStars * 6 + project.weeklyStars * 2.5 + project.hotScore + Math.log10(project.stars + 1) * 5;
}

function searchableProjectText(project: Project): string {
  return [project.fullName, project.description, project.language, project.license, project.homepage, project.topics.join(" ")]
    .join(" ")
    .toLowerCase();
}

function containsAny(value: string, needles: readonly string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function dedupeSignals(signals: ProjectSignal[]): ProjectSignal[] {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    if (seen.has(signal.slug)) {
      return false;
    }
    seen.add(signal.slug);
    return true;
  });
}
