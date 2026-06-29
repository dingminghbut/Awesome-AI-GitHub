import { fromRoot, readProjectsData, writeText } from "./fs.js";
import { CATEGORIES } from "./config.js";
import {
  renderCategoryMarkdown,
  renderCategoryPage,
  renderChineseMethodology,
  renderChineseReadme,
  renderChineseStartHere,
  renderChineseWeeklyDigest,
  renderEnglishMethodology,
  renderEnglishReadme,
  renderEnglishStartHere,
  renderEnglishWeeklyDigest,
  renderMethodologyPage,
  renderPage,
  renderStartHerePage,
  renderWeeklyPage
} from "./render.js";

async function main(): Promise<void> {
  const data = await readProjectsData();
  await writeText(fromRoot("README.md"), renderEnglishReadme(data));
  await writeText(fromRoot("README.zh-CN.md"), renderChineseReadme(data));
  await writeText(fromRoot("START_HERE.md"), renderEnglishStartHere(data));
  await writeText(fromRoot("START_HERE.zh-CN.md"), renderChineseStartHere(data));
  await writeText(fromRoot("METHODOLOGY.md"), renderEnglishMethodology(data));
  await writeText(fromRoot("METHODOLOGY.zh-CN.md"), renderChineseMethodology(data));
  await writeText(fromRoot("reports", "weekly-digest.md"), renderEnglishWeeklyDigest(data));
  await writeText(fromRoot("reports", "weekly-digest.zh-CN.md"), renderChineseWeeklyDigest(data));
  await writeText(fromRoot("docs", "index.html"), renderPage(data));
  await writeText(fromRoot("docs", "start-here.html"), renderStartHerePage(data));
  await writeText(fromRoot("docs", "methodology.html"), renderMethodologyPage(data));
  await writeText(fromRoot("docs", "weekly.html"), renderWeeklyPage(data));
  for (const category of CATEGORIES) {
    await writeText(fromRoot("docs", `${category.slug}.html`), renderCategoryPage(data, category.slug));
    await writeText(fromRoot("categories", `${category.slug}.md`), renderCategoryMarkdown(data, category.slug, "en"));
    await writeText(fromRoot("categories", `${category.slug}.zh-CN.md`), renderCategoryMarkdown(data, category.slug, "zh"));
  }
  await writeText(fromRoot("docs", ".nojekyll"), "");
  console.log("Generated README, start-here, methodology, weekly digest, category pages, and Pages output.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
