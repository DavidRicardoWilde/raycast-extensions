import { HotItem } from "./types";
import { safeFetch } from "./utils";

export const fetchXTrending = async (): Promise<HotItem[]> => {
  const url = "https://trends24.in/";
  const html = await safeFetch<string>(url, {
    responseType: "text",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://trends24.in/",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Cache-Control": "max-age=0",
    },
  });

  const s = html.includes(`<ol class=trend-card__list>`);
  if (!s) {
    throw new Error("Unexpected response structure from X Trends page");
  }

  const listMatch = html.match(/<ol class=trend-card__list>([\s\S]*?)<\/ol>/);
  if (!listMatch) {
    throw new Error("Unable to find trending topics on the page");
  }

  const listHtml = listMatch[1];

  const itemRegex = /<a href="([^"]+)" class=trend-link>([^<]+)<\/a>/g;

  const results: HotItem[] = [];
  let match;

  while ((match = itemRegex.exec(listHtml)) !== null) {
    const [, link, title] = match;
    results.push({
      id: title.trim(),
      title: title.trim(),
      url: link,
      hotValue: "Trending",
      info: "X (Twitter) Trends",
    });
  }

  if (results.length === 0) {
    throw new Error("No trending topics found");
  }

  return results;
};
