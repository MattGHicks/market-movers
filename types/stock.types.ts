/**
 * Stock data types for Market Movers
 */

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
  marketCap?: number;
}

export interface StockTrade {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  conditions?: number[];
}

export interface WebSocketMessage {
  type: 'stock_updates' | 'subscribe' | 'unsubscribe' | 'error' | 'connected';
  data?: any;
  symbols?: string[];
  error?: string;
  timestamp?: number;
}

export interface ScannerCriteria {
  symbols?: string[];
  priceMin?: number;
  priceMax?: number;
  volumeMin?: number;
  volumeMax?: number;
  changePercentMin?: number;
  changePercentMax?: number;
  marketCapMin?: number;
  marketCapMax?: number;
}

export type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';
export type SortOrder = 'asc' | 'desc';
