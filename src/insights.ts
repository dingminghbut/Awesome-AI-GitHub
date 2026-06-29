import { CATEGORIES } from "./config.js";
import type { Project, ProjectsFile } from "./types.js";

export type PickReasonLanguage = "en" | "zh";

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

export function growthText(value: number, capped: boolean): string {
  return `+${new Intl.NumberFormat("en").format(value)}${capped ? "+" : ""}`;
}

function insightScore(project: Project): number {
  return project.dailyStars * 6 + project.weeklyStars * 2.5 + project.hotScore + Math.log10(project.stars + 1) * 5;
}
