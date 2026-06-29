import { CATEGORIES, REPOSITORY, SETTINGS } from "./config.js";
import { formatDate, formatDateTime } from "./date.js";
import {
  categoryGrowthSummary,
  pickReason,
  projectSignals,
  projectSignalText,
  todaysPicks,
  weeklyDigestProjects
} from "./insights.js";
import type { Project, ProjectsFile } from "./types.js";

export function renderEnglishReadme(data: ProjectsFile): string {
  const picks = todaysPicks(data.projects);
  const topProjects = data.projects.slice(0, 30);
  const topNew = newestProjects(data.projects).slice(0, 10);

  return `# Awesome AI GitHub

Daily AI open-source radar: discover fast-growing LLM, Agent, RAG, Generative AI, and AI infrastructure projects before they go mainstream.

[中文](README.zh-CN.md) | [Start Here](START_HERE.md) | [Live dashboard](${REPOSITORY.pagesUrl}) | [Weekly digest](reports/weekly-digest.md) | [Methodology](METHODOLOGY.md) | [Suggest a project](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml) | [Data](data/projects.json)

> Descriptions are kept in their original GitHub language. This repository uses bilingual navigation and labels without paid translation services.

## Why This Exists

AI open source moves too fast for a static bookmark list. This repo refreshes every day, keeps lightweight historical snapshots, and highlights projects that are gaining attention now so builders, researchers, and founders can find useful work earlier.

## Start Here

- Want a quick scan? Open the [live dashboard](${REPOSITORY.pagesUrl}) and sort by the default hot ranking.
- Looking for what changed this week? Read the [weekly digest](reports/weekly-digest.md).
- Exploring a specific area? Use the category pages on GitHub Pages or jump to the category list below.
- Evaluating whether a repo is useful? Check the signals column for activity, docs, licensing, production readiness, and self-hosting hints.

## Snapshot

- Last updated: ${formatDateTime(data.generatedAt)} UTC
- Projects tracked: ${formatNumber(data.summary.totalProjects)}
- Total stars: ${formatNumber(data.summary.totalStars)}
- Ranking signal: 24h/7d star growth, repository freshness, and a first-run stars fallback
- A trailing \`+\` on growth numbers means GitHub returned at least that many recent stars.

## Today's Picks

${picksList(picks, "en")}

## Trending Now

${projectTable(topProjects, "en")}

## Rising New Projects

${projectTable(topNew, "en")}

## Categories

${data.categories
  .map((category) => `- [**${category.nameEn}**](${REPOSITORY.pagesUrl}${category.slug}.html) (${category.count}) - ${category.descriptionEn}`)
  .join("\n")}

## Automation

The repository updates itself every day with GitHub Actions. The workflow uses the built-in \`GITHUB_TOKEN\`, fetches public repository data from the GitHub REST Search API, stores a daily snapshot, and regenerates the README files plus the GitHub Pages dashboard.

## Contributing

Know a useful AI project that should be tracked? [Suggest it here](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml). Good submissions include a working repository URL, the category, and a short note about who benefits from it.

## Notes

- Ranking becomes more accurate after several daily snapshots exist.
- Missing repository metadata such as license, homepage, or topics is shown as \`Unknown\`.
- The static dashboard is generated into \`docs/index.html\` and served by GitHub Pages from the \`docs/\` directory.
`;
}

export function renderChineseReadme(data: ProjectsFile): string {
  const picks = todaysPicks(data.projects);
  const topProjects = data.projects.slice(0, 30);
  const topNew = newestProjects(data.projects).slice(0, 10);

  return `# Awesome AI GitHub

每日 AI 开源雷达：更早发现正在快速增长的 LLM、Agent、RAG、生成式 AI 与 AI 基础设施项目。

[English](README.md) | [从这里开始](START_HERE.zh-CN.md) | [在线榜单](${REPOSITORY.pagesUrl}) | [每周摘要](reports/weekly-digest.zh-CN.md) | [排名方法](METHODOLOGY.zh-CN.md) | [推荐项目](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml) | [数据文件](data/projects.json)

> 项目描述保留 GitHub 原文。本仓库使用中英双语导航、标签和说明，不依赖付费翻译服务。

## 为什么做这个

AI 开源变化太快，静态收藏夹很容易过期。本仓库每天自动刷新，保留轻量历史快照，并突出正在获得关注的项目，帮助开发者、研究者和创业者更早发现有价值的开源工作。

## 从这里开始

- 想快速浏览：打开[在线榜单](${REPOSITORY.pagesUrl})，默认就是综合热度排序。
- 想看本周变化：阅读[每周摘要](reports/weekly-digest.zh-CN.md)。
- 想按方向探索：使用 GitHub Pages 里的分类专题页，或直接看下面的分类列表。
- 想判断项目是否值得投入时间：看“标签”列里的活跃度、文档、许可、生产可用、自托管等信号。

## 今日快照

- 更新时间：${formatDateTime(data.generatedAt)} UTC
- 收录项目：${formatNumber(data.summary.totalProjects)}
- 累计 Stars：${formatNumber(data.summary.totalStars)}
- 排名信号：24h/7d 增星、项目新鲜度，以及首次运行时的 stars 兜底排序
- 增星数字后面的 \`+\` 表示 GitHub 至少返回了这么多近期 stars。

## 今日精选

${picksList(picks, "zh")}

## 当前热门

${projectTable(topProjects, "zh")}

## 新锐项目

${projectTable(topNew, "zh")}

## 分类

${data.categories
  .map((category) => `- [**${category.nameZh}**](${REPOSITORY.pagesUrl}${category.slug}.html) (${category.count}) - ${category.descriptionZh}`)
  .join("\n")}

## 自动化

仓库每天通过 GitHub Actions 自动更新。工作流使用内置 \`GITHUB_TOKEN\`，从 GitHub REST Search API 抓取公开仓库数据，保存每日快照，并重新生成中英 README 与 GitHub Pages 榜单页面。

## 参与贡献

如果你知道值得追踪的 AI 开源项目，可以[在这里推荐](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml)。好的推荐应包含仓库链接、分类，以及这个项目能帮到哪类人的一句话说明。

## 说明

- 连续运行数天后，增星排名会更准确。
- 仓库缺少 license、homepage 或 topics 等信息时显示为 \`Unknown\`。
- 静态榜单生成到 \`docs/index.html\`，可通过 GitHub Pages 从 \`docs/\` 目录发布。
`;
}

