import { HotItem } from "./types";
import { safeFetch } from "./utils";

interface GitHubTreadingRes {
  title: string;
  description: string;
  link: string;
  items: {
    title: string;
    url: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
  }[];
}

export const fetchGithubTrendingRepos = async (): Promise<HotItem[]> => {
  const url = "https://raw.githubusercontent.com/isboyjc/github-trending-api/main/data/daily/all.json";

  const response = await safeFetch<GitHubTreadingRes>(url);

  if (!response || !response.items || response.items.length === 0) {
    throw new Error("Failed to fetch GitHub trending repositories");
  }

  let idCounter = 1;
  return response.items.map((item) => ({
    id: (idCounter++).toString(),
    title: item.title,
    url: item.url,
    hotValue: `⭐ ${item.stars} | ${item.forks}`,
  }));
};
