import { useQuery } from '@tanstack/react-query';
import { marketService, MarketData } from '../services/market.service';

export const useMarketData = () => {
  return useQuery<MarketData>({
    queryKey: ['lunc-market-data'],
    queryFn: () => marketService.getLuncMarketData(),
    refetchInterval: 60000, // Rafraîchit toutes les 60 secondes
    staleTime: 50000,
  });
};