export function renderEnglishStartHere(data: ProjectsFile): string {
  const picks = todaysPicks(data.projects, 7);
  const rising = weeklyDigestProjects(data.projects, 10);

  return `# Start Here

[Back to README](${REPOSITORY.url}#readme) | [Live dashboard](${REPOSITORY.pagesUrl}) | [Weekly digest](reports/weekly-digest.md) | [Methodology](METHODOLOGY.md)

Awesome AI GitHub is designed for people who want to find useful AI open-source projects quickly, without manually refreshing dozens of trending pages.

## Choose Your Path

- Building with LLMs or chat interfaces: start with [LLM & Chatbots](${REPOSITORY.pagesUrl}llm.html).
- Building agents or automated workflows: start with [Agents](${REPOSITORY.pagesUrl}agents.html).
- Building knowledge-base apps: start with [RAG & Knowledge](${REPOSITORY.pagesUrl}rag.html).
- Building image, video, audio, or creative tools: start with [Generative AI](${REPOSITORY.pagesUrl}generative-ai.html).
- Deploying or operating models: start with [AI Infrastructure](${REPOSITORY.pagesUrl}ai-infra.html).
- Comparing model quality: start with [Evaluation & Benchmarks](${REPOSITORY.pagesUrl}evaluation.html).
- Exploring embodied systems: start with [Robotics & Embodied AI](${REPOSITORY.pagesUrl}robotics.html).

## How To Read The Signals

- Fast growing: recent 24h or 7d star movement is unusually strong.
- Recently active: the repository was pushed recently.
- Docs available: homepage, docs topics, or documentation language exists.
- Good starting point: examples, tutorials, templates, or beginner-friendly wording appears.
- Production oriented: deploy, serving, workflow, scale, or strong active traction signals are present.
- Research signal: papers, benchmarks, evaluation, or leaderboard language appears.
- Self-host friendly: local, private, offline, or self-hosting language appears.

## Ten-Minute Workflow

1. Open the [live dashboard](${REPOSITORY.pagesUrl}) and scan Today's Picks.
2. Filter by the category closest to your current work.
3. Prioritize projects with useful signals for your context, not only the highest star count.
4. Open two or three repositories and check examples, docs, issues, and release activity.
5. Star, fork, or submit a suggestion when a project should be tracked here.

## Today's Best Entry Points

${picksList(picks, "en")}

## Fast Movers To Scan

${projectTable(rising, "en")}
`;
}

export function renderChineseStartHere(data: ProjectsFile): string {
  const picks = todaysPicks(data.projects, 7);
  const rising = weeklyDigestProjects(data.projects, 10);

  return `# 从这里开始

[返回 README](${REPOSITORY.url}/blob/main/README.zh-CN.md) | [在线榜单](${REPOSITORY.pagesUrl}) | [每周摘要](reports/weekly-digest.zh-CN.md) | [排名方法](METHODOLOGY.zh-CN.md)

Awesome AI GitHub 面向想快速发现 AI 开源项目的人：不用每天手动刷多个榜单，也能看到正在增长、值得进一步了解的项目。

## 按你的目标进入

- 做 LLM 或聊天应用：先看[大语言模型与聊天](${REPOSITORY.pagesUrl}llm.html)。
- 做智能体或自动化工作流：先看[智能体](${REPOSITORY.pagesUrl}agents.html)。
- 做知识库应用：先看[RAG 与知识库](${REPOSITORY.pagesUrl}rag.html)。
- 做图像、视频、音频或创意工具：先看[生成式 AI](${REPOSITORY.pagesUrl}generative-ai.html)。
- 做模型部署、推理或工程化：先看[AI 基础设施](${REPOSITORY.pagesUrl}ai-infra.html)。
- 关注模型质量对比：先看[评测与基准](${REPOSITORY.pagesUrl}evaluation.html)。
- 探索具身智能：先看[机器人与具身智能](${REPOSITORY.pagesUrl}robotics.html)。

## 怎么看标签

- 增长快：24 小时或 7 天增星明显。
- 近期活跃：仓库最近有 push。
- 有文档：存在 homepage、docs topic 或文档相关描述。
- 适合入门：出现 examples、tutorial、template、beginner 等信号。
- 偏生产可用：出现 deploy、serving、workflow、scale 等工程化信号，或项目活跃且基础热度较高。
- 研究/评测：出现 paper、benchmark、evaluation、leaderboard 等信号。
- 适合自托管：出现 local、private、offline、self-hosted 等信号。

## 十分钟使用流程

1. 打开[在线榜单](${REPOSITORY.pagesUrl})，先看今日精选。
2. 按你当前工作方向选择分类。
3. 按你的场景看标签，不要只看总 stars。
4. 打开两三个仓库，检查 examples、docs、issues 和 release 活跃度。
5. 如果发现值得追踪的新项目，可以提交推荐 issue。

## 今天最适合入手的项目

${picksList(picks, "zh")}

## 值得快速扫一眼的增长项目

${projectTable(rising, "zh")}
`;
}

