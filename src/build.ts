import { fromRoot, readProjectsData, writeText } from "./fs.js";
import { renderChineseReadme, renderEnglishReadme, renderPage } from "./render.js";

async function main(): Promise<void> {
  const data = await readProjectsData();
  await writeText(fromRoot("README.md"), renderEnglishReadme(data));
  await writeText(fromRoot("README.zh-CN.md"), renderChineseReadme(data));
  await writeText(fromRoot("docs", "index.html"), renderPage(data));
  await writeText(fromRoot("docs", ".nojekyll"), "");
  console.log("Generated README.md, README.zh-CN.md, and docs/index.html.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
