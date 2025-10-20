import { MarketMover, ScanFilter } from '@/types';

/**
 * Apply filters to a list of stocks
 */
export function filterStocks(stocks: MarketMover[], filters: ScanFilter): MarketMover[] {
  return stocks.filter(stock => {
    // Filter by minimum volume
    if (filters.minVolume !== undefined && stock.volume < filters.minVolume) {
      return false;
    }

    // Filter by minimum price
    if (filters.minPrice !== undefined && stock.price < filters.minPrice) {
      return false;
    }

    // Filter by maximum price
    if (filters.maxPrice !== undefined && stock.price > filters.maxPrice) {
      return false;
    }

    // Filter by minimum change percent
    if (filters.minChangePercent !== undefined && Math.abs(stock.changePercent) < filters.minChangePercent) {
      return false;
    }

    // Filter by sectors (if implemented in future)
    if (filters.sectors && filters.sectors.length > 0) {
      // This would require sector data from the API
      // Placeholder for future implementation
    }

    return true;
  });
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: ScanFilter): boolean {
  return (
    filters.minVolume !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minChangePercent !== undefined ||
    !!(filters.sectors && filters.sectors.length > 0)
  );
}

/**
 * Get count of active filters
 */
export function getActiveFilterCount(filters: ScanFilter): number {
  let count = 0;
  if (filters.minVolume !== undefined) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.minChangePercent !== undefined) count++;
  if (filters.sectors && filters.sectors.length > 0) count++;
  return count;
}