export function renderPage(data: ProjectsFile): string {
  const safeJson = JSON.stringify(data).replaceAll("<", "\\u003c");
  const safePickIds = JSON.stringify(todaysPicks(data.projects).map((project) => project.id));
  const safeProjectSignals = JSON.stringify(
    Object.fromEntries(data.projects.map((project) => [project.id, projectSignals(project)]))
  ).replaceAll("<", "\\u003c");
  const topWeeklyGrowthCapped = data.projects.some(
    (project) => project.weeklyStars === data.summary.topWeeklyGrowth && project.weeklyStarsCapped
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Awesome AI GitHub</title>
  <meta name="description" content="Daily updated bilingual ranking of trending AI projects on GitHub.">
  <style>
    :root {
      --bg: #f6f7f9;
      --panel: #ffffff;
      --text: #17202a;
      --muted: #5f6c7b;
      --line: #d9dee7;
      --teal: #0f766e;
      --amber: #b45309;
      --rose: #be123c;
      --indigo: #4338ca;
      --shadow: 0 10px 26px rgba(23, 32, 42, 0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .shell {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 5;
      background: rgba(246, 247, 249, 0.92);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(12px);
    }

    .topbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 64px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand strong {
      font-size: 18px;
      letter-spacing: 0;
    }

    .brand span {
      color: var(--muted);
      font-size: 13px;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .button {
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--text);
      min-height: 34px;
      padding: 7px 11px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
      line-height: 1.1;
    }

    .button.active,
    .button:hover {
      border-color: var(--teal);
      color: var(--teal);
    }

    .dashboard {
      padding: 28px 0 40px;
    }

    .intro {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 20px;
      align-items: end;
      margin-bottom: 22px;
    }

    .intro h1 {
      margin: 0;
      font-size: 32px;
      line-height: 1.15;
      letter-spacing: 0;
    }

    .intro p {
      max-width: 760px;
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 16px;
    }

    .link-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }

    .summary {
      display: grid;
      grid-template-columns: 1.35fr repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      box-shadow: var(--shadow);
      min-height: 98px;
    }

    .stat small {
      display: block;
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 6px;
    }

    .stat strong {
      font-size: 28px;
      line-height: 1.1;
    }

    .stat p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 14px;
    }

    .filters {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      gap: 12px;
      align-items: start;
      margin: 18px 0;
    }

    .search {
      width: 100%;
      min-height: 42px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      color: var(--text);
      font-size: 15px;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }

    .chip {
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--muted);
      min-height: 34px;
      padding: 7px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
    }

    .chip.active {
      background: #ecfdf5;
      border-color: var(--teal);
      color: var(--teal);
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 16px;
      align-items: start;
    }

    .section-title {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      margin: 18px 0 10px;
    }

    .section-title h2 {
      margin: 0;
      font-size: 18px;
    }

    .section-title span {
      color: var(--muted);
      font-size: 13px;
    }

    .pick-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 18px;
    }

    .pick {
      min-height: 190px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .pick a {
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .pick p {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
    }

    .pick-metrics {
      margin-top: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      color: var(--teal);
      font-size: 12px;
      font-weight: 700;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--line);
    }

    .panel-header h1,
    .panel-header h2 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0;
    }

    .panel-header span {
      color: var(--muted);
      font-size: 13px;
      white-space: nowrap;
    }

    .project-list {
      display: grid;
      gap: 0;
    }

    .project {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) auto;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      align-items: start;
    }

    .project:last-child {
      border-bottom: 0;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: #eef2f7;
    }

    .project-main {
      min-width: 0;
    }

    .project-title {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .project-title a {
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 2px 7px;
      border-radius: 8px;
      background: #eef2ff;
      color: var(--indigo);
      font-size: 12px;
      border: 1px solid #c7d2fe;
    }

    .signal-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 7px 0 0;
    }

    .signal {
      display: inline-flex;
      align-items: center;
      min-height: 21px;
      padding: 2px 7px;
      border-radius: 8px;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: var(--teal);
      font-size: 11px;
      font-weight: 700;
    }

    .description {
      margin: 6px 0 8px;
      color: var(--muted);
      font-size: 14px;
      overflow-wrap: anywhere;
    }

    .meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      color: var(--muted);
      font-size: 12px;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 74px);
      gap: 8px;
      text-align: right;
      font-size: 13px;
    }

    .metric strong {
      display: block;
      font-size: 15px;
    }

    .metric span {
      color: var(--muted);
    }

    .metric.gain strong {
      color: var(--teal);
    }

    .side-list {
      display: grid;
      gap: 10px;
      padding: 16px;
    }

    .category-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }

    .category-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .category-row strong {
      display: block;
      font-size: 14px;
    }

    .category-row span {
      color: var(--muted);
      font-size: 12px;
    }

    .count {
      color: var(--amber);
      font-weight: 700;
    }

    .empty {
      padding: 28px 16px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 900px) {
      .summary,
      .content-grid,
      .filters,
      .intro {
        grid-template-columns: 1fr;
      }

      .chips,
      .link-row {
        justify-content: flex-start;
      }

      .pick-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .project {
        grid-template-columns: 40px minmax(0, 1fr);
      }

      .avatar {
        width: 40px;
        height: 40px;
      }

      .metrics {
        grid-column: 1 / -1;
        grid-template-columns: repeat(3, 1fr);
        text-align: left;
        padding-left: 52px;
      }
    }

    @media (max-width: 560px) {
      .shell {
        width: min(100% - 20px, 1180px);
      }

      .topbar-inner {
        align-items: flex-start;
        flex-direction: column;
        padding: 12px 0;
      }

      .top-actions {
        justify-content: flex-start;
      }

      .button {
        min-height: 32px;
        padding: 7px 9px;
        font-size: 13px;
      }

      .summary {
        gap: 10px;
      }

      .intro h1 {
        font-size: 26px;
      }

      .pick-grid {
        grid-template-columns: 1fr;
      }

      .project {
        padding: 12px;
      }

      .metrics {
        padding-left: 0;
      }
    }
  </style>
