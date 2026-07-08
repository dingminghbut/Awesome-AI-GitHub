import type { CategoryConfig, OfficialDiscoverySource, SearchJob, SearchSort } from "./types.js";

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
  newcomerDays: 180,
  officialDiscoverySeedLimit: 300,
  officialDiscoveryRepoLimit: 120
} as const;

export const OFFICIAL_DISCOVERY_SOURCES: readonly OfficialDiscoverySource[] = [
  {
    kind: "explore",
    label: "GitHub Explore",
    url: "https://github.com/explore"
  },
  {
    kind: "trending",
    label: "GitHub Trending daily",
    url: "https://github.com/trending?since=daily"
  },
  {
    kind: "trending",
    label: "GitHub Trending weekly",
    url: "https://github.com/trending?since=weekly"
  },
  {
    kind: "trending",
    label: "GitHub Trending Python daily",
    url: "https://github.com/trending/python?since=daily"
  },
  {
    kind: "trending",
    label: "GitHub Trending TypeScript daily",
    url: "https://github.com/trending/typescript?since=daily"
  },
  {
    kind: "trending",
    label: "GitHub Trending JavaScript daily",
    url: "https://github.com/trending/javascript?since=daily"
  },
  {
    kind: "topic",
    label: "GitHub Topic: ecommerce",
    url: "https://github.com/topics/ecommerce",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: shopify",
    url: "https://github.com/topics/shopify",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: amazon",
    url: "https://github.com/topics/amazon",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: marketplace",
    url: "https://github.com/topics/marketplace",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: woocommerce",
    url: "https://github.com/topics/woocommerce",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: magento",
    url: "https://github.com/topics/magento",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: bigcommerce",
    url: "https://github.com/topics/bigcommerce",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: prestashop",
    url: "https://github.com/topics/prestashop",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: opencart",
    url: "https://github.com/topics/opencart",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: shopware",
    url: "https://github.com/topics/shopware",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: commercetools",
    url: "https://github.com/topics/commercetools",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: headless-commerce",
    url: "https://github.com/topics/headless-commerce",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: saleor",
    url: "https://github.com/topics/saleor",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: medusa",
    url: "https://github.com/topics/medusa",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: vendure",
    url: "https://github.com/topics/vendure",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: sylius",
    url: "https://github.com/topics/sylius",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: ebay",
    url: "https://github.com/topics/ebay",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: etsy",
    url: "https://github.com/topics/etsy",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: walmart",
    url: "https://github.com/topics/walmart",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: tiktok",
    url: "https://github.com/topics/tiktok",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: shopee",
    url: "https://github.com/topics/shopee",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: lazada",
    url: "https://github.com/topics/lazada",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: aliexpress",
    url: "https://github.com/topics/aliexpress",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: mercado-libre",
    url: "https://github.com/topics/mercado-libre",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: taobao",
    url: "https://github.com/topics/taobao",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: pinduoduo",
    url: "https://github.com/topics/pinduoduo",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: douyin",
    url: "https://github.com/topics/douyin",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: xiaohongshu",
    url: "https://github.com/topics/xiaohongshu",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: ai-agents",
    url: "https://github.com/topics/ai-agents",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: llm",
    url: "https://github.com/topics/llm",
    categorySlug: "llm"
  },
  {
    kind: "topic",
    label: "GitHub Topic: rag",
    url: "https://github.com/topics/rag",
    categorySlug: "rag"
  },
  {
    kind: "topic",
    label: "GitHub Topic: generative-ai",
    url: "https://github.com/topics/generative-ai",
    categorySlug: "generative-ai"
  },
  {
    kind: "topic",
    label: "GitHub Topic: image-generation",
    url: "https://github.com/topics/image-generation",
    categorySlug: "generative-ai"
  },
  {
    kind: "topic",
    label: "GitHub Topic: recommendation-system",
    url: "https://github.com/topics/recommendation-system",
    categorySlug: "ai-infra"
  },
  {
    kind: "topic",
    label: "GitHub Topic: marketing-automation",
    url: "https://github.com/topics/marketing-automation",
    categorySlug: "agents"
  },
  {
    kind: "topic",
    label: "GitHub Topic: customer-support",
    url: "https://github.com/topics/customer-support",
    categorySlug: "faq-generation"
  },
  {
    kind: "topic",
    label: "GitHub Topic: robotics",
    url: "https://github.com/topics/robotics",
    categorySlug: "robotics"
  }
] as const;

