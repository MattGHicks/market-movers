/**
 * FinancialModelingPrep API Client
 * Documentation: https://site.financialmodelingprep.com/developer/docs
 */

import { MarketMover, Stock } from '@/types';

const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  FMP API key not found. Please set NEXT_PUBLIC_FMP_API_KEY in .env.local');
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchFMP<T>(endpoint: string): Promise<T> {
  const url = `${FMP_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`FMP API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('FMP API fetch error:', error);
    throw error;
  }
}

/**
 * Get top stock gainers
 */
export async function getTopGainers(): Promise<MarketMover[]> {
  const data = await fetchFMP<any[]>('/stock_market/gainers');
  return data.map(item => ({
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    change: item.change,
    changePercent: item.changesPercentage,
    volume: item.volume || 0,
    marketCap: item.marketCap,
  }));
}

/**
 * Get top stock losers
 */
export async function getTopLosers(): Promise<MarketMover[]> {
  const data = await fetchFMP<any[]>('/stock_market/losers');
  return data.map(item => ({
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    change: item.change,
    changePercent: item.changesPercentage,
    volume: item.volume || 0,
    marketCap: item.marketCap,
  }));
}

/**
 * Get most active stocks
 */
export async function getMostActive(): Promise<MarketMover[]> {
  const data = await fetchFMP<any[]>('/stock_market/actives');
  return data.map(item => ({
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    change: item.change,
    changePercent: item.changesPercentage,
    volume: item.volume || 0,
    marketCap: item.marketCap,
  }));
}

/**
 * Get real-time quote for a symbol
 */
export async function getQuote(symbol: string): Promise<Stock> {
  const data = await fetchFMP<any[]>(`/quote/${symbol}`);
  const quote = data[0];

  return {
    symbol: quote.symbol,
    name: quote.name,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changesPercentage,
    volume: quote.volume,
  };
}

/**
 * Get multiple quotes
 */
export async function getQuotes(symbols: string[]): Promise<Stock[]> {
  const symbolList = symbols.join(',');
  const data = await fetchFMP<any[]>(`/quote/${symbolList}`);

  return data.map(quote => ({
    symbol: quote.symbol,
    name: quote.name,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changesPercentage,
    volume: quote.volume,
  }));
}

/**
 * Search for stocks
 */
export async function searchStocks(query: string): Promise<Stock[]> {
  const data = await fetchFMP<any[]>(`/search?query=${query}&limit=10`);

  return data.map(item => ({
    symbol: item.symbol,
    name: item.name,
    price: 0, // Search doesn't return price
    change: 0,
    changePercent: 0,
    volume: 0,
  }));
}

/**
 * Get sector performance
 */
export async function getSectorPerformance(): Promise<any[]> {
  return fetchFMP<any[]>('/sector-performance');
}

/**
 * Get market hours status
 */
export async function getMarketHours(): Promise<{ isOpen: boolean }> {
  const data = await fetchFMP<any>('/is-the-market-open');
  return { isOpen: data.isTheStockMarketOpen };
}
