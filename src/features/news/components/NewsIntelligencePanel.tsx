"use client";

import { useNewsEvents } from "../hooks/useNewsEvents";
import NewsEventCard from "./NewsEventCard";
import { Newspaper } from "lucide-react";
import { useState } from "react";

export default function NewsIntelligencePanel() {
  const { data: events, isLoading, isError } = useNewsEvents();
  const [timeFilter, setTimeFilter] = useState<"all" | "24h" | "7d">("all");

  const filteredEvents = events?.filter(event => {
    const diffMs = Math.abs(Date.now() - new Date(event.updatedAt).getTime());
    const diffHours = diffMs / (1000 * 60 * 60);

    if (timeFilter === "24h") return diffHours < 24;
    if (timeFilter === "7d") return diffHours < 24 * 7;
    return true;
  });

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" /> News Intelligence
        </h2>
        <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
          {(["all", "24h", "7d"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all uppercase ${timeFilter === f ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-500 hover:text-white border border-transparent"}`}
            >
              {f === "all" ? "Toutes" : f}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-400 text-sm border border-dashed border-red-500/20 rounded-lg">
          Erreur lors du chargement de l intelligence.
        </div>
      )}

      {filteredEvents && filteredEvents.length === 0 && (
        <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-lg flex-grow flex flex-col items-center justify-center">
          <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Aucun événement pour ce filtre.
        </div>
      )}

      {filteredEvents && filteredEvents.length > 0 && (
        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
          {filteredEvents.map((event) => <NewsEventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}