</head>
<body>
  <script>window.__PROJECTS__ = ${safeJson};</script>
  <script>window.__PICK_IDS__ = ${safePickIds};</script>
  <script>window.__PROJECT_SIGNALS__ = ${safeProjectSignals};</script>
  <header class="topbar">
    <div class="shell topbar-inner">
      <div class="brand">
        <strong>Awesome AI GitHub</strong>
        <span data-i18n="tagline">Daily trending AI projects from GitHub</span>
      </div>
      <div class="top-actions">
        <button class="button active" id="languageEn" type="button">EN</button>
        <button class="button" id="languageZh" type="button">中文</button>
        <a class="button" href="start-here.html" data-localized-link="start-here.html" data-i18n="startHere">Start Here</a>
        <a class="button" href="weekly.html" data-localized-link="weekly.html" data-i18n="weeklyDigest">Weekly</a>
        <a class="button" href="methodology.html" data-localized-link="methodology.html" data-i18n="methodology">Methodology</a>
        <a class="button" href="${REPOSITORY.url}">GitHub</a>
      </div>
    </div>
  </header>

  <main class="shell dashboard">
    <section class="intro" aria-label="Introduction">
      <div>
        <h1 data-i18n="heroTitle">Daily AI open-source radar</h1>
        <p data-i18n="heroText">Discover fast-growing LLM, Agent, RAG, Generative AI, and AI infrastructure projects before they go mainstream.</p>
      </div>
      <div class="link-row">
        <a class="button" href="start-here.html" data-localized-link="start-here.html" data-i18n="startHere">Start Here</a>
        <a class="button" href="https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml" data-i18n="suggestProject">Suggest project</a>
        <a class="button" href="${REPOSITORY.url}/blob/main/data/projects.json" data-i18n="openData">Open data</a>
      </div>
    </section>

    <section class="summary" aria-label="Summary">
      <article class="stat">
        <small data-i18n="updated">Updated</small>
        <strong>${formatDate(data.date)}</strong>
        <p data-i18n="ranking">Ranked by recent star growth and freshness.</p>
      </article>
      <article class="stat">
        <small data-i18n="projects">Projects</small>
        <strong>${formatNumber(data.summary.totalProjects)}</strong>
      </article>
      <article class="stat">
        <small data-i18n="stars">Total stars</small>
        <strong>${formatNumber(data.summary.totalStars)}</strong>
      </article>
      <article class="stat">
        <small data-i18n="growth">Top 7d growth</small>
        <strong>+${formatNumber(data.summary.topWeeklyGrowth)}${topWeeklyGrowthCapped ? "+" : ""}</strong>
      </article>
    </section>

    <section aria-label="Today's picks">
      <div class="section-title">
        <h2 data-i18n="todaysPicks">Today's Picks</h2>
        <span data-i18n="picksNote">Algorithmic picks with category diversity</span>
      </div>
      <div class="pick-grid" id="pickList"></div>
    </section>

    <section class="filters" aria-label="Filters">
      <input class="search" id="search" type="search" autocomplete="off" data-placeholder-en="Search repos, topics, language..." data-placeholder-zh="搜索仓库、主题、语言...">
      <div class="chips" id="categoryChips"></div>
    </section>

    <section class="content-grid">
      <div class="panel">
        <div class="panel-header">
          <h1 data-i18n="trending">Trending Now</h1>
          <span id="resultCount"></span>
        </div>
        <div class="project-list" id="projectList"></div>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <h2 data-i18n="categories">Categories</h2>
        </div>
        <div class="side-list" id="categoryList"></div>
      </aside>
    </section>
  </main>

  <script>
    const data = window.__PROJECTS__;
    const pickIds = window.__PICK_IDS__;
    const projectSignals = window.__PROJECT_SIGNALS__;
    const labels = {
      en: {
        tagline: "Daily AI open-source radar",
        heroTitle: "Daily AI open-source radar",
        heroText: "Discover fast-growing LLM, Agent, RAG, Generative AI, and AI infrastructure projects before they go mainstream.",
        startHere: "Start Here",
        weeklyDigest: "Weekly",
        methodology: "Methodology",
        suggestProject: "Suggest project",
        openData: "Open data",
        updated: "Updated",
        ranking: "Ranked by recent star growth and freshness.",
        projects: "Projects",
        stars: "Total stars",
        growth: "Top 7d growth",
        todaysPicks: "Today's Picks",
        picksNote: "Algorithmic picks with category diversity",
        trending: "Trending Now",
        categories: "Categories",
        all: "All",
        results: "results",
        noResults: "No matching projects.",
        starLabel: "Stars",
        dailyLabel: "+24h",
        weeklyLabel: "+7d",
        capped: "at least",
        pushed: "Pushed",
        pickReason: "Recent growth and activity make this worth scanning today."
      },
      zh: {
        tagline: "每日 AI 开源雷达",
        heroTitle: "每日 AI 开源雷达",
        heroText: "更早发现正在快速增长的 LLM、Agent、RAG、生成式 AI 与 AI 基础设施项目。",
        startHere: "从这里开始",
        weeklyDigest: "周报",
        methodology: "方法",
        suggestProject: "推荐项目",
        openData: "开放数据",
        updated: "更新时间",
        ranking: "按近期增星与项目新鲜度排序。",
        projects: "收录项目",
        stars: "累计 Stars",
        growth: "最高 7 日增星",
        todaysPicks: "今日精选",
        picksNote: "兼顾热度与分类多样性的算法精选",
        trending: "当前热门",
        categories: "分类",
        all: "全部",
        results: "个结果",
        noResults: "没有匹配的项目。",
        starLabel: "Stars",
        dailyLabel: "+24h",
        weeklyLabel: "+7d",
        capped: "至少",
        pushed: "更新",
        pickReason: "近期增长和活跃度较高，今天值得快速扫一眼。"
      }
    };

    let language = initialLanguage();
    let activeCategory = "all";
    let query = "";

    const search = document.getElementById("search");
    const projectList = document.getElementById("projectList");
    const categoryChips = document.getElementById("categoryChips");
    const categoryList = document.getElementById("categoryList");
    const pickList = document.getElementById("pickList");
    const resultCount = document.getElementById("resultCount");
    const languageEn = document.getElementById("languageEn");
    const languageZh = document.getElementById("languageZh");

    function t(key) {
      return labels[language][key];
    }

    function categoryName(category) {
      return language === "zh" ? category.nameZh : category.nameEn;
    }

    function categoryDescription(category) {
      return language === "zh" ? category.descriptionZh : category.descriptionEn;
    }

    function format(value) {
      return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en").format(value);
    }

    function setLanguage(nextLanguage) {
      language = nextLanguage;
      localStorage.setItem("language", language);
      syncUrlLanguage();
      render();
    }

    function render() {
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
      document.querySelectorAll("[data-i18n]").forEach((node) => {
        node.textContent = t(node.dataset.i18n);
      });
      search.placeholder = language === "zh" ? search.dataset.placeholderZh : search.dataset.placeholderEn;
      languageEn.classList.toggle("active", language === "en");
      languageZh.classList.toggle("active", language === "zh");
      updateLocalizedLinks();
      renderCategoryChips();
      renderCategoryList();
      renderPicks();
      renderProjects();
    }

    function renderCategoryChips() {
      const chips = [
        { slug: "all", label: t("all") },
        ...data.categories.map((category) => ({ slug: category.slug, label: categoryName(category) }))
      ];
      categoryChips.innerHTML = chips
        .map((chip) => '<button class="chip ' + (activeCategory === chip.slug ? "active" : "") + '" type="button" data-category="' + escapeHtml(chip.slug) + '">' + escapeHtml(chip.label) + "</button>")
        .join("");
    }

    function renderCategoryList() {
      categoryList.innerHTML = data.categories
        .map((category) => (
          '<a class="category-row" href="' + escapeHtml(localizedHref(category.slug + '.html')) + '">' +
            '<div><strong>' + escapeHtml(categoryName(category)) + '</strong><span>' + escapeHtml(categoryDescription(category)) + '</span></div>' +
            '<div class="count">' + format(category.count) + '</div>' +
          '</a>'
        ))
        .join("");
    }

    function filteredProjects() {
      const normalizedQuery = query.trim().toLowerCase();
      return data.projects.filter((project) => {
        const matchesCategory = activeCategory === "all" || project.category === activeCategory || project.categories.includes(activeCategory);
        if (!matchesCategory) {
          return false;
        }
        if (!normalizedQuery) {
          return true;
        }
        const haystack = [project.fullName, project.description, project.language, project.license, project.topics.join(" ")].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    function renderProjects() {
      const projects = filteredProjects();
      resultCount.textContent = format(projects.length) + " " + t("results");
      if (projects.length === 0) {
        projectList.innerHTML = '<div class="empty">' + t("noResults") + '</div>';
        return;
      }

      projectList.innerHTML = projects
        .map((project) => {
          const category = data.categories.find((item) => item.slug === project.category);
          const categoryLabel = category ? categoryName(category) : project.category;
          const signals = signalBadges(project);
          return (
            '<article class="project">' +
              '<img class="avatar" src="' + escapeHtml(project.avatarUrl) + '" alt="" loading="lazy">' +
              '<div class="project-main">' +
                '<div class="project-title"><a href="' + escapeHtml(project.url) + '">' + escapeHtml(project.fullName) + '</a><span class="badge">' + escapeHtml(categoryLabel) + '</span></div>' +
                signals +
                '<p class="description">' + escapeHtml(project.description) + '</p>' +
                '<div class="meta">' +
                  '<span>' + escapeHtml(project.language) + '</span>' +
                  '<span>' + escapeHtml(project.license) + '</span>' +
                  '<span>' + t("pushed") + ' ' + escapeHtml(project.pushedAt.slice(0, 10)) + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="metrics">' +
                '<div class="metric"><strong>' + format(project.stars) + '</strong><span>' + t("starLabel") + '</span></div>' +
                '<div class="metric gain"><strong>' + growth(project.dailyStars, project.dailyStarsCapped) + '</strong><span>' + t("dailyLabel") + '</span></div>' +
                '<div class="metric gain"><strong>' + growth(project.weeklyStars, project.weeklyStarsCapped) + '</strong><span>' + t("weeklyLabel") + '</span></div>' +
              '</div>' +
            '</article>'
          );
        })
        .join("");
    }

    function renderPicks() {
      const projects = pickIds
        .map((id) => data.projects.find((project) => project.id === id))
        .filter(Boolean);

      pickList.innerHTML = projects
        .map((project) => {
          const category = data.categories.find((item) => item.slug === project.category);
          const categoryLabel = category ? categoryName(category) : project.category;
          const signals = signalBadges(project);
          return (
            '<article class="pick">' +
              '<span class="badge">' + escapeHtml(categoryLabel) + '</span>' +
              '<a href="' + escapeHtml(project.url) + '">' + escapeHtml(project.fullName) + '</a>' +
              signals +
              '<p>' + escapeHtml(project.description) + '</p>' +
              '<p>' + t("pickReason") + '</p>' +
              '<div class="pick-metrics"><span>' + growth(project.dailyStars, project.dailyStarsCapped) + ' ' + t("dailyLabel") + '</span><span>' + growth(project.weeklyStars, project.weeklyStarsCapped) + ' ' + t("weeklyLabel") + '</span></div>' +
            '</article>'
          );
        })
        .join("");
    }

    function signalBadges(project) {
      const signals = projectSignals[project.id] || [];
      if (signals.length === 0) {
        return "";
      }
      return '<div class="signal-list">' + signals.map((signal) => '<span class="signal">' + escapeHtml(language === "zh" ? signal.zh : signal.en) + '</span>').join("") + '</div>';
    }

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function growth(value, capped) {
      return '+' + format(value) + (capped ? '+' : '');
    }

    function initialLanguage() {
      const params = new URLSearchParams(window.location.search);
      return normalizeLanguage(params.get("lang")) ||
        normalizeLanguage(localStorage.getItem("language")) ||
        ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");
    }

    function normalizeLanguage(value) {
      if (!value) {
        return "";
      }
      return String(value).toLowerCase().startsWith("zh") ? "zh" : String(value).toLowerCase().startsWith("en") ? "en" : "";
    }

    function localizedHref(path) {
      const url = new URL(path, window.location.href);
      url.searchParams.set("lang", language);
      return url.href;
    }

    function updateLocalizedLinks() {
      document.querySelectorAll("[data-localized-link]").forEach((anchor) => {
        anchor.setAttribute("href", localizedHref(anchor.dataset.localizedLink));
      });
    }

    function syncUrlLanguage() {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(null, "", url);
    }

    search.addEventListener("input", (event) => {
      query = event.target.value;
      renderProjects();
    });

    categoryChips.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) {
        return;
      }
      activeCategory = button.dataset.category;
      render();
    });

    languageEn.addEventListener("click", () => setLanguage("en"));
    languageZh.addEventListener("click", () => setLanguage("zh"));

    render();
  </script>
