import { StockQuote } from '@/types/stock.types';

// Popular stock symbols for testing
const MOCK_SYMBOLS = [
  'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD',
  'NFLX', 'DIS', 'BA', 'JPM', 'V', 'WMT', 'PFE', 'INTC',
  'CSCO', 'VZ', 'KO', 'PEP', 'NKE', 'MCD', 'IBM', 'GE',
  'F', 'GM', 'UBER', 'LYFT', 'SQ', 'PYPL', 'SNAP', 'TWTR',
];

// Base prices for stocks (in USD)
const BASE_PRICES: Record<string, number> = {
  'AAPL': 175.50,
  'TSLA': 245.30,
  'MSFT': 385.20,
  'GOOGL': 140.75,
  'AMZN': 155.90,
  'META': 485.60,
  'NVDA': 875.40,
  'AMD': 165.25,
  'NFLX': 485.30,
  'DIS': 95.80,
  'BA': 215.45,
  'JPM': 195.30,
  'V': 275.60,
  'WMT': 165.25,
  'PFE': 32.50,
  'INTC': 45.75,
  'CSCO': 52.80,
  'VZ': 38.90,
  'KO': 61.25,
  'PEP': 175.40,
  'NKE': 115.60,
  'MCD': 295.75,
  'IBM': 175.30,
  'GE': 125.45,
  'F': 12.35,
  'GM': 38.60,
  'UBER': 65.75,
  'LYFT': 15.40,
  'SQ': 75.90,
  'PYPL': 65.30,
  'SNAP': 12.45,
  'TWTR': 42.80,
};

/**
 * Generate a random stock quote with realistic values
 */
export function generateMockQuote(symbol: string): StockQuote {
  const basePrice = BASE_PRICES[symbol] || 100;
  const volatility = 0.02; // 2% volatility

  // Generate random price change
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  const price = basePrice + change;
  const previousClose = basePrice;

  const changePercent = (change / previousClose) * 100;

  // Generate realistic OHLC
  const high = price + Math.random() * volatility * basePrice;
  const low = price - Math.random() * volatility * basePrice;
  const open = previousClose + (Math.random() - 0.5) * volatility * basePrice;

  // Generate volume (higher for more popular stocks)
  const baseVolume = basePrice > 200 ? 50000000 : 10000000;
  const volume = Math.floor(baseVolume + Math.random() * baseVolume * 0.5);

  // Market cap estimation (very rough)
  const marketCap = Math.floor(price * 1000000000 * (Math.random() * 2 + 0.5));

  return {
    symbol,
    price: Math.round(price * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume,
    high: Math.round(high * 100) / 100,
    low: Math.round(low * 100) / 100,
    open: Math.round(open * 100) / 100,
    previousClose: Math.round(previousClose * 100) / 100,
    timestamp: Date.now(),
    marketCap,
  };
}

/**
 * Generate multiple stock quotes
 */
export function generateMockQuotes(symbols: string[] = MOCK_SYMBOLS): StockQuote[] {
  return symbols.map(generateMockQuote);
}

/**
 * Update a stock quote with a small random change (simulates real-time updates)
 */
export function updateMockQuote(quote: StockQuote): StockQuote {
  const volatility = 0.001; // 0.1% per update
  const priceChange = (Math.random() - 0.5) * 2 * volatility * quote.price;
  const newPrice = quote.price + priceChange;

  const change = newPrice - quote.previousClose;
  const changePercent = (change / quote.previousClose) * 100;

  // Update volume slightly
  const volumeChange = Math.floor((Math.random() - 0.5) * quote.volume * 0.01);

  return {
    ...quote,
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume: quote.volume + volumeChange,
    high: Math.max(quote.high, newPrice),
    low: Math.min(quote.low, newPrice),
    timestamp: Date.now(),
  };
}

/**
 * Get list of available mock symbols
 */
export function getMockSymbols(): string[] {
  return [...MOCK_SYMBOLS];
}

/**
 * Mock data generator that continuously produces updates
 */
export class MockDataGenerator {
  private quotes: Map<string, StockQuote> = new Map();
  private interval: NodeJS.Timeout | null = null;
  private callbacks: Set<(quotes: StockQuote[]) => void> = new Set();

  constructor(symbols: string[] = MOCK_SYMBOLS) {
    // Initialize with mock quotes
    symbols.forEach((symbol) => {
      this.quotes.set(symbol, generateMockQuote(symbol));
    });
  }

  /**
   * Start generating updates at specified interval
   */
  start(intervalMs: number = 1000) {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      // Update all quotes
      const updatedQuotes: StockQuote[] = [];
      this.quotes.forEach((quote, symbol) => {
        const updated = updateMockQuote(quote);
        this.quotes.set(symbol, updated);
        updatedQuotes.push(updated);
      });

      // Notify all callbacks
      this.callbacks.forEach((callback) => {
        callback(updatedQuotes);
      });
    }, intervalMs);
  }

  /**
   * Stop generating updates
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Subscribe to updates
   */
  subscribe(callback: (quotes: StockQuote[]) => void) {
    this.callbacks.add(callback);
    // Immediately send current quotes
    callback(Array.from(this.quotes.values()));

    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current quotes
   */
  getQuotes(): StockQuote[] {
    return Array.from(this.quotes.values());
  }

  /**
   * Get quote for specific symbol
   */
  getQuote(symbol: string): StockQuote | undefined {
    return this.quotes.get(symbol);
  }

  /**
   * Add symbols to track
   */
  addSymbols(symbols: string[]) {
    symbols.forEach((symbol) => {
      if (!this.quotes.has(symbol)) {
        this.quotes.set(symbol, generateMockQuote(symbol));
      }
    });
  }

  /**
   * Remove symbols from tracking
   */
  removeSymbols(symbols: string[]) {
    symbols.forEach((symbol) => {
      this.quotes.delete(symbol);
    });
  }
}
