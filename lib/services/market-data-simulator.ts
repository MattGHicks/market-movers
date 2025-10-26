/**
 * Market Data Simulator
 * Generates realistic stock market data with real-time updates
 */

import { StockQuote } from '@/types/stock.types';

// Comprehensive list of popular stocks
const STOCK_SYMBOLS = [
  // Tech Giants
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175, volatility: 0.02 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 380, volatility: 0.015 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140, volatility: 0.018 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 145, volatility: 0.022 },
  { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 350, volatility: 0.025 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 495, volatility: 0.03 },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 242, volatility: 0.04 },

  // Finance
  { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 155, volatility: 0.012 },
  { symbol: 'BAC', name: 'Bank of America', basePrice: 35, volatility: 0.015 },
  { symbol: 'WFC', name: 'Wells Fargo', basePrice: 48, volatility: 0.013 },
  { symbol: 'GS', name: 'Goldman Sachs', basePrice: 385, volatility: 0.018 },

  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 158, volatility: 0.008 },
  { symbol: 'UNH', name: 'UnitedHealth Group', basePrice: 520, volatility: 0.01 },
  { symbol: 'PFE', name: 'Pfizer Inc.', basePrice: 28, volatility: 0.02 },

  // Consumer
  { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 65, volatility: 0.009 },
  { symbol: 'HD', name: 'Home Depot', basePrice: 340, volatility: 0.012 },
  { symbol: 'MCD', name: 'McDonald\'s Corp', basePrice: 295, volatility: 0.01 },
  { symbol: 'NKE', name: 'NIKE Inc.', basePrice: 105, volatility: 0.018 },

  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil', basePrice: 110, volatility: 0.015 },
  { symbol: 'CVX', name: 'Chevron Corporation', basePrice: 155, volatility: 0.014 },

  // Entertainment/Media
  { symbol: 'DIS', name: 'Walt Disney Company', basePrice: 92, volatility: 0.02 },
  { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 450, volatility: 0.025 },

  // Semiconductors
  { symbol: 'AMD', name: 'Advanced Micro Devices', basePrice: 125, volatility: 0.028 },
  { symbol: 'INTC', name: 'Intel Corporation', basePrice: 45, volatility: 0.02 },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', basePrice: 165, volatility: 0.022 },

  // Volatile/Meme Stocks
  { symbol: 'GME', name: 'GameStop Corp.', basePrice: 18, volatility: 0.08 },
  { symbol: 'AMC', name: 'AMC Entertainment', basePrice: 5, volatility: 0.07 },
  { symbol: 'BB', name: 'BlackBerry Limited', basePrice: 3.5, volatility: 0.06 },

  // SPACs/Penny Stocks
  { symbol: 'SOFI', name: 'SoFi Technologies', basePrice: 8, volatility: 0.05 },
  { symbol: 'PLTR', name: 'Palantir Technologies', basePrice: 18, volatility: 0.04 },
  { symbol: 'RIVN', name: 'Rivian Automotive', basePrice: 12, volatility: 0.055 },
];

class MarketDataSimulator {
  private stocks: Map<string, StockQuote> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: Set<(stocks: StockQuote[]) => void> = new Set();

  constructor() {
    this.initializeStocks();
  }

  private initializeStocks() {
    STOCK_SYMBOLS.forEach((config) => {
      const price = this.randomizePrice(config.basePrice, config.volatility * 0.5);
      const previousClose = price * (1 - Math.random() * 0.02 + 0.01); // ±1%
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;

      const stock: StockQuote = {
        symbol: config.symbol,
        price,
        change,
        changePercent,
        volume: this.generateVolume(),
        high: price * (1 + Math.random() * 0.015),
        low: price * (1 - Math.random() * 0.015),
        open: previousClose * (1 + (Math.random() - 0.5) * 0.01),
        previousClose,
        timestamp: Date.now(),
        marketCap: this.generateMarketCap(price),
      };

      this.stocks.set(config.symbol, stock);
    });
  }

  private randomizePrice(basePrice: number, volatility: number): number {
    // Brownian motion simulation
    const random = (Math.random() - 0.5) * 2; // -1 to 1
    const change = basePrice * volatility * random;
    return Math.max(basePrice + change, 0.01);
  }

  private generateVolume(): number {
    // Random volume between 1M and 100M
    return Math.floor(Math.random() * 99000000) + 1000000;
  }

  private generateMarketCap(price: number): number {
    // Rough market cap estimation
    const sharesOutstanding = Math.floor(Math.random() * 10000000000) + 1000000000;
    return price * sharesOutstanding;
  }

  private updateStocks() {
    const config = STOCK_SYMBOLS.find(s => s.symbol === 'AAPL')!; // temp

    this.stocks.forEach((stock, symbol) => {
      const stockConfig = STOCK_SYMBOLS.find(s => s.symbol === symbol)!;

      // Update price with realistic movement
      const previousPrice = stock.price;
      const newPrice = this.randomizePrice(previousPrice, stockConfig.volatility);

      // Update metrics
      const change = newPrice - stock.previousClose;
      const changePercent = (change / stock.previousClose) * 100;

      // Update high/low
      const high = Math.max(stock.high, newPrice);
      const low = Math.min(stock.low, newPrice);

      // Add volume
      const volumeIncrease = Math.floor(Math.random() * 100000) + 10000;
      const volume = stock.volume + volumeIncrease;

      const updatedStock: StockQuote = {
        ...stock,
        price: newPrice,
        change,
        changePercent,
        high,
        low,
        volume,
        timestamp: Date.now(),
        marketCap: this.generateMarketCap(newPrice),
      };

      this.stocks.set(symbol, updatedStock);
    });

    // Notify subscribers
    this.notifySubscribers();
  }

  private notifySubscribers() {
    const stockArray = Array.from(this.stocks.values());
    this.subscribers.forEach(callback => callback(stockArray));
  }

  // Public API
  public start(intervalMs: number = 2000) {
    if (this.updateInterval) {
      this.stop();
    }

    this.updateInterval = setInterval(() => {
      this.updateStocks();
    }, intervalMs);

    // Initial notification
    this.notifySubscribers();
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public subscribe(callback: (stocks: StockQuote[]) => void) {
    this.subscribers.add(callback);
    // Immediately call with current data
    callback(Array.from(this.stocks.values()));

    return () => {
      this.subscribers.delete(callback);
    };
  }

  public getStock(symbol: string): StockQuote | undefined {
    return this.stocks.get(symbol);
  }

  public getAllStocks(): StockQuote[] {
    return Array.from(this.stocks.values());
  }

  public getTopGainers(limit: number = 10): StockQuote[] {
    return Array.from(this.stocks.values())
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit);
  }

  public getTopLosers(limit: number = 10): StockQuote[] {
    return Array.from(this.stocks.values())
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit);
  }

  public getVolumeLeaders(limit: number = 10): StockQuote[] {
    return Array.from(this.stocks.values())
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);
  }

  public searchSymbols(query: string): StockQuote[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.stocks.values())
      .filter(stock =>
        stock.symbol.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 10);
  }
}

// Singleton instance
export const marketDataSimulator = new MarketDataSimulator();
