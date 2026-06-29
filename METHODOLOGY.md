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

- **LLM & Chatbots** - Large language models, chat apps, prompt tooling, and model orchestration.
- **Agents** - Agent frameworks, autonomous workflows, tool use, and multi-agent systems.
- **RAG & Knowledge** - Retrieval augmented generation, vector search, indexing, and knowledge systems.
- **Generative AI** - Image, video, audio, 3D, diffusion, and creative AI projects.
- **AI Infrastructure** - Inference, serving, MLOps, deployment, optimization, and developer infrastructure.
- **Evaluation & Benchmarks** - Evaluation suites, benchmarks, observability, and model quality tooling.
- **Robotics & Embodied AI** - Robotics, embodied AI, simulators, planning, and autonomous systems.

## No Database

This project intentionally uses static JSON files instead of a database. GitHub Actions regenerates the data daily, Git stores the history, and GitHub Pages serves the dashboard for free.

## Suggest a Project

Open a [project suggestion issue](https://github.com/dingminghbut/Awesome-AI-GitHub/issues/new?template=suggest-project.yml) with the repository URL, category, and why it helps builders, researchers, or founders.
