import { Layout } from 'react-grid-layout';
import { ScanFilter } from './index';

/**
 * Window Types - Different window types available
 */
export type WindowType =
  | 'scanner'         // Stock scanner with filters
  | 'alerts'          // Alert notifications
  | 'news'            // News feed
  | 'chart'           // Stock chart
  | 'single-stock'    // Single stock details
  | 'watchlist'       // Watchlist
  | 'stock-quote'     // Stock quote with news and metrics
  | 'halts'           // Trading halts
  | 'volume-leaders'  // Volume leaders scanner
  | 'five-pillars';   // Ross's 5 Pillars scanner

/**
 * Column Configuration for tables
 */
export interface ColumnConfig {
  id: string;
  label: string;
  key: keyof any; // Will be typed to Stock properties
  width?: number;
  visible: boolean;
  sortable?: boolean;
  format?: 'currency' | 'percent' | 'number' | 'volume' | 'string';
  colorCode?: boolean; // Apply color coding based on value
}

/**
 * Scanner Configuration
 */
export interface ScannerConfig {
  name: string;
  filters: ScanFilter;
  columns: ColumnConfig[];
  dataType: 'gainers' | 'losers' | 'actives' | 'custom';
  refreshInterval?: number;
  maxRows?: number;
  colorCoded?: boolean;
}

/**
 * News Configuration
 */
export interface NewsConfig {
  symbol?: string; // If undefined, shows general market news
  maxItems?: number;
}

/**
 * Chart Configuration
 */
export interface ChartConfig {
  symbol?: string;
  interval?: '1min' | '5min' | '15min' | '1hour' | '1day';
  indicators?: string[];
}

/**
 * Stock Quote Configuration
 */
export interface StockQuoteConfig {
  symbol?: string; // Default symbol to display
}

/**
 * Window Configuration - Specific to each window type
 */
export type WindowConfig =
  | { type: 'scanner'; config: ScannerConfig }
  | { type: 'alerts'; config: {} }
  | { type: 'news'; config: NewsConfig }
  | { type: 'chart'; config: ChartConfig }
  | { type: 'single-stock'; config: { symbol: string } }
  | { type: 'watchlist'; config: { symbols: string[] } }
  | { type: 'stock-quote'; config: StockQuoteConfig }
  | { type: 'halts'; config: {} }
  | { type: 'volume-leaders'; config: {} }
  | { type: 'five-pillars'; config: {} };

/**
 * Window Instance - Represents a single window in the workspace
 */
export interface WindowInstance {
  id: string;
  title: string;
  type: WindowType;
  config: WindowConfig;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
  minimized?: boolean;
  maximized?: boolean;
  zIndex?: number;      // For layering and click-to-front
  focused?: boolean;    // For focus management
}

/**
 * Workspace - Collection of windows with saved layout
 */
export interface Workspace {
  id: string;
  name: string;
  windows: WindowInstance[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default Columns for Scanner
 */
export const DEFAULT_SCANNER_COLUMNS: ColumnConfig[] = [
  { id: 'symbol', label: 'Symbol', key: 'symbol', width: 80, visible: true, sortable: true },
  { id: 'price', label: 'Price ($)', key: 'price', width: 80, visible: true, sortable: true, format: 'currency' },
  { id: 'change', label: 'Change ($)', key: 'change', width: 80, visible: true, sortable: true, format: 'currency', colorCode: true },
  { id: 'changePercent', label: 'Chg %', key: 'changePercent', width: 80, visible: true, sortable: true, format: 'percent', colorCode: true },
  { id: 'volume', label: 'Volume', key: 'volume', width: 100, visible: true, sortable: true, format: 'volume' },
  { id: 'marketCap', label: 'Market Cap', key: 'marketCap', width: 100, visible: false, sortable: true, format: 'volume' },
];

/**
 * Available Columns - All possible columns
 */
export const AVAILABLE_COLUMNS: ColumnConfig[] = [
  ...DEFAULT_SCANNER_COLUMNS,
  { id: 'name', label: 'Name', key: 'name', width: 150, visible: false, sortable: true },
  { id: 'avgVolume', label: 'Avg Volume', key: 'avgVolume', width: 100, visible: false, sortable: true, format: 'volume' },
];
