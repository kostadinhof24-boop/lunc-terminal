"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Utilisation d'un flux RSS public pour Terra Classic
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss/tag/terra`);
        const data = await res.json();
        if (data.status === "ok") {
          setArticles(data.items.slice(0, 15));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-t-[#F0B90B] border-gray-700 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading latest news...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Newspaper className="w-10 h-10 text-[#F0B90B]" />
          <div>
            <h1 className="text-4xl font-bold text-white">News</h1>
            <p className="text-gray-400 mt-1">Latest news and updates about Terra Classic</p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article, index) => (
            <motion.a 
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-[#F0B90B] uppercase tracking-wider">{article.source || "Crypto News"}</span>
                <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-[#F0B90B] transition-colors">{article.title}</h3>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500">
                  {new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
}