</body>
</html>
`;
}

export function renderEnglishMethodology(data: ProjectsFile): string {
  return `# Methodology

[Back to README](${REPOSITORY.url}#readme) | [Live dashboard](${REPOSITORY.pagesUrl}) | [Open data](${REPOSITORY.url}/blob/main/data/projects.json)

Awesome AI GitHub is a daily AI open-source radar. It is designed to help people discover useful projects that are gaining attention now, not only the biggest repositories of all time.

## Data Sources

- GitHub REST Search API is used to discover public repositories by AI-related topics and activity.
- GitHub GraphQL stargazer data is used to estimate recent 24h and 7d star growth.
- Daily JSON snapshots are stored in \`data/snapshots/\` so the repository can improve its trend calculations over time.

## Ranking Signals

- Recent growth: 24h and 7d star movement have the strongest weight.
- Freshness: recently pushed repositories receive a small boost.
- Traction: total stars are used as a fallback, especially on early runs with limited snapshot history.
- Category diversity: Today's Picks avoid showing only one type of project when several categories have strong signals.

## Growth Numbers

- A value like \`+200+\` means GitHub returned at least 200 recent stars. The trailing \`+\` appears when the updater hits the configured recent-stargazer page limit.
- When recent stargazer lookup is unavailable, the updater falls back to daily snapshots.
- These numbers are discovery signals, not financial, academic, or product-quality guarantees.

## Categories

${data.categories.map((category) => `- **${category.nameEn}** - ${category.descriptionEn}`).join("\n")}

## No Database

This project intentionally uses static JSON files instead of a database. GitHub Actions regenerates the data daily, Git stores the history, and GitHub Pages serves the dashboard for free.

## Suggest a Project

Open a [project suggestion issue](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml) with the repository URL, category, and why it helps builders, researchers, or founders.
`;
}

