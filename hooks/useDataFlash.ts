import { useState, useEffect, useRef } from 'react';
import { MarketMover } from '@/types';

type FlashType = 'up' | 'down' | 'volume' | null;

/**
 * Hook for tracking data changes and triggering flash animations
 */
export function useDataFlash(data: MarketMover[] | undefined) {
  const [flashingCells, setFlashingCells] = useState<Map<string, FlashType>>(new Map());
  const previousData = useRef<Map<string, MarketMover>>(new Map());

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newFlashes = new Map<string, FlashType>();

    data.forEach((stock) => {
      const prev = previousData.current.get(stock.symbol);

      if (prev) {
        // Check price changes
        if (prev.price !== stock.price) {
          const flashType = stock.price > prev.price ? 'up' : 'down';
          newFlashes.set(`${stock.symbol}-price`, flashType);
          newFlashes.set(`${stock.symbol}-change`, flashType);
          newFlashes.set(`${stock.symbol}-changePercent`, flashType);
        }

        // Check volume changes
        if (prev.volume !== stock.volume) {
          newFlashes.set(`${stock.symbol}-volume`, 'volume');
        }
      }

      // Update previous data
      previousData.current.set(stock.symbol, stock);
    });

    if (newFlashes.size > 0) {
      setFlashingCells(newFlashes);

      // Clear flashing state after animation completes
      const timer = setTimeout(() => {
        setFlashingCells(new Map());
      }, 600); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [data]);

  const getFlashClass = (symbol: string, columnKey: string): string => {
    const flashType = flashingCells.get(`${symbol}-${columnKey}`);
    if (!flashType) return '';

    switch (flashType) {
      case 'up':
        return 'cell-flash-up';
      case 'down':
        return 'cell-flash-down';
      case 'volume':
        return 'cell-flash-volume';
      default:
        return '';
    }
  };

  return { getFlashClass };
}