export const COMMERCE_PLATFORM_KEYWORDS = [
  "amazon seller",
  "amazon seller central",
  "amazon marketplace",
  "amazon listing",
  "amazon product",
  "amazon fba",
  "amazon seo",
  "amazon skills",
  "amazon ads",
  "shopify",
  "shopify plus",
  "woocommerce",
  "magento",
  "adobe commerce",
  "bigcommerce",
  "prestashop",
  "opencart",
  "shopware",
  "commercetools",
  "salesforce commerce cloud",
  "headless commerce",
  "saleor",
  "medusa",
  "vendure",
  "sylius",
  "marketplace",
  "online marketplace",
  "cross-border ecommerce",
  "cross border ecommerce",
  "ebay",
  "walmart marketplace",
  "taobao",
  "tmall",
  "jd",
  "pinduoduo",
  "douyin",
  "kuaishou",
  "xiaohongshu",
  "temu",
  "shein",
  "tiktok shop",
  "shopee",
  "lazada",
  "aliexpress",
  "etsy",
  "mercado libre",
  "rakuten",
  "coupang",
  "tokopedia",
  "bukalapak",
  "flipkart",
  "meesho",
  "myntra",
  "poshmark",
  "mercari",
  "depop",
  "vinted",
  "淘宝",
  "天猫",
  "京东",
  "拼多多",
  "抖音",
  "快手",
  "小红书",
  "得物",
  "唯品会",
  "跨境电商",
  "独立站",
  "平台电商",
  "内容电商",
  "兴趣电商",
  "社交电商",
  "直播电商",
  "货架电商",
  "二手电商"
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
  "listing title",
  "product title",
  "title generator",
  "title optimization",
  "bullet points",
  "five bullets",
  "5 bullets",
  "product bullets",
  "main image",
  "hero image",
  "primary image",
  "gallery image",
  "secondary image",
  "lifestyle image",
  "infographic",
  "a+ content",
  "a plus content",
  "enhanced brand content",
  "product detail page",
  "product description",
  "faq generator",
  "product faq",
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
  "标题生成",
  "关键词",
  "主图",
  "主图生成",
  "附图",
  "场景图",
  "详情页",
  "a+",
  "a+页面",
  "五点",
  "五点描述",
  "卖点",
  "问答",
  "faq",
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
      "product qa chatbot stars:>10 archived:false pushed:>={activeSince}",
      "marketplace chatbot ai stars:>10 archived:false pushed:>={activeSince}",
      "seller assistant ai stars:>10 archived:false pushed:>={activeSince}"
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
      "amazon seller ai stars:>10 archived:false pushed:>={activeSince}",
      "marketplace seller ai stars:>10 archived:false pushed:>={activeSince}",
      "cross border ecommerce ai stars:>10 archived:false pushed:>={activeSince}",
      "tiktok shop ai stars:>5 archived:false pushed:>={activeSince}",
      "etsy seller ai stars:>5 archived:false pushed:>={activeSince}",
      "shopee ai stars:>5 archived:false pushed:>={activeSince}",
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
      "shopify search ai stars:>10 archived:false pushed:>={activeSince}",
      "marketplace product search ai stars:>10 archived:false pushed:>={activeSince}",
      "product catalog ai search stars:>10 archived:false pushed:>={activeSince}"
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
      "ad creative ai stars:>20 archived:false pushed:>={activeSince}",
      "marketplace listing ai stars:>10 archived:false pushed:>={activeSince}",
      "amazon listing ai stars:>10 archived:false pushed:>={activeSince}",
      "ecommerce product content ai stars:>10 archived:false pushed:>={activeSince}"
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
    slug: "title-generation",
    nameEn: "Listing Title Generation",
    nameZh: "标题生成",
    descriptionEn: "AI tools and skills for ecommerce product titles, keyword-rich listing titles, SEO titles, and platform-specific title optimization.",
    descriptionZh: "面向商品标题、关键词标题、SEO 标题与平台规则标题优化的 AI 工具和技能。",
    queries: [
      "product title generator ai stars:>5 archived:false pushed:>={activeSince}",
      "amazon title optimization ai stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce title optimization stars:>5 archived:false pushed:>={activeSince}",
      "listing title generator stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "title",
      "product title",
      "listing title",
      "title generator",
      "title optimization",
      "keyword title",
      "seo title",
      "标题",
      "标题生成",
      "标题优化",
      "关键词"
    ]
  },
  {
    slug: "bullet-points",
    nameEn: "Five-Bullet Copy Generation",
    nameZh: "五点描述生成",
    descriptionEn: "AI tools and skills for Amazon five bullets, product selling points, feature-benefit copy, and concise listing bullet generation.",
    descriptionZh: "面向 Amazon 五点、商品卖点、功能利益点和精炼列表文案的 AI 工具和技能。",
    queries: [
      "amazon bullet points ai stars:>5 archived:false pushed:>={activeSince}",
      "product bullet generator ai stars:>5 archived:false pushed:>={activeSince}",
      "listing bullet points stars:>5 archived:false pushed:>={activeSince}",
      "product selling points ai stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce listing copy ai stars:>5 archived:false pushed:>={activeSince}",
      "amazon listing copy ai stars:>5 archived:false pushed:>={activeSince}",
      "product description generator ai stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "bullet",
      "bullets",
      "bullet points",
      "five bullets",
      "5 bullets",
      "selling points",
      "listing copy",
      "product copy",
      "product description",
      "benefit copy",
      "feature benefit",
      "五点",
      "五点描述",
      "卖点",
      "利益点"
    ]
  },
  {
    slug: "main-image",
    nameEn: "Main Image Generation",
    nameZh: "主图生成",
    descriptionEn: "AI tools and skills for product hero images, marketplace main images, background cleanup, white-background shots, and conversion-focused primary visuals.",
    descriptionZh: "面向商品主图、平台首图、背景清理、白底图和转化导向首图的 AI 工具和技能。",
    queries: [
      "product main image ai stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce main image generator stars:>5 archived:false pushed:>={activeSince}",
      "amazon product image ai stars:>5 archived:false pushed:>={activeSince}",
      "product hero image ai stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "main image",
      "hero image",
      "primary image",
      "product image",
      "product photo",
      "white background",
      "background removal",
      "主图",
      "首图",
      "白底图",
      "抠图",
      "商品图"
    ]
  },
  {
    slug: "secondary-images",
    nameEn: "Secondary Image & Gallery Generation",
    nameZh: "附图与场景图生成",
    descriptionEn: "AI tools and skills for product gallery images, lifestyle scenes, infographics, comparison images, detail images, and carousel assets.",
    descriptionZh: "面向商品附图、场景图、信息图、对比图、详情图和轮播素材的 AI 工具和技能。",
    queries: [
      "secondary product images ai stars:>5 archived:false pushed:>={activeSince}",
      "product lifestyle image ai stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce product gallery ai stars:>5 archived:false pushed:>={activeSince}",
      "product infographic ai stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce image suite stars:>5 archived:false pushed:>={activeSince}",
      "product image suite ai stars:>5 archived:false pushed:>={activeSince}",
      "product detail image ai stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "secondary image",
      "gallery image",
      "lifestyle image",
      "infographic",
      "comparison image",
      "detail image",
      "image suite",
      "photo suite",
      "carousel",
      "附图",
      "场景图",
      "详情图",
      "信息图",
      "对比图",
      "轮播图",
      "套图",
      "图片套图"
    ]
  },
  {
    slug: "a-plus",
    nameEn: "A+ Content Generation",
    nameZh: "A+ 页面生成",
    descriptionEn: "AI tools and skills for Amazon A+ content, enhanced brand content, product detail modules, brand story pages, and rich listing pages.",
    descriptionZh: "面向 Amazon A+、品牌增强内容、详情模块、品牌故事页和富内容详情页的 AI 工具和技能。",
    queries: [
      "amazon a plus content ai stars:>5 archived:false pushed:>={activeSince}",
      "enhanced brand content ai stars:>5 archived:false pushed:>={activeSince}",
      "product detail page ai generator stars:>5 archived:false pushed:>={activeSince}",
      "ecommerce a plus content stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "a+ content",
      "a plus content",
      "enhanced brand content",
      "brand story",
      "product detail page",
      "detail page",
      "rich content",
      "a+",
      "a+页面",
      "品牌故事",
      "详情页",
      "详情模块"
    ]
  },
  {
    slug: "faq-generation",
    nameEn: "FAQ Generation",
    nameZh: "FAQ 生成",
    descriptionEn: "AI tools and skills for product FAQs, buyer Q&A, objection handling, pre-sales answers, support macros, and listing question generation.",
    descriptionZh: "面向商品 FAQ、买家问答、异议处理、售前回答、客服话术和详情页问答生成的 AI 工具和技能。",
    queries: [
      "ecommerce faq generator ai stars:>5 archived:false pushed:>={activeSince}",
      "product faq ai stars:>5 archived:false pushed:>={activeSince}",
      "customer question answering ecommerce stars:>5 archived:false pushed:>={activeSince}",
      "product q&a generator stars:>5 archived:false pushed:>={activeSince}"
    ],
    keywords: [
      "faq",
      "product faq",
      "q&a",
      "question answering",
      "buyer questions",
      "objection handling",
      "support macro",
      "customer support",
      "faq生成",
      "问答",
      "买家问答",
      "异议处理",
      "售前",
      "客服话术"
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
      "commerce search engine stars:>10 archived:false pushed:>={activeSince}",
      "marketplace recommendation system stars:>10 archived:false pushed:>={activeSince}",
      "headless commerce ai stars:>10 archived:false pushed:>={activeSince}"
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
      "marketing attribution ai stars:>10 archived:false pushed:>={activeSince}",
      "marketplace analytics ai stars:>10 archived:false pushed:>={activeSince}",
      "ecommerce growth analytics stars:>10 archived:false pushed:>={activeSince}"
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
