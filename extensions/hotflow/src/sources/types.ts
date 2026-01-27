export enum Source {
  BiliBili = "bilibili",
  GitHub = "github",
  HackerNews = "hackernews",
  ProductHunt = "producthunt",
  X = "x",
}

export interface HotItem {
  id: string;
  title: string;
  url: string;
  hotValue?: string;
  info?: string;
}
