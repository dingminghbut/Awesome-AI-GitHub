import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
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
  const page = fromRoot("docs", "index.html");

  for (const file of [readme, chineseReadme, page]) {
    if (!existsSync(file)) {
      errors.push(`${file} is missing.`);
    }
  }

  if (existsSync(readme)) {
    const text = await readFile(readme, "utf8");
    if (!text.includes("Trending Now") || !text.includes("Live dashboard")) {
      errors.push("README.md does not look generated.");
    }
  }

  if (existsSync(chineseReadme)) {
    const text = await readFile(chineseReadme, "utf8");
    if (!text.includes("当前热门") || !text.includes("在线榜单")) {
      errors.push("README.zh-CN.md does not look generated.");
    }
  }

  if (existsSync(page)) {
    const text = await readFile(page, "utf8");
    if (!text.includes("window.__PROJECTS__") || !text.includes("categoryChips")) {
      errors.push("docs/index.html does not include the expected dashboard payload.");
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
