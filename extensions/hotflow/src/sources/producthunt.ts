import { HotItem } from "./types";
import { getPreferenceValues } from "@raycast/api";

interface PHPostNode {
  id: string;
  name: string;
  tagline: string;
  votesCount: number;
  url: string;
}

interface PHPostEdge {
  node: PHPostNode;
}

interface PHGraphQLResponse {
  data: {
    posts: {
      edges: PHPostEdge[];
    };
  };
  errors?: { message: string }[]; // 处理 API 返回的错误信息
}

export const fetchProductHuntWithKey = async (): Promise<HotItem[]> => {
  const preferences = getPreferenceValues();
  const token = preferences.phApiKey;

  if (!token) {
    throw new Error("Please configure your Product Hunt API Key");
  }

  const query = `
    {
      posts(first: 20) {
        edges {
          node {
            id
            name
            tagline
            votesCount
            url
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = (await response.json()) as PHGraphQLResponse;

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.posts.edges.map(({ node }: PHPostEdge) => ({
    id: node.id,
    title: node.name,
    url: node.url,
    hotValue: `▲ ${node.votesCount}`,
    info: node.tagline,
  }));
};
