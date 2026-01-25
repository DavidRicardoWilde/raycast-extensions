import { fetchBiliTrendingVideos } from "./bilibili";
import { fetchGithubTrendingRepos } from "./github";
import { fetchHackerNews } from "./hacknews";
import { fetchProductHuntWithKey } from "./producthunt";
import { HotItem, Source } from "./types";
import { fetchXTrending } from "./x";

export async function fetchBySource(source: Source): Promise<HotItem[]> {
  switch (source) {
    case Source.BiliBili:
      return await fetchBiliTrendingVideos();
    case Source.GitHub:
      return await fetchGithubTrendingRepos();
    case Source.ProductHunt:
      return await fetchProductHuntWithKey();
    case Source.HackerNews:
      return await fetchHackerNews();
    case Source.X:
      return await fetchXTrending();
    default:
      return [];
  }
}

export function defineSource(fetcher: () => Promise<HotItem[]>) {
  return fetcher;
}
