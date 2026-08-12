"use client";

import { motion } from "framer-motion";
import { Flame, Scale, LineChart, Code, Users, Building2, Clock, ExternalLink } from "lucide-react";
import { NewsEvent, NewsArticle } from "../hooks/useNewsEvents";

const categoryConfig: Record<string, { icon: any, color: string, bg: string }> = {
  BURN: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  GOVERNANCE: { icon: Scale, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  MARKET: { icon: LineChart, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  DEVELOPMENT: { icon: Code, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  COMMUNITY: { icon: Users, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30" },
  EXCHANGE: { icon: Building2, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
};

const timeAgo = (dateString: string) => {
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diff = Math.floor((now - date) / 60000);
  if (diff < 60) return `il y a ${diff} min`;
  if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`;
  return `il y a ${Math.floor(diff / 1440)} j`;
};

export default function NewsEventCard({ event }: { event: NewsEvent }) {
  const config = categoryConfig[event.category] || categoryConfig.MARKET;
  const Icon = config.icon;
  const relevanceColor = event.avgRelevance >= 80 ? "text-red-400" : event.avgRelevance >= 60 ? "text-yellow-400" : "text-gray-400";
  const mainArticle = event.articles[0];
  const cardHref = mainArticle?.url || "#";

  return (
    <motion.a 
      href={cardHref}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-xl border ${config.bg} backdrop-blur-md p-5 transition-all hover:scale-[1.01] hover:border-white/40 block cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bg} border ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            {event.category}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-gray-500">Impact LUNC</span>
          <span className={`text-xl font-bold ${relevanceColor}`}>
            {event.avgRelevance}<span className="text-xs text-gray-500">/100</span>
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold text-white mb-2 leading-snug flex items-start gap-2">
        {event.title}
        <ExternalLink className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {event.summary}
      </p>

      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(event.updatedAt)}</span>
          <span className="mx-1">•</span>
          <span>{event.articles.length} sources</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">Trust: {event.avgTrustScore}%</span>
        </div>
      </div>
    </motion.a>
  );
}
