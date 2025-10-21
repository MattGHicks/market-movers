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
 * Note: Refetch interval is controlled globally by QueryProvider (3 seconds)
 * React Query automatically deduplicates requests with the same query key
 */
export function useTopGainers() {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'gainers'],
    queryFn: async () => {
      const response = await fetch('/api/market/gainers');
      if (!response.ok) {
        throw new Error('Failed to fetch top gainers');
      }
      return response.json();
    },
  });
}

/**
 * Fetch top losers
 * Note: Refetch interval is controlled globally by QueryProvider (3 seconds)
 * React Query automatically deduplicates requests with the same query key
 */
export function useTopLosers() {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'losers'],
    queryFn: async () => {
      const response = await fetch('/api/market/losers');
      if (!response.ok) {
        throw new Error('Failed to fetch top losers');
      }
      return response.json();
    },
  });
}

/**
 * Fetch most active stocks
 * Note: Refetch interval is controlled globally by QueryProvider (3 seconds)
 * React Query automatically deduplicates requests with the same query key
 */
export function useMostActive() {
  return useQuery<MarketDataResponse>({
    queryKey: ['market', 'actives'],
    queryFn: async () => {
      const response = await fetch('/api/market/actives');
      if (!response.ok) {
        throw new Error('Failed to fetch most active stocks');
      }
      return response.json();
    },
  });
}
