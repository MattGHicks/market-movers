import { useQuery } from '@tanstack/react-query';
import { MarketMover } from '@/types';

interface MarketDataResponse {
  gainers?: MarketMover[];
  losers?: MarketMover[];
  active?: MarketMover[];
  timestamp: string;
}

/**
 * Fetch top gainers
 */
export function useTopGainers(refetchInterval?: number) {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'gainers'],
    queryFn: async () => {
      const response = await fetch('/api/market/gainers');
      if (!response.ok) {
        throw new Error('Failed to fetch top gainers');
      }
      return response.json();
    },
    refetchInterval,
  });
}

/**
 * Fetch top losers
 */
export function useTopLosers(refetchInterval?: number) {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'losers'],
    queryFn: async () => {
      const response = await fetch('/api/market/losers');
      if (!response.ok) {
        throw new Error('Failed to fetch top losers');
      }
      return response.json();
    },
    refetchInterval,
  });
}

/**
 * Fetch most active stocks
 */
export function useMostActive(refetchInterval?: number) {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'actives'],
    queryFn: async () => {
      const response = await fetch('/api/market/actives');
      if (!response.ok) {
        throw new Error('Failed to fetch most active stocks');
      }
      return response.json();
    },
    refetchInterval,
  });
}
