export type CategoryConfig = {
  slug: string;
  nameEn: string;
  nameZh: string;
  descriptionEn: string;
  descriptionZh: string;
  queries: string[];
  keywords: string[];
};

export type SearchSort = "stars" | "updated";

export type SearchJob = {
  categorySlug: string;
  query: string;
  sort: SearchSort;
};

export type GitHubSearchOwner = {
  login: string;
  avatar_url: string;
};

export type GitHubSearchLicense = {
  key: string;
  name: string;
  spdx_id: string | null;
};

export type GitHubSearchItem = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  license: GitHubSearchLicense | null;
  homepage: string | null;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  owner: GitHubSearchOwner;
};

export type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchItem[];
};

export type Project = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  avatarUrl: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string;
  topics: string[];
  license: string;
  homepage: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  category: string;
  categories: string[];
  dailyStars: number;
  weeklyStars: number;
  hotScore: number;
  fetchedAt: string;
};

export type SnapshotProject = {
  id: number;
  fullName: string;
  stars: number;
  forks: number;
  category: string;
  pushedAt: string;
};

export type Snapshot = {
  date: string;
  generatedAt: string;
  projects: SnapshotProject[];
};

export type ProjectsFile = {
  generatedAt: string;
  date: string;
  source: {
    name: string;
    url: string;
    ranking: string;
  };
  summary: {
    totalProjects: number;
    totalStars: number;
    totalForks: number;
    categories: number;
    topDailyGrowth: number;
    topWeeklyGrowth: number;
  };
  categories: Array<{
    slug: string;
    nameEn: string;
    nameZh: string;
    descriptionEn: string;
    descriptionZh: string;
    count: number;
  }>;
  projects: Project[];
};
