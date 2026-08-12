'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function LivePriceHeader() {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)

  useEffect(() => {
    let polling: number | undefined

    const fetchPriceFromApi = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=LUNCUSDT')
        const data = await response.json()
        setPrice(parseFloat(data.lastPrice))
        setChange(parseFloat(data.priceChangePercent))
      } catch (error) {
        console.error('Erreur de récupération du prix LUNC:', error)
      }
    }

    fetchPriceFromApi()
    polling = window.setInterval(fetchPriceFromApi, 15_000)

    return () => {
      if (polling) window.clearInterval(polling)
    }
  }, [])

  const isPositive = (change ?? 0) >= 0

  return (
    <div className="text-left md:text-right">
      <div className="text-4xl md:text-5xl font-extrabold text-galaxy-white tabular-nums">
        ${price !== null ? price.toFixed(8) : 'Chargement...'}
      </div>
      <div className={`text-xl font-bold flex items-center gap-2 justify-start md:justify-end mt-1 ${isPositive ? 'text-galaxy-green' : 'text-galaxy-red'}`}>
        {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        {change !== null ? `${isPositive ? '+' : ''}${change.toFixed(2)}%` : '...'}
      </div>
    </div>
  )
}