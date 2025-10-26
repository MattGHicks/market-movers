'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StockQuote } from '@/types/stock.types';
import { marketDataSimulator } from '@/lib/services/market-data-simulator';

interface MarketDataContextType {
  stocks: StockQuote[];
  getStock: (symbol: string) => StockQuote | undefined;
  getTopGainers: (limit?: number) => StockQuote[];
  getTopLosers: (limit?: number) => StockQuote[];
  getVolumeLeaders: (limit?: number) => StockQuote[];
  searchSymbols: (query: string) => StockQuote[];
  isSimulatorRunning: boolean;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

interface MarketDataProviderProps {
  children: ReactNode;
}

export function MarketDataProvider({ children }: MarketDataProviderProps) {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);

  useEffect(() => {
    // Start the simulator when component mounts
    marketDataSimulator.start(2000); // Update every 2 seconds
    setIsSimulatorRunning(true);

    // Subscribe to updates
    const unsubscribe = marketDataSimulator.subscribe((updatedStocks) => {
      setStocks(updatedStocks);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      marketDataSimulator.stop();
      setIsSimulatorRunning(false);
    };
  }, []);

  const getStock = (symbol: string) => {
    return marketDataSimulator.getStock(symbol);
  };

  const getTopGainers = (limit: number = 10) => {
    return marketDataSimulator.getTopGainers(limit);
  };

  const getTopLosers = (limit: number = 10) => {
    return marketDataSimulator.getTopLosers(limit);
  };

  const getVolumeLeaders = (limit: number = 10) => {
    return marketDataSimulator.getVolumeLeaders(limit);
  };

  const searchSymbols = (query: string) => {
    return marketDataSimulator.searchSymbols(query);
  };

  const value = {
    stocks,
    getStock,
    getTopGainers,
    getTopLosers,
    getVolumeLeaders,
    searchSymbols,
    isSimulatorRunning,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}
