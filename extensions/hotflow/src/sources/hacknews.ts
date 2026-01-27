import { HotItem } from "./types";
import { safeFetch } from "./utils";

interface HNHit {
  objectID: string;
  title: string;
  url: string | null;
  points: number;
  author: string;
  num_comments: number;
}

interface HNResponse {
  hits: HNHit[];
}

export const fetchHackerNews = async (): Promise<HotItem[]> => {
  const url = "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20";

  const data = await safeFetch<HNResponse>(url);

  if (!data || !data.hits) {
    throw new Error("Failed to fetch data from Hacker News");
  }

  return data.hits.map((item) => {
    const displayUrl = item.url || `https://news.ycombinator.com/item?id=${item.objectID}`;

    return {
      id: item.objectID,
      title: item.title,
      url: displayUrl,
      info: `${item.author} · ${item.num_comments} comments`,
    };
  });
};
