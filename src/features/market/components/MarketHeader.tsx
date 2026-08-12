"use client";

import { useMarketData } from "../hooks/useMarketData";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, CircleDollarSign } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const formatNumber = (num: number) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(4);
};

export default function MarketHeader() {
  const { data: market, isLoading, isError } = useMarketData();

  if (isLoading) return <div className="w-full h-32 rounded-2xl bg-white/5 animate-pulse border border-white/10" />;
  if (isError || !market) return <div className="w-full p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400">Marché indisponible pour le moment.</div>;

  const isPositive24h = market.priceChange24h >= 0;
  const isPositive7d = market.priceChange7d >= 0;
  const chartData = market.sparkline.map((price, index) => ({ index, price }));
  const lineColor = isPositive7d ? "#10B981" : "#EF4444";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B1022] to-[#050816] overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0B90B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#F0B90B] flex items-center justify-center text-black font-bold text-xs">L</div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">LUNC / USD</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">${market.currentPrice.toFixed(6)}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive24h ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {isPositive24h ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-bold">{market.priceChange24h.toFixed(2)}%</span>
                <span className="text-[10px] text-gray-500 ml-1">24h</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive7d ? "text-green-400" : "text-red-400"}`}>
                {isPositive7d ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.priceChange7d.toFixed(2)}% <span className="text-gray-500 ml-1">7d</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-gray-500 text-xs"><DollarSign className="w-3 h-3" /> Market Cap</div>
            <span className="font-bold text-white">${formatNumber(market.marketCap)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-gray-500 text-xs"><BarChart3 className="w-3 h-3" /> Volume 24h</div>
            <span className="font-bold text-white">${formatNumber(market.volume24h)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-gray-500 text-xs"><CircleDollarSign className="w-3 h-3" /> Circ. Supply</div>
            <span className="font-bold text-white">{formatNumber(market.circulatingSupply)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-gray-500 text-xs"><CircleDollarSign className="w-3 h-3" /> Total Supply</div>
            <span className="font-bold text-white">{formatNumber(market.totalSupply)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
