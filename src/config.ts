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

export const COMMERCE_PLATFORM_KEYWORDS = [
  "amazon",
  "amazon seller",
  "shopify",
  "woocommerce",
  "magento",
  "taobao",
  "tmall",
  "jd",
  "douyin",
  "kuaishou",
  "xiaohongshu",
  "tiktok shop",
  "shopee",
  "lazada",
  "aliexpress",
  "etsy",
  "mercado libre",
  "淘宝",
  "天猫",
  "京东",
  "抖音",
  "快手",
  "小红书",
  "拼多多"
] as const;

export const COMMERCE_SKILL_KEYWORDS = [
  "commerce skill",
  "ecommerce skill",
  "operator skill",
  "ops skill",
  "skill library",
  "skill pack",
  "playbook",
  "sop",
  "checklist",
  "product selection",
  "sourcing",
  "merchandising",
  "listing optimization",
  "title optimization",
  "keyword research",
  "seo",
  "pricing",
  "promotion",
  "coupon",
  "campaign",
  "media buying",
  "ads",
  "affiliate",
  "influencer",
  "live commerce",
  "private traffic",
  "crm",
  "customer support",
  "after-sales",
  "returns",
  "review management",
  "inventory",
  "fulfillment",
  "sales script",
  "conversion optimization",
  "retention",
  "repurchase",
  "data analysis",
  "运营技能",
  "选品",
  "货盘",
  "供应链",
  "上新",
  "上架",
  "标题优化",
  "关键词",
  "主图",
  "详情页",
  "卖点",
  "定价",
  "促销",
  "优惠券",
  "投放",
  "千川",
  "直通车",
  "万相台",
  "广告",
  "活动",
  "大促",
  "直播",
  "短视频",
  "达人",
  "分销",
  "私域",
  "社群",
  "会员",
  "复购",
  "客服",
  "售后",
  "评价",
  "差评",
  "退换货",
  "库存",
  "履约",
  "数据复盘",
  "转化率"
] as const;

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "llm",
    nameEn: "Commerce LLM & Shopping Chat",
    nameZh: "电商 LLM 与导购客服",
    descriptionEn: "Shopping assistants, customer-service chatbots, product Q&A, review summarization, sales scripts, and commerce prompt workflows.",
    descriptionZh: "导购助手、客服对话、商品问答、评价总结、销售话术与电商提示词工作流。",
    queries: [
      "ecommerce llm stars:>20 archived:false pushed:>={activeSince}",
      "shopping assistant ai stars:>20 archived:false pushed:>={activeSince}",
      "customer service chatbot ai stars:>20 archived:false pushed:>={activeSince}",
      "product qa chatbot stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "llm",
      "large language model",
      "chatgpt",
      "gpt",
      "prompt",
      "chatbot",
      "shopping assistant",
      "customer service",
      "product qa",
      "review summary",
      "sales script",
      "customer support",
      "after-sales",
      "review management",
      "faq",
      "operations",
      "运营",
      "ecommerce",
      "e-commerce",
      ...COMMERCE_PLATFORM_KEYWORDS
    ]
  },
  {
    slug: "agents",
    nameEn: "Commerce Agents & Ops Skills",
    nameZh: "电商智能体与运营技能",
    descriptionEn: "Agents and skill playbooks for merchant operations, listings, pricing, ads, CRM, order handling, SOPs, and multi-step commerce workflows.",
    descriptionZh: "面向店铺运营、上架、定价、投放、CRM、订单处理、SOP 和多步骤电商流程的智能体与技能方法库。",
    queries: [
      "ecommerce agent stars:>20 archived:false pushed:>={activeSince}",
      "shopify ai agent stars:>20 archived:false pushed:>={activeSince}",
      "marketing automation ai agent stars:>20 archived:false pushed:>={activeSince}",
      "retail automation ai stars:>20 archived:false pushed:>={activeSince}",
      "ecommerce operations ai stars:>10 archived:false pushed:>={activeSince}",
      "marketing playbook ai stars:>10 archived:false pushed:>={activeSince}",
      "ecommerce skill stars:>10 archived:false pushed:>={activeSince}",
      "shopify skill ai stars:>10 archived:false pushed:>={activeSince}",
      "seller operations ai stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "agent",
      "agents",
      "autonomous",
      "tool-use",
      "multi-agent",
      "workflow",
      "skill",
      "skills",
      "playbook",
      "sop",
      "operations",
      "growth",
      "merchandising",
      "merchant",
      "listing",
      "listing optimization",
      "pricing",
      "ads",
      "campaign",
      "crm",
      "order",
      "运营",
      "投放",
      "选品",
      "上架",
      "ecommerce",
      ...COMMERCE_PLATFORM_KEYWORDS,
      ...COMMERCE_SKILL_KEYWORDS
    ]
  },
  {
    slug: "rag",
    nameEn: "Product RAG & Knowledge Search",
    nameZh: "商品 RAG 与知识检索",
    descriptionEn: "Catalog retrieval, semantic product search, FAQ knowledge bases, vector indexing, and shopper-facing search experiences.",
    descriptionZh: "商品目录检索、语义搜索、FAQ 知识库、向量索引与面向消费者的搜索体验。",
    queries: [
      "ecommerce rag stars:>10 archived:false pushed:>={activeSince}",
      "product search vector database stars:>10 archived:false pushed:>={activeSince}",
      "semantic search ecommerce stars:>10 archived:false pushed:>={activeSince}",
      "shopify search ai stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "rag",
      "retrieval",
      "embedding",
      "vector",
      "knowledge",
      "semantic-search",
      "product search",
      "catalog",
      "sku",
      "faq",
      "review",
      "customer support",
      "recommendation",
      "ecommerce",
      "商品库",
      "知识库",
      ...COMMERCE_PLATFORM_KEYWORDS
    ]
  },
  {
    slug: "generative-ai",
    nameEn: "Generative Commerce Content",
    nameZh: "电商生成式内容",
    descriptionEn: "Product images, ad creatives, listing copy, short videos, virtual try-on, backgrounds, campaign assets, and operator-ready content workflows.",
    descriptionZh: "商品图、广告素材、详情文案、短视频、虚拟试穿、背景图、营销活动素材与运营内容工作流。",
    queries: [
      "product image ai stars:>20 archived:false pushed:>={activeSince}",
      "ecommerce generative ai stars:>20 archived:false pushed:>={activeSince}",
      "virtual try-on ai stars:>20 archived:false pushed:>={activeSince}",
      "ad creative ai stars:>20 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "generative",
      "diffusion",
      "stable-diffusion",
      "image",
      "video",
      "product image",
      "product photo",
      "background removal",
      "virtual try-on",
      "copywriting",
      "product copy",
      "ad creative",
      "campaign",
      "marketing",
      "content operations",
      "listing copy",
      "运营",
      "aigc",
      "ecommerce",
      "主图",
      "详情页",
      "卖点",
      "短视频",
      "直播",
      "素材",
      ...COMMERCE_PLATFORM_KEYWORDS
    ]
  },
  {
    slug: "ai-infra",
    nameEn: "Commerce AI Infrastructure",
    nameZh: "电商 AI 基础设施",
    descriptionEn: "Serving, MLOps, data pipelines, search/recommendation infrastructure, feature stores, and platform tooling for commerce AI.",
    descriptionZh: "服务化、MLOps、数据管线、搜索/推荐基础设施、特征平台与电商 AI 工程工具。",
    queries: [
      "ecommerce mlops stars:>10 archived:false pushed:>={activeSince}",
      "recommendation system serving stars:>20 archived:false pushed:>={activeSince}",
      "retail ai platform stars:>10 archived:false pushed:>={activeSince}",
      "commerce search engine stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "inference",
      "serving",
      "mlops",
      "deployment",
      "optimization",
      "runtime",
      "feature store",
      "pipeline",
      "recommender",
      "search engine",
      "commerce",
      "retail",
      "inventory",
      "order",
      "sku",
      ...COMMERCE_PLATFORM_KEYWORDS
    ]
  },
  {
    slug: "evaluation",
    nameEn: "Commerce Evaluation & Growth Analytics",
    nameZh: "电商评测与增长分析",
    descriptionEn: "Recommendation evaluation, A/B testing, attribution, conversion analytics, growth operations metrics, LLM quality checks, and commerce observability.",
    descriptionZh: "推荐评测、A/B 测试、归因、转化分析、增长运营指标、LLM 质量检查与电商可观测性。",
    queries: [
      "recommendation evaluation stars:>10 archived:false pushed:>={activeSince}",
      "ab testing ecommerce stars:>10 archived:false pushed:>={activeSince}",
      "llm evaluation ecommerce stars:>10 archived:false pushed:>={activeSince}",
      "marketing attribution ai stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "eval",
      "evaluation",
      "benchmark",
      "observability",
      "quality",
      "testing",
      "ab testing",
      "conversion",
      "attribution",
      "analytics",
      "growth",
      "funnel",
      "retention",
      "campaign",
      "recommendation",
      "ranking",
      "运营",
      "ecommerce",
      "数据复盘",
      "转化率",
      "投产比",
      "roi",
      "roas",
      ...COMMERCE_PLATFORM_KEYWORDS,
      ...COMMERCE_SKILL_KEYWORDS
    ]
  },
  {
    slug: "robotics",
    nameEn: "Retail Robotics & Fulfillment",
    nameZh: "零售机器人与履约自动化",
    descriptionEn: "Warehouse robots, inventory automation, shelf scanning, fulfillment, delivery, and embodied AI for retail operations.",
    descriptionZh: "仓储机器人、库存自动化、货架识别、履约配送与零售运营中的具身智能。",
    queries: [
      "warehouse robotics ai stars:>10 archived:false pushed:>={activeSince}",
      "inventory automation ai stars:>10 archived:false pushed:>={activeSince}",
      "retail robotics stars:>10 archived:false pushed:>={activeSince}",
      "delivery robot ai stars:>10 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "robot",
      "robotics",
      "embodied",
      "simulation",
      "planning",
      "autonomous",
      "warehouse",
      "inventory",
      "shelf",
      "fulfillment",
      "delivery",
      "retail",
      "logistics"
    ]
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
