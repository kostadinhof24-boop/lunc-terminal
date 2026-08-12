"use client";

import NewsIntelligencePanel from "@/features/news/components/NewsIntelligencePanel";

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">News Intelligence</h1>
            <p className="text-gray-500 mt-1">Événements LUNC agrégés et analysés par IA en temps réel.</p>
          </div>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <NewsIntelligencePanel />
        </div>
      </div>
    </main>
  );
}
