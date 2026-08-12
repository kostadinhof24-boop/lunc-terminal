'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { TrendingUp, DollarSign, BarChart2 } from 'lucide-react'

export default function LivePrice() {
  const { data, isLoading } = useQuery({
    queryKey: ['luncPrice'],
    queryFn: async () => {
      const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=LUNCUSDT')
      return res.data
    },
    refetchInterval: 10000,
  })

  const price = isLoading ? '---' : parseFloat(data.lastPrice).toFixed(8)
  const change = isLoading ? 0 : parseFloat(data.priceChangePercent)
  const isPositive = change >= 0
  const volume = isLoading ? '---' : (parseFloat(data.quoteVolume) / 1_000_000).toFixed(2)

  return (
    <div className="glass-card rounded-3xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-galaxy-gray text-xs font-bold uppercase tracking-widest">Prix LUNC (Live)</span>
          <TrendingUp className={`w-5 h-5 ${isPositive ? 'text-galaxy-green' : 'text-galaxy-red'}`} />
        </div>
        <div className="text-4xl font-bold mb-1 text-galaxy-white">${price}</div>
        <div className={`text-lg font-bold ${isPositive ? 'text-galaxy-green' : 'text-galaxy-red'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1 text-galaxy-gray text-xs uppercase tracking-widest mb-1">
            <DollarSign className="w-3 h-3" /> M. Cap
          </div>
          <div className="font-bold text-lg text-galaxy-white">$450M</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-galaxy-gray text-xs uppercase tracking-widest mb-1">
            <BarChart2 className="w-3 h-3" /> Vol 24h
          </div>
          <div className="font-bold text-lg text-galaxy-white">${volume}M</div>
        </div>
      </div>
    </div>
  )
}