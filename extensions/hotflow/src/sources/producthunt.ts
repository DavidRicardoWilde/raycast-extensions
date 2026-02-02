import { HotItem } from "./types";
import { getPreferenceValues } from "@raycast/api";
import { safeFetch } from "./utils";

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
  errors?: { message: string }[];
}

export const fetchProductHuntWithKey = async (): Promise<HotItem[]> => {
  const { phApiKey: token } = getPreferenceValues();

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

  const json = await safeFetch<PHGraphQLResponse>("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!json || json.errors) {
    throw new Error(json?.errors?.[0]?.message ?? "Failed to fetch Product Hunt posts");
  }

  return json.data.posts.edges.map(({ node }: PHPostEdge) => ({
    id: node.id,
    title: node.name,
    url: node.url,
    hotValue: `▲ ${node.votesCount}`,
    info: node.tagline,
  }));
};