export function renderChineseMethodology(data: ProjectsFile): string {
  return `# 排名方法

[返回 README](${REPOSITORY.url}/blob/main/README.zh-CN.md) | [在线榜单](${REPOSITORY.pagesUrl}) | [开放数据](${REPOSITORY.url}/blob/main/data/projects.json)

Awesome AI GitHub 是一个每日 AI 开源雷达。目标不是只展示历史总星数最高的仓库，而是帮助大家更早发现正在获得关注、可能值得投入时间的项目。

## 数据来源

- 使用 GitHub REST Search API 按 AI 相关 topic 和活跃度发现公开仓库。
- 使用 GitHub GraphQL stargazer 数据估算最近 24 小时和 7 天增星。
- 每日 JSON 快照保存在 \`data/snapshots/\`，后续运行会逐步提升趋势计算的稳定性。

## 排名信号

- 近期增长：24h 和 7d 增星权重最高。
- 新鲜度：最近 push 的仓库有少量加权。
- 基础热度：总 stars 作为兜底信号，尤其适合快照历史不足的早期阶段。
- 分类多样性：今日精选会避免只展示同一种项目。

## 增星数字说明

- \`+200+\` 表示 GitHub 至少返回了 200 个近期 stars；末尾 \`+\` 代表触达了当前抓取上限。
- 如果最近 stargazer 查询失败，脚本会退回每日快照差值。
- 这些数字是发现信号，不代表质量保证、投资建议或学术排名。

## 分类

${data.categories.map((category) => `- **${category.nameZh}** - ${category.descriptionZh}`).join("\n")}

## 为什么不用数据库

当前项目刻意使用静态 JSON，而不是数据库。GitHub Actions 每天重新生成数据，Git 保存历史，GitHub Pages 免费发布页面，别人 fork 后也能直接运行。

## 推荐项目

可以通过[项目推荐 issue](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml) 提交仓库链接、分类，以及它能帮到开发者、研究者或创业者的原因。
`;
}

export function renderEnglishWeeklyDigest(data: ProjectsFile): string {
  const digestProjects = weeklyDigestProjects(data.projects, 20);
  const categoryGrowth = categoryGrowthSummary(data).slice(0, 5);

  return `# Weekly AI Open-Source Digest

[Back to README](${REPOSITORY.url}#readme) | [Live dashboard](${REPOSITORY.pagesUrl}) | [Methodology](${REPOSITORY.url}/blob/main/METHODOLOGY.md)

Generated: ${formatDateTime(data.generatedAt)} UTC

## What Moved This Week

${categoryGrowth
  .map((category, index) => `${index + 1}. **${category.nameEn}** - ${formatGrowth(category.weeklyStars, false)} tracked 7d stars across ${category.count} projects.`)
  .join("\n")}

## Projects To Scan

${projectTable(digestProjects, "en")}

## How To Use This Digest

- Developers: scan for libraries, frameworks, and examples worth trying this week.
- Researchers: watch emerging implementation patterns and evaluation tooling.
- Founders: look for fast-growing pain points, categories, and developer workflows.

Growth values with a trailing \`+\` are lower bounds from GitHub stargazer pagination.
`;
}

export function renderChineseWeeklyDigest(data: ProjectsFile): string {
  const digestProjects = weeklyDigestProjects(data.projects, 20);
  const categoryGrowth = categoryGrowthSummary(data).slice(0, 5);

  return `# 每周 AI 开源摘要

[返回 README](${REPOSITORY.url}/blob/main/README.zh-CN.md) | [在线榜单](${REPOSITORY.pagesUrl}) | [排名方法](${REPOSITORY.url}/blob/main/METHODOLOGY.zh-CN.md)

生成时间：${formatDateTime(data.generatedAt)} UTC

## 本周变化

${categoryGrowth
  .map((category, index) => `${index + 1}. **${category.nameZh}** - 追踪项目 ${category.count} 个，7 日增星合计 ${formatGrowth(category.weeklyStars, false)}。`)
  .join("\n")}

## 值得快速浏览的项目

${projectTable(digestProjects, "zh")}

## 如何使用这份摘要

- 开发者：快速发现本周值得尝试的库、框架和示例。
- 研究者：观察新兴实现范式和评测工具。
- 创业者：发现正在变热的痛点、类别和开发者工作流。

带 \`+\` 的增星值代表受 GitHub stargazer 分页限制影响，是下限值。
`;
}

export function renderMethodologyPage(data: ProjectsFile): string {
  return renderArticlePage({
    title: "Methodology",
    titleZh: "排名方法",
    bodyEn: renderEnglishMethodology(data),
    bodyZh: renderChineseMethodology(data)
  });
}

export function renderWeeklyPage(data: ProjectsFile): string {
  return renderArticlePage({
    title: "Weekly AI Open-Source Digest",
    titleZh: "每周 AI 开源摘要",
    bodyEn: renderEnglishWeeklyDigest(data),
    bodyZh: renderChineseWeeklyDigest(data)
  });
}

export function renderStartHerePage(data: ProjectsFile): string {
  return renderArticlePage({
    title: "Start Here",
    titleZh: "从这里开始",
    bodyEn: renderEnglishStartHere(data),
    bodyZh: renderChineseStartHere(data)
  });
}

