export interface MarketData {
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  sparkline: number[];
}

class MarketService {
  public async getLuncMarketData(): Promise<MarketData> {
    const response = await fetch('/api/market/lunc');
    if (!response.ok) throw new Error('Failed to fetch market data');
    return response.json();
  }
}

export const marketService = new MarketService();
