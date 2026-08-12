"use client";

import { useNewsEvents } from "../hooks/useNewsEvents";
import NewsEventCard from "./NewsEventCard";
import { Newspaper } from "lucide-react";

// Ce composant remplace l'ancien NewsList pour utiliser la même interface que NewsIntelligencePanel
export default function NewsList() {
  const { data: events, isLoading, isError } = useNewsEvents();

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-cyan-400" /> News Intelligence
      </h2>
      
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-400 text-sm border border-dashed border-red-500/20 rounded-lg">
          Erreur lors du chargement de l intelligence.
        </div>
      )}

      {events && events.length === 0 && (
        <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-lg flex-grow flex flex-col items-center justify-center">
          <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
          En attente d événements LUNC...
        </div>
      )}

      {events && events.length > 0 && (
        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
          {events.map((event) => (
            <NewsEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
