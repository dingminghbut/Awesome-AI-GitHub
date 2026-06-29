# 排名方法

[返回 README](https://github.com/dingminghbut/Awesome-AI-GitHub/blob/main/README.zh-CN.md) | [在线榜单](https://dingminghbut.github.io/Awesome-AI-GitHub/) | [开放数据](https://github.com/dingminghbut/Awesome-AI-GitHub/blob/main/data/projects.json)

Awesome AI GitHub 是一个每日 AI 开源雷达。目标不是只展示历史总星数最高的仓库，而是帮助大家更早发现正在获得关注、可能值得投入时间的项目。

## 数据来源

- 使用 GitHub REST Search API 按 AI 相关 topic 和活跃度发现公开仓库。
- 使用 GitHub GraphQL stargazer 数据估算最近 24 小时和 7 天增星。
- 每日 JSON 快照保存在 `data/snapshots/`，后续运行会逐步提升趋势计算的稳定性。

## 排名信号

- 近期增长：24h 和 7d 增星权重最高。
- 新鲜度：最近 push 的仓库有少量加权。
- 基础热度：总 stars 作为兜底信号，尤其适合快照历史不足的早期阶段。
- 分类多样性：今日精选会避免只展示同一种项目。

## 增星数字说明

- `+200+` 表示 GitHub 至少返回了 200 个近期 stars；末尾 `+` 代表触达了当前抓取上限。
- 如果最近 stargazer 查询失败，脚本会退回每日快照差值。
- 这些数字是发现信号，不代表质量保证、投资建议或学术排名。

## 分类

- **大语言模型与聊天** - 大语言模型、聊天应用、提示词工具与模型编排。
- **智能体** - 智能体框架、自主工作流、工具调用与多智能体系统。
- **RAG 与知识库** - 检索增强生成、向量检索、索引与知识库系统。
- **生成式 AI** - 图像、视频、音频、3D、扩散模型与创意 AI 项目。
- **AI 基础设施** - 推理、服务化、MLOps、部署、优化与开发者基础设施。
- **评测与基准** - 评测套件、基准测试、可观测性与模型质量工具。
- **机器人与具身智能** - 机器人、具身智能、仿真器、规划与自主系统。

## 为什么不用数据库

当前项目刻意使用静态 JSON，而不是数据库。GitHub Actions 每天重新生成数据，Git 保存历史，GitHub Pages 免费发布页面，别人 fork 后也能直接运行。

## 推荐项目

可以通过[项目推荐 issue](https://github.com/dingminghbut/Awesome-AI-GitHub/issues/new?template=suggest-project.yml) 提交仓库链接、分类，以及它能帮到开发者、研究者或创业者的原因。
