import { CATEGORIES, REPOSITORY, SETTINGS } from "./config.js";
import { formatDate, formatDateTime } from "./date.js";
import type { Project, ProjectsFile } from "./types.js";

export function renderEnglishReadme(data: ProjectsFile): string {
  const topProjects = data.projects.slice(0, 30);
  const topNew = newestProjects(data.projects).slice(0, 10);

  return `# Awesome AI GitHub

Daily updated collection of trending AI projects on GitHub.

[中文](README.zh-CN.md) | [Live dashboard](${REPOSITORY.pagesUrl}) | [Data](data/projects.json)

> Descriptions are kept in their original GitHub language. This repository uses bilingual navigation and labels without paid translation services.

## Snapshot

- Last updated: ${formatDateTime(data.generatedAt)} UTC
- Projects tracked: ${formatNumber(data.summary.totalProjects)}
- Total stars: ${formatNumber(data.summary.totalStars)}
- Ranking signal: 24h/7d star growth, repository freshness, and a first-run stars fallback
- A trailing \`+\` on growth numbers means GitHub returned at least that many recent stars.

## Trending Now

${projectTable(topProjects, "en")}

## Rising New Projects

${projectTable(topNew, "en")}

## Categories

${data.categories
  .map((category) => `- **${category.nameEn}** (${category.count}) - ${category.descriptionEn}`)
  .join("\n")}

## Automation

The repository updates itself every day with GitHub Actions. The workflow uses the built-in \`GITHUB_TOKEN\`, fetches public repository data from the GitHub REST Search API, stores a daily snapshot, and regenerates the README files plus the GitHub Pages dashboard.

## Notes

- Ranking becomes more accurate after several daily snapshots exist.
- Missing repository metadata such as license, homepage, or topics is shown as \`Unknown\`.
- The static dashboard is generated into \`docs/index.html\` and can be served by GitHub Pages from the \`docs/\` directory.
`;
}

export function renderChineseReadme(data: ProjectsFile): string {
  const topProjects = data.projects.slice(0, 30);
  const topNew = newestProjects(data.projects).slice(0, 10);

  return `# Awesome AI GitHub

每日自动更新的热门 AI GitHub 项目集锦。

[English](README.md) | [在线榜单](${REPOSITORY.pagesUrl}) | [数据文件](data/projects.json)

> 项目描述保留 GitHub 原文。本仓库使用中英双语导航、标签和说明，不依赖付费翻译服务。

## 今日快照

- 更新时间：${formatDateTime(data.generatedAt)} UTC
- 收录项目：${formatNumber(data.summary.totalProjects)}
- 累计 Stars：${formatNumber(data.summary.totalStars)}
- 排名信号：24h/7d 增星、项目新鲜度，以及首次运行时的 stars 兜底排序
- 增星数字后面的 \`+\` 表示 GitHub 至少返回了这么多近期 stars。

## 当前热门

${projectTable(topProjects, "zh")}

## 新锐项目

${projectTable(topNew, "zh")}

## 分类

${data.categories
  .map((category) => `- **${category.nameZh}** (${category.count}) - ${category.descriptionZh}`)
  .join("\n")}

## 自动化

仓库每天通过 GitHub Actions 自动更新。工作流使用内置 \`GITHUB_TOKEN\`，从 GitHub REST Search API 抓取公开仓库数据，保存每日快照，并重新生成中英 README 与 GitHub Pages 榜单页面。

## 说明

- 连续运行数天后，增星排名会更准确。
- 仓库缺少 license、homepage 或 topics 等信息时显示为 \`Unknown\`。
- 静态榜单生成到 \`docs/index.html\`，可通过 GitHub Pages 从 \`docs/\` 目录发布。
`;
}

export function renderPage(data: ProjectsFile): string {
  const safeJson = JSON.stringify(data).replaceAll("<", "\\u003c");
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
      min-height: 36px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
    }

    .button.active,
    .button:hover {
      border-color: var(--teal);
      color: var(--teal);
    }

    .dashboard {
      padding: 28px 0 40px;
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
      .filters {
        grid-template-columns: 1fr;
      }

      .chips {
        justify-content: flex-start;
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

      .summary {
        gap: 10px;
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
  <header class="topbar">
    <div class="shell topbar-inner">
      <div class="brand">
        <strong>Awesome AI GitHub</strong>
        <span data-i18n="tagline">Daily trending AI projects from GitHub</span>
      </div>
      <div class="top-actions">
        <button class="button active" id="languageEn" type="button">EN</button>
        <button class="button" id="languageZh" type="button">中文</button>
        <a class="button" href="${REPOSITORY.url}">GitHub</a>
      </div>
    </div>
  </header>

  <main class="shell dashboard">
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
    const labels = {
      en: {
        tagline: "Daily trending AI projects from GitHub",
        updated: "Updated",
        ranking: "Ranked by recent star growth and freshness.",
        projects: "Projects",
        stars: "Total stars",
        growth: "Top 7d growth",
        trending: "Trending Now",
        categories: "Categories",
        all: "All",
        results: "results",
        noResults: "No matching projects.",
        starLabel: "Stars",
        dailyLabel: "+24h",
        weeklyLabel: "+7d",
        capped: "at least",
        pushed: "Pushed"
      },
      zh: {
        tagline: "每日更新的 GitHub 热门 AI 项目",
        updated: "更新时间",
        ranking: "按近期增星与项目新鲜度排序。",
        projects: "收录项目",
        stars: "累计 Stars",
        growth: "最高 7 日增星",
        trending: "当前热门",
        categories: "分类",
        all: "全部",
        results: "个结果",
        noResults: "没有匹配的项目。",
        starLabel: "Stars",
        dailyLabel: "+24h",
        weeklyLabel: "+7d",
        capped: "至少",
        pushed: "更新"
      }
    };

    let language = localStorage.getItem("language") || "en";
    let activeCategory = "all";
    let query = "";

    const search = document.getElementById("search");
    const projectList = document.getElementById("projectList");
    const categoryChips = document.getElementById("categoryChips");
    const categoryList = document.getElementById("categoryList");
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
      renderCategoryChips();
      renderCategoryList();
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
          '<div class="category-row">' +
            '<div><strong>' + escapeHtml(categoryName(category)) + '</strong><span>' + escapeHtml(categoryDescription(category)) + '</span></div>' +
            '<div class="count">' + format(category.count) + '</div>' +
          '</div>'
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
          return (
            '<article class="project">' +
              '<img class="avatar" src="' + escapeHtml(project.avatarUrl) + '" alt="" loading="lazy">' +
              '<div class="project-main">' +
                '<div class="project-title"><a href="' + escapeHtml(project.url) + '">' + escapeHtml(project.fullName) + '</a><span class="badge">' + escapeHtml(categoryLabel) + '</span></div>' +
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

function projectTable(projects: Project[], language: "en" | "zh"): string {
  const headings =
    language === "zh"
      ? ["#", "项目", "分类", "Stars", "+24h", "+7d", "语言", "描述"]
      : ["#", "Repository", "Category", "Stars", "+24h", "+7d", "Language", "Description"];

  const rows = projects.map((project, index) => {
    const category = CATEGORIES.find((item) => item.slug === project.category);
    const categoryName = language === "zh" ? category?.nameZh : category?.nameEn;
    return [
      String(index + 1),
      `[${escapeMarkdown(project.fullName)}](${project.url})`,
      escapeMarkdown(categoryName ?? project.category),
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