export function renderCategoryPage(data: ProjectsFile, categorySlug: string): string {
  const category = CATEGORIES.find((item) => item.slug === categorySlug);
  if (!category) {
    throw new Error(`Unknown category: ${categorySlug}`);
  }

  return renderArticlePage({
    title: category.nameEn,
    titleZh: category.nameZh,
    bodyEn: renderCategoryMarkdown(data, categorySlug, "en"),
    bodyZh: renderCategoryMarkdown(data, categorySlug, "zh")
  });
}

export function renderCategoryMarkdown(data: ProjectsFile, categorySlug: string, language: "en" | "zh"): string {
  const category = CATEGORIES.find((item) => item.slug === categorySlug);
  if (!category) {
    throw new Error(`Unknown category: ${categorySlug}`);
  }

  const projects = data.projects
    .filter((project) => project.category === category.slug)
    .sort((a, b) => b.hotScore - a.hotScore || b.weeklyStars - a.weeklyStars || b.stars - a.stars);
  const topProjects = projects.slice(0, 25);
  const fastMovers = [...projects]
    .sort((a, b) => b.weeklyStars - a.weeklyStars || b.dailyStars - a.dailyStars || b.hotScore - a.hotScore || b.stars - a.stars)
    .slice(0, 10);
  const activeCount = projects.filter((project) => projectSignals(project).some((signal) => signal.slug === "active")).length;
  const docsCount = projects.filter((project) => projectSignals(project).some((signal) => signal.slug === "docs")).length;

  if (language === "zh") {
    return `# ${category.nameZh}

[返回在线榜单](${REPOSITORY.pagesUrl}) | [从这里开始](${REPOSITORY.pagesUrl}start-here.html) | [推荐项目](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml)

${category.descriptionZh}

## 分类快照

- 收录项目：${formatNumber(projects.length)}
- 近期活跃项目：${formatNumber(activeCount)}
- 有文档或主页信号：${formatNumber(docsCount)}
- 更新时间：${formatDateTime(data.generatedAt)} UTC

## 适合谁看

${categoryAudience(category.slug, "zh")}

## 当前热门

${projectTable(topProjects, "zh")}

## 本分类增长项目

${projectTable(fastMovers, "zh")}
`;
  }

  return `# ${category.nameEn}

[Back to dashboard](${REPOSITORY.pagesUrl}) | [Start Here](${REPOSITORY.pagesUrl}start-here.html) | [Suggest a project](https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues/new?template=suggest-project.yml)

${category.descriptionEn}

## Category Snapshot

- Projects tracked: ${formatNumber(projects.length)}
- Recently active projects: ${formatNumber(activeCount)}
- Docs or homepage signal: ${formatNumber(docsCount)}
- Updated: ${formatDateTime(data.generatedAt)} UTC

## Who This Helps

${categoryAudience(category.slug, "en")}

## Trending Now

${projectTable(topProjects, "en")}

## Fast Movers In This Category

${projectTable(fastMovers, "en")}
`;
}

