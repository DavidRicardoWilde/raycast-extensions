import { safeFetch } from "./utils";
import { HotItem } from "./types";

interface BiliVideoRes {
  code: number;
  message: string;
  ttl: number;
  data: {
    list: {
      aid: number;
      videos: number;
      tid: number;
      tname: string;
      copyright: number;
      pic: string;
      title: string;
      pubdate: number;
      ctime: number;
      desc: string;
      state: number;
      duration: number;
      owner: {
        mid: number;
        name: string;
        face: string;
      };
      stat: {
        view: number;
        danmaku: number;
        reply: number;
        favorite: number;
        coin: number;
        share: number;
        now_rank: number;
        his_rank: number;
        like: number;
        dislike: number;
      };
      dynamic: string;
      cid: number;
      dimension: {
        width: number;
        height: number;
        rotate: number;
      };
      short_link: string;
      short_link_v2: string;
      bvid: string;
      rcmd_reason: {
        content: string;
        corner_mark: number;
      };
    }[];
  };
}

// fetch Bilibili trending videos
export const fetchBiliTrendingVideos = async (): Promise<HotItem[]> => {
  const url = "https://api.bilibili.com/x/web-interface/popular?ps=20";

  const response = await safeFetch<BiliVideoRes>(url);

  if (!response || !response.data || !response.data.list) {
    throw new Error("Invalid data format from Bilibili API");
  }

  return response.data.list.map((item) => ({
    id: item.bvid,
    title: item.title,
    url: `https://www.bilibili.com/video/${item.bvid}`,
    hotValue: `🔥 ${item.stat.view || ""}`,
  }));
};
