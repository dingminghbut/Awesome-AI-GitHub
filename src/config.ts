import type { CategoryConfig, SearchJob, SearchSort } from "./types.js";

export const REPOSITORY = {
  owner: "dingminghbut",
  name: "Awesome-AI-GitHub",
  url: "https://github.com/dingminghbut/Awesome-AI-GitHub",
  pagesUrl: "https://dingminghbut.github.io/Awesome-AI-GitHub/"
} as const;

export const SETTINGS = {
  perPage: 30,
  maxProjects: 160,
  recentStarBatchSize: 4,
  recentStarPages: 2,
  recentStarPerPage: 100,
  activeDays: 365,
  newcomerDays: 180
} as const;

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "llm",
    nameEn: "LLM & Chatbots",
    nameZh: "大语言模型与聊天",
    descriptionEn: "Large language models, chat apps, prompt tooling, and model orchestration.",
    descriptionZh: "大语言模型、聊天应用、提示词工具与模型编排。",
    queries: [
      "topic:llm stars:>100 archived:false pushed:>={activeSince}",
      "topic:large-language-model stars:>100 archived:false pushed:>={activeSince}"
    ],
    keywords: ["llm", "large language model", "chatgpt", "gpt", "prompt", "transformer", "chatbot"]
  },
  {
    slug: "agents",
    nameEn: "Agents",
    nameZh: "智能体",
    descriptionEn: "Agent frameworks, autonomous workflows, tool use, and multi-agent systems.",
    descriptionZh: "智能体框架、自主工作流、工具调用与多智能体系统。",
    queries: [
      "topic:ai-agent stars:>50 archived:false pushed:>={activeSince}",
      "topic:agents stars:>50 archived:false pushed:>={activeSince}"
    ],
    keywords: ["agent", "agents", "autonomous", "tool-use", "multi-agent", "workflow"]
  },
  {
    slug: "rag",
    nameEn: "RAG & Knowledge",
    nameZh: "RAG 与知识库",
    descriptionEn: "Retrieval augmented generation, vector search, indexing, and knowledge systems.",
    descriptionZh: "检索增强生成、向量检索、索引与知识库系统。",
    queries: [
      "topic:rag stars:>50 archived:false pushed:>={activeSince}",
      "topic:retrieval-augmented-generation stars:>30 archived:false pushed:>={activeSince}"
    ],
    keywords: ["rag", "retrieval", "embedding", "vector", "knowledge", "semantic-search"]
  },
  {
    slug: "generative-ai",
    nameEn: "Generative AI",
    nameZh: "生成式 AI",
    descriptionEn: "Image, video, audio, 3D, diffusion, and creative AI projects.",
    descriptionZh: "图像、视频、音频、3D、扩散模型与创意 AI 项目。",
    queries: [
      "topic:generative-ai stars:>100 archived:false pushed:>={activeSince}",
      "topic:diffusion stars:>100 archived:false pushed:>={activeSince}"
    ],
    keywords: ["generative", "diffusion", "stable-diffusion", "image", "video", "audio", "3d"]
  },
  {
    slug: "ai-infra",
    nameEn: "AI Infrastructure",
    nameZh: "AI 基础设施",
    descriptionEn: "Inference, serving, MLOps, deployment, optimization, and developer infrastructure.",
    descriptionZh: "推理、服务化、MLOps、部署、优化与开发者基础设施。",
    queries: [
      "topic:llmops stars:>50 archived:false pushed:>={activeSince}",
      "topic:model-serving stars:>50 archived:false pushed:>={activeSince}"
    ],
    keywords: ["inference", "serving", "mlops", "deployment", "optimization", "quantization", "runtime"]
  },
  {
    slug: "evaluation",
    nameEn: "Evaluation & Benchmarks",
    nameZh: "评测与基准",
    descriptionEn: "Evaluation suites, benchmarks, observability, and model quality tooling.",
    descriptionZh: "评测套件、基准测试、可观测性与模型质量工具。",
    queries: [
      "topic:llm-evaluation stars:>20 archived:false pushed:>={activeSince}",
      "topic:evals stars:>20 archived:false pushed:>={activeSince}"
    ],
    keywords: ["eval", "evaluation", "benchmark", "observability", "quality", "testing", "leaderboard"]
  },
  {
    slug: "robotics",
    nameEn: "Robotics & Embodied AI",
    nameZh: "机器人与具身智能",
    descriptionEn: "Robotics, embodied AI, simulators, planning, and autonomous systems.",
    descriptionZh: "机器人、具身智能、仿真器、规划与自主系统。",
    queries: [
      "topic:robotics stars:>100 archived:false pushed:>={activeSince}",
      "topic:embodied-ai stars:>20 archived:false pushed:>={activeSince}"
    ],
    keywords: ["robot", "robotics", "embodied", "simulation", "planning", "autonomous"]
  }
];

export function buildSearchJobs(activeSince: string): SearchJob[] {
  const sorts: SearchSort[] = ["stars", "updated"];
  return CATEGORIES.flatMap((category) =>
    category.queries.flatMap((query) =>
      sorts.map((sort) => ({
        categorySlug: category.slug,
        query: query.replaceAll("{activeSince}", activeSince),
        sort
      }))
    )
  );
}

export function categoryBySlug(slug: string): CategoryConfig {
  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Unknown category: ${slug}`);
  }
  return category;
}
