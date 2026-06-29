import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { CATEGORIES } from "./config.js";
import { fromRoot, readProjectsData } from "./fs.js";

async function main(): Promise<void> {
  const data = await readProjectsData();
  const errors: string[] = [];

  if (data.projects.length === 0) {
    errors.push("No projects found in data/projects.json.");
  }

  for (const project of data.projects) {
    if (!project.id || !project.fullName || !project.url) {
      errors.push(`Project is missing required identity fields: ${JSON.stringify(project)}`);
    }
    if (!Number.isFinite(project.stars) || project.stars < 0) {
      errors.push(`${project.fullName} has invalid stars.`);
    }
    if (!project.category || project.categories.length === 0) {
      errors.push(`${project.fullName} has no category.`);
    }
  }

  const readme = fromRoot("README.md");
  const chineseReadme = fromRoot("README.zh-CN.md");
  const startHere = fromRoot("START_HERE.md");
  const chineseStartHere = fromRoot("START_HERE.zh-CN.md");
  const methodology = fromRoot("METHODOLOGY.md");
  const weeklyDigest = fromRoot("reports", "weekly-digest.md");
  const page = fromRoot("docs", "index.html");
  const startHerePage = fromRoot("docs", "start-here.html");
  const methodologyPage = fromRoot("docs", "methodology.html");
  const weeklyPage = fromRoot("docs", "weekly.html");
  const firstCategoryPage = fromRoot("docs", `${CATEGORIES[0]?.slug ?? "llm"}.html`);
  const firstCategoryMarkdown = fromRoot("categories", `${CATEGORIES[0]?.slug ?? "llm"}.md`);

  for (const file of [
    readme,
    chineseReadme,
    startHere,
    chineseStartHere,
    methodology,
    weeklyDigest,
    page,
    startHerePage,
    methodologyPage,
    weeklyPage,
    firstCategoryPage,
    firstCategoryMarkdown
  ]) {
    if (!existsSync(file)) {
      errors.push(`${file} is missing.`);
    }
  }

  if (existsSync(readme)) {
    const text = await readFile(readme, "utf8");
    if (!text.includes("Trending Now") || !text.includes("Today's Picks") || !text.includes("Start Here") || !text.includes("Signals")) {
      errors.push("README.md does not look generated.");
    }
  }

  if (existsSync(chineseReadme)) {
    const text = await readFile(chineseReadme, "utf8");
    if (!text.includes("当前热门") || !text.includes("今日精选") || !text.includes("从这里开始") || !text.includes("标签")) {
      errors.push("README.zh-CN.md does not look generated.");
    }
  }

  if (existsSync(startHere)) {
    const text = await readFile(startHere, "utf8");
    if (!text.includes("Choose Your Path") || !text.includes("Ten-Minute Workflow")) {
      errors.push("START_HERE.md does not look generated.");
    }
  }

  if (existsSync(methodology)) {
    const text = await readFile(methodology, "utf8");
    if (!text.includes("Ranking Signals") || !text.includes("No Database")) {
      errors.push("METHODOLOGY.md does not look generated.");
    }
  }

  if (existsSync(weeklyDigest)) {
    const text = await readFile(weeklyDigest, "utf8");
    if (!text.includes("Weekly AI Open-Source Digest") || !text.includes("Projects To Scan")) {
      errors.push("reports/weekly-digest.md does not look generated.");
    }
  }

  if (existsSync(page)) {
    const text = await readFile(page, "utf8");
    if (
      !text.includes("window.__PROJECTS__") ||
      !text.includes("window.__PROJECT_SIGNALS__") ||
      !text.includes("categoryChips") ||
      !text.includes("pickList")
    ) {
      errors.push("docs/index.html does not include the expected dashboard payload.");
    }
  }

  if (existsSync(startHerePage)) {
    const text = await readFile(startHerePage, "utf8");
    if (!text.includes("Start Here") || !text.includes("Ten-Minute Workflow")) {
      errors.push("docs/start-here.html does not look generated.");
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Check passed for ${data.projects.length} projects.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
