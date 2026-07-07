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

- **电商 LLM 与导购客服** - 导购助手、客服对话、商品问答、评价总结、销售话术与电商提示词工作流。
- **电商智能体与运营技能** - 面向店铺运营、上架、定价、投放、CRM、订单处理、SOP 和多步骤电商流程的智能体与技能方法库。
- **商品 RAG 与知识检索** - 商品目录检索、语义搜索、FAQ 知识库、向量索引与面向消费者的搜索体验。
- **电商生成式内容** - 商品图、广告素材、详情文案、短视频、虚拟试穿、背景图、营销活动素材与运营内容工作流。
- **电商 AI 基础设施** - 服务化、MLOps、数据管线、搜索/推荐基础设施、特征平台与电商 AI 工程工具。
- **电商评测与增长分析** - 推荐评测、A/B 测试、归因、转化分析、增长运营指标、LLM 质量检查与电商可观测性。
- **零售机器人与履约自动化** - 仓储机器人、库存自动化、货架识别、履约配送与零售运营中的具身智能。

## 为什么不用数据库

当前项目刻意使用静态 JSON，而不是数据库。GitHub Actions 每天重新生成数据，Git 保存历史，GitHub Pages 免费发布页面，别人 fork 后也能直接运行。

## 推荐项目

可以通过[项目推荐 issue](https://github.com/dingminghbut/Awesome-AI-GitHub/issues/new?template=suggest-project.yml) 提交仓库链接、分类，以及它能帮到开发者、研究者或创业者的原因。
