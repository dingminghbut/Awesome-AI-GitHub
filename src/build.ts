import { fromRoot, readProjectsData, writeText } from "./fs.js";
import {
  renderChineseMethodology,
  renderChineseReadme,
  renderChineseWeeklyDigest,
  renderEnglishMethodology,
  renderEnglishReadme,
  renderEnglishWeeklyDigest,
  renderMethodologyPage,
  renderPage,
  renderWeeklyPage
} from "./render.js";

async function main(): Promise<void> {
  const data = await readProjectsData();
  await writeText(fromRoot("README.md"), renderEnglishReadme(data));
  await writeText(fromRoot("README.zh-CN.md"), renderChineseReadme(data));
  await writeText(fromRoot("METHODOLOGY.md"), renderEnglishMethodology(data));
  await writeText(fromRoot("METHODOLOGY.zh-CN.md"), renderChineseMethodology(data));
  await writeText(fromRoot("reports", "weekly-digest.md"), renderEnglishWeeklyDigest(data));
  await writeText(fromRoot("reports", "weekly-digest.zh-CN.md"), renderChineseWeeklyDigest(data));
  await writeText(fromRoot("docs", "index.html"), renderPage(data));
  await writeText(fromRoot("docs", "methodology.html"), renderMethodologyPage(data));
  await writeText(fromRoot("docs", "weekly.html"), renderWeeklyPage(data));
  await writeText(fromRoot("docs", ".nojekyll"), "");
  console.log("Generated README, methodology, weekly digest, and Pages output.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