function projectTable(projects: Project[], language: "en" | "zh"): string {
  const headings =
    language === "zh"
      ? ["#", "项目", "分类", "标签", "Stars", "+24h", "+7d", "语言", "描述"]
      : ["#", "Repository", "Category", "Signals", "Stars", "+24h", "+7d", "Language", "Description"];

  const rows = projects.map((project, index) => {
    const category = CATEGORIES.find((item) => item.slug === project.category);
    const categoryName = language === "zh" ? category?.nameZh : category?.nameEn;
    return [
      String(index + 1),
      `[${escapeMarkdown(project.fullName)}](${project.url})`,
      escapeMarkdown(categoryName ?? project.category),
      escapeMarkdown(projectSignalText(project, language)),
      formatNumber(project.stars),
      formatGrowth(project.dailyStars, project.dailyStarsCapped),
      formatGrowth(project.weeklyStars, project.weeklyStarsCapped),
      escapeMarkdown(project.language),
      escapeMarkdown(project.description)
    ];
  });

  return [
    `| ${headings.join(" | ")} |`,
    `| ${headings.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function picksList(projects: Project[], language: "en" | "zh"): string {
  return projects
    .map((project, index) => {
      const category = CATEGORIES.find((item) => item.slug === project.category);
      const categoryName = language === "zh" ? category?.nameZh : category?.nameEn;
      const reason = pickReason(project, language);
      const signals = projectSignalText(project, language);
      return `${index + 1}. [**${escapeMarkdown(project.fullName)}**](${project.url}) - ${escapeMarkdown(categoryName ?? project.category)}; ${escapeMarkdown(signals)}; ${escapeMarkdown(reason)}`;
    })
    .join("\n");
}

function categoryAudience(slug: string, language: "en" | "zh"): string {
  const text = {
    en: {
      llm: "Useful for developers building chat products, prompt tooling, model wrappers, local LLM workflows, and orchestration layers.",
      agents: "Useful for teams exploring autonomous workflows, tool calling, coding agents, browser agents, and multi-agent collaboration.",
      rag: "Useful for builders creating knowledge-base products, document search, vector retrieval, indexing pipelines, and enterprise assistants.",
      "generative-ai": "Useful for creators and engineers working on image, video, audio, 3D, diffusion, and multimodal generation workflows.",
      "ai-infra": "Useful for people deploying, serving, observing, optimizing, and operating AI systems in real products.",
      evaluation: "Useful for researchers and engineering teams comparing model behavior, quality, benchmarks, observability, and regression testing.",
      robotics: "Useful for builders following embodied AI, robotics simulation, planning, autonomy, and real-world agent systems."
    },
    zh: {
      llm: "适合正在做聊天产品、提示词工具、模型封装、本地 LLM 工作流和模型编排的开发者。",
      agents: "适合探索自主工作流、工具调用、编程智能体、浏览器智能体和多智能体协作的团队。",
      rag: "适合构建知识库产品、文档搜索、向量检索、索引管线和企业助手的开发者。",
      "generative-ai": "适合关注图像、视频、音频、3D、扩散模型和多模态生成工作流的创作者与工程师。",
      "ai-infra": "适合负责部署、服务化、观测、优化和运行 AI 系统的人。",
      evaluation: "适合比较模型行为、质量、基准测试、可观测性和回归测试的研究者与工程团队。",
      robotics: "适合关注具身智能、机器人仿真、规划、自主系统和真实世界智能体的开发者。"
    }
  } as const;

  return text[language][slug as keyof (typeof text)["en"]] ?? (language === "zh" ? "适合想快速了解该方向开源生态的人。" : "Useful for people who want a quick view of this open-source area.");
}

function newestProjects(projects: Project[]): Project[] {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - SETTINGS.newcomerDays);

  return projects
    .filter((project) => new Date(project.createdAt) >= cutoff)
    .sort((a, b) => b.hotScore - a.hotScore || b.stars - a.stars);
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ").trim();
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}

function formatGrowth(value: number, capped: boolean): string {
  return `+${formatNumber(value)}${capped ? "+" : ""}`;
}

function renderArticlePage(input: {
  title: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(input.title)} - Awesome AI GitHub</title>
  <style>
    body {
      margin: 0;
      background: #f6f7f9;
      color: #17202a;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }
    main {
      width: min(920px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 48px;
    }
    nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    button,
    a.nav-link {
      border: 1px solid #d9dee7;
      background: #fff;
      color: #17202a;
      min-height: 34px;
      padding: 7px 11px;
      border-radius: 8px;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      line-height: 1.1;
    }
    button.active {
      border-color: #0f766e;
      color: #0f766e;
    }
    article {
      background: #fff;
      border: 1px solid #d9dee7;
      border-radius: 8px;
      padding: 24px;
      overflow-x: auto;
    }
    h1, h2 {
      line-height: 1.2;
    }
    a {
      color: #0f766e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      border-bottom: 1px solid #d9dee7;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    code {
      background: #eef2f7;
      border-radius: 4px;
      padding: 2px 4px;
    }
    .hidden {
      display: none;
    }
    @media (max-width: 560px) {
      main {
        width: min(100% - 20px, 920px);
        padding-top: 20px;
      }
      article {
        padding: 16px;
      }
      button,
      a.nav-link {
        min-height: 32px;
        padding: 7px 9px;
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <a class="nav-link" href="index.html" data-localized-link="index.html" data-label-en="Dashboard" data-label-zh="榜单首页">Dashboard</a>
      <a class="nav-link" href="${REPOSITORY.url}">GitHub</a>
      <button id="enButton" class="active" type="button">EN</button>
      <button id="zhButton" type="button">中文</button>
    </nav>
    <article id="contentEn">${markdownToHtml(input.bodyEn)}</article>
    <article id="contentZh" class="hidden">${markdownToHtml(input.bodyZh)}</article>
  </main>
  <script>
    const enButton = document.getElementById("enButton");
    const zhButton = document.getElementById("zhButton");
    const contentEn = document.getElementById("contentEn");
    const contentZh = document.getElementById("contentZh");
    const pageTitle = {
      en: ${JSON.stringify(input.title)},
      zh: ${JSON.stringify(input.titleZh)}
    };
    let currentLanguage = initialLanguage();

    function setLanguage(language) {
      currentLanguage = language;
      localStorage.setItem("language", language);
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
      document.title = (language === "zh" ? pageTitle.zh : pageTitle.en) + " - Awesome AI GitHub";
      enButton.classList.toggle("active", language === "en");
      zhButton.classList.toggle("active", language === "zh");
      contentEn.classList.toggle("hidden", language !== "en");
      contentZh.classList.toggle("hidden", language !== "zh");
      document.querySelectorAll("[data-label-en]").forEach((node) => {
        node.textContent = language === "zh" ? node.dataset.labelZh : node.dataset.labelEn;
      });
      syncUrlLanguage();
      updateLocalizedLinks();
    }

    function initialLanguage() {
      const params = new URLSearchParams(window.location.search);
      return normalizeLanguage(params.get("lang")) ||
        normalizeLanguage(localStorage.getItem("language")) ||
        ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");
    }

    function normalizeLanguage(value) {
      if (!value) {
        return "";
      }
      return String(value).toLowerCase().startsWith("zh") ? "zh" : String(value).toLowerCase().startsWith("en") ? "en" : "";
    }

    function localizedHref(path) {
      const url = new URL(path, window.location.href);
      url.searchParams.set("lang", currentLanguage);
      return url.href;
    }

    function updateLocalizedLinks() {
      const pagesUrl = new URL("${REPOSITORY.pagesUrl}");
      document.querySelectorAll("a").forEach((anchor) => {
        if (anchor.dataset.localizedLink) {
          anchor.setAttribute("href", localizedHref(anchor.dataset.localizedLink));
          return;
        }
        const rawHref = anchor.getAttribute("href");
        if (!rawHref) {
          return;
        }
        const url = new URL(rawHref, window.location.href);
        if (url.origin === pagesUrl.origin && url.pathname.startsWith(pagesUrl.pathname)) {
          url.searchParams.set("lang", currentLanguage);
          anchor.setAttribute("href", url.href);
        }
      });
    }

    function syncUrlLanguage() {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", currentLanguage);
      window.history.replaceState(null, "", url);
    }

    enButton.addEventListener("click", () => setLanguage("en"));
    zhButton.addEventListener("click", () => setLanguage("zh"));
    setLanguage(currentLanguage);
  </script>
</body>
</html>
`;
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let inOrderedList = false;
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith("| ")) {
      if (!inTable) {
        html.push("<table>");
        inTable = true;
      }
      if (/^\|[-:| ]+\|$/.test(line)) {
        continue;
      }
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      const tag = html.at(-1) === "<table>" ? "th" : "td";
      html.push(`<tr>${cells.map((cell) => `<${tag}>${inlineMarkdown(cell)}</${tag}>`).join("")}</tr>`);
      continue;
    }

    if (inTable) {
      html.push("</table>");
      inTable = false;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        closeOrderedList();
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      if (!inOrderedList) {
        closeList();
        html.push("<ol>");
        inOrderedList = true;
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    closeList();
    closeOrderedList();

    if (line.startsWith("# ")) {
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.trim()) {
      html.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }

  if (inTable) {
    html.push("</table>");
  }
  closeList();
  closeOrderedList();

  return html.join("\n");

  function closeList(): void {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  function closeOrderedList(): void {
    if (inOrderedList) {
      html.push("</ol>");
      inOrderedList = false;
    }
  }
}

function inlineMarkdown(value: string): string {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
