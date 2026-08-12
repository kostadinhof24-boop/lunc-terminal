const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Création du module News...");

// 1. Route API pour fetcher le RSS (Côté Serveur)
w('src/app/api/news/route.ts', `
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  headers: { 'User-Agent': 'LUNC-Terminal/1.0' }
});

const FEEDS = [
  { url: 'https://www.reddit.com/r/terraluna.rss', source: 'Reddit' },
  { url: 'https://www.reddit.com/r/LUNCClassics.rss', source: 'Reddit' },
  { url: 'https://medium.com/feed/@terracvita', source: 'Medium' }
];

export async function GET() {
  try {
    const allNews = [];
    
    // On fetch tous les flux en parallèle
    const feedPromises = FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        parsed.items.slice(0, 10).forEach((item) => {
          allNews.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            source: feed.source,
            author: item.creator || item.author || 'Unknown',
            content: item.contentSnippet || item.content || ''
          });
        });
      } catch (e) {
        console.error(\`Erreur sur le flux \${feed.url}:\`, e);
      }
    });

    await Promise.all(feedPromises);

    // Trier par date (du plus récent au plus ancien)
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({ success: true, data: allNews.slice(0, 30) });
  } catch (error) {
    console.error("Erreur API News:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`);

// 2. Hook pour les News
w('src/features/news/hooks/useNews.ts', `
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
`);

// 3. Composant UI NewsList
w('src/features/news/components/NewsList.tsx', `
'use client';

import { useNews } from '../hooks/useNews';
import { Loader, Newspaper, ExternalLink, Clock } from 'lucide-react';

export default function NewsList() {
  const { news, isLoading } = useNews();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffH < 1) return 'À l\\'instant';
    if (diffH < 24) return \`Il y a \${diffH}h\`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getSourceColor = (source) => {
    if (source === 'Reddit') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (source === 'Medium') return 'bg-galaxy-gray/20 text-galaxy-gray border-galaxy-gray/30';
    return 'bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30';
  };

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Newspaper className="w-7 h-7 text-terra-yellow" /> Fil d'Actualité
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-terra-yellow" />
        </div>
      ) : (
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {news.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-space-bg/50 p-4 rounded-2xl border border-white/10 hover:border-terra-yellow/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={\`px-2 py-1 rounded-full text-xs font-bold border \${getSourceColor(item.source)}\`}>{item.source}</span>
                <span className="text-xs text-galaxy-gray-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDate(item.pubDate)}
                </span>
              </div>
              <h3 className="font-bold text-galaxy-white group-hover:text-terra-yellow transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-galaxy-gray line-clamp-2">
                {item.content.substring(0, 150)}...
              </p>
              <div className="mt-2 text-xs text-galaxy-gray-muted flex items-center gap-1">
                Lire plus <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
`);

// 4. Page Actualités
w('src/app/actualites/page.tsx', `
"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const NewsList = dynamic(() => import('@/features/news/components/NewsList'), { ssr: false });

export default function NewsPage() {
  return (
    <main className="min-h-screen relative container mx-auto px-6 py-8 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Actualités Terra Classic</h1>
        <p className="text-galaxy-gray text-sm">Les dernières nouvelles de l'écosystème agrégées en temps réel.</p>
      </motion.div>

      <NewsList />
    </main>
  );
}
`);

console.log('\n🎉 Module News créé avec succès !');