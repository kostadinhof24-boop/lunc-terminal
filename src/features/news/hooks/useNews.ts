
'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  author: string;
  content: string;
}

export function useNews() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await axios.get('/api/news');
      return res.data.data;
    },
    refetchInterval: 300000, // 5 minutes
  });

  return {
    news: data || [],
    isLoading,
  };
}
