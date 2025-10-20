// Stock data types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

// Market mover types
export interface MarketMover extends Stock {
  marketCap?: number;
  avgVolume?: number;
}

// API Response types
export interface TopGainersResponse {
  gainers: MarketMover[];
  timestamp: string;
}

export interface TopLosersResponse {
  losers: MarketMover[];
  timestamp: string;
}

export interface MostActiveResponse {
  active: MarketMover[];
  timestamp: string;
}

// Filter and settings types
export interface ScanFilter {
  minVolume?: number;
  minPrice?: number;
  maxPrice?: number;
  minChangePercent?: number;
  sectors?: string[];
}

export interface ScanSettings {
  refreshInterval: number; // in seconds
  filters: ScanFilter;
  alertThreshold: number; // percentage change to trigger alert
}
