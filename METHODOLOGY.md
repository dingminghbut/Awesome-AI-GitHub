# Methodology

[Back to README](https://github.com/dingminghbut/Awesome-AI-GitHub#readme) | [Live dashboard](https://dingminghbut.github.io/Awesome-AI-GitHub/) | [Open data](https://github.com/dingminghbut/Awesome-AI-GitHub/blob/main/data/projects.json)

Awesome AI GitHub is a daily AI open-source radar. It is designed to help people discover useful projects that are gaining attention now, not only the biggest repositories of all time.

## Data Sources

- GitHub REST Search API is used to discover public repositories by AI-related topics and activity.
- GitHub GraphQL stargazer data is used to estimate recent 24h and 7d star growth.
- Daily JSON snapshots are stored in `data/snapshots/` so the repository can improve its trend calculations over time.

## Ranking Signals

- Recent growth: 24h and 7d star movement have the strongest weight.
- Freshness: recently pushed repositories receive a small boost.
- Traction: total stars are used as a fallback, especially on early runs with limited snapshot history.
- Category diversity: Today's Picks avoid showing only one type of project when several categories have strong signals.

## Growth Numbers

- A value like `+200+` means GitHub returned at least 200 recent stars. The trailing `+` appears when the updater hits the configured recent-stargazer page limit.
- When recent stargazer lookup is unavailable, the updater falls back to daily snapshots.
- These numbers are discovery signals, not financial, academic, or product-quality guarantees.

## Categories

- **Commerce LLM & Shopping Chat** - Shopping assistants, customer-service chatbots, product Q&A, review summarization, sales scripts, and commerce prompt workflows.
- **Commerce Agents & Ops Skills** - Agents and skill playbooks for merchant operations, listings, pricing, ads, CRM, order handling, SOPs, and multi-step commerce workflows.
- **Product RAG & Knowledge Search** - Catalog retrieval, semantic product search, FAQ knowledge bases, vector indexing, and shopper-facing search experiences.
- **Generative Commerce Content** - Product images, ad creatives, listing copy, short videos, virtual try-on, backgrounds, campaign assets, and operator-ready content workflows.
- **Commerce AI Infrastructure** - Serving, MLOps, data pipelines, search/recommendation infrastructure, feature stores, and platform tooling for commerce AI.
- **Commerce Evaluation & Growth Analytics** - Recommendation evaluation, A/B testing, attribution, conversion analytics, growth operations metrics, LLM quality checks, and commerce observability.
- **Retail Robotics & Fulfillment** - Warehouse robots, inventory automation, shelf scanning, fulfillment, delivery, and embodied AI for retail operations.

## No Database

This project intentionally uses static JSON files instead of a database. GitHub Actions regenerates the data daily, Git stores the history, and GitHub Pages serves the dashboard for free.

## Suggest a Project

Open a [project suggestion issue](https://github.com/dingminghbut/Awesome-AI-GitHub/issues/new?template=suggest-project.yml) with the repository URL, category, and why it helps builders, researchers, or founders.
