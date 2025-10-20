import { useEffect, useRef } from 'react';
import { MarketMover } from '@/types';
import { useAlerts } from '@/context/AlertContext';
import { useFilters } from '@/context/FilterContext';

/**
 * Hook to detect significant stock movements and trigger alerts
 */
export function useAlertDetection(
  stocks: MarketMover[] | undefined,
  category: 'gainers' | 'losers' | 'actives'
) {
  const { addAlert } = useAlerts();
  const { settings } = useFilters();
  const previousStocks = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!stocks || stocks.length === 0) return;

    stocks.forEach(stock => {
      const previousPercent = previousStocks.current.get(stock.symbol);

      // If we have previous data, check for significant changes
      if (previousPercent !== undefined) {
        const percentChange = Math.abs(stock.changePercent - previousPercent);

        // Trigger alert if change exceeds threshold
        if (percentChange >= settings.alertThreshold) {
          const isIncrease = stock.changePercent > previousPercent;

          addAlert({
            type: isIncrease ? 'success' : 'warning',
            title: `${stock.symbol} Alert`,
            message: `${stock.name} moved ${isIncrease ? 'up' : 'down'} significantly`,
            stock,
          });
        }
      }

      // Update previous value
      previousStocks.current.set(stock.symbol, stock.changePercent);
    });
  }, [stocks, settings.alertThreshold, addAlert]);
}
