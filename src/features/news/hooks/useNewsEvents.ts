import { useQuery } from "@tanstack/react-query";

export interface NewsSource { name: string; trustScore: number; }
export interface NewsArticle {
  id: string; title: string; url: string; imageUrl?: string | null;
  source: NewsSource; publishedAt: string;
}
export interface NewsEvent {
  id: string; title: string; summary: string; category: string;
  avgRelevance: number; avgTrustScore: number; updatedAt: string;
  articles: NewsArticle[];
}

export const useNewsEvents = (category?: string) => {
  return useQuery<NewsEvent[]>({
    queryKey: ["news-events", category],
    queryFn: async () => {
      const url = category ? `/api/news/events?category=${category}` : "/api/news/events";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch news events");
      return res.json();
    },
    refetchInterval: 60000,
  });
};
