'use client';

import { useState, useEffect } from 'react';
import { useSymbolSelection } from '@/context/SymbolSelectionContext';

interface StockQuoteConfig {
  symbol?: string;
}

interface StockQuoteWindowProps {
  config?: StockQuoteConfig;
}

export function StockQuoteWindow({ config }: StockQuoteWindowProps) {
  const [symbol, setSymbol] = useState(config?.symbol || 'AAPL');
  const [quoteData, setQuoteData] = useState<any>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to global symbol selection
  const { selectedSymbol } = useSymbolSelection();

  // Update symbol when a ticker is clicked anywhere in the app
  useEffect(() => {
    if (selectedSymbol) {
      setSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  // Fetch stock quote data
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;

      setLoading(true);
      try {
        // Fetch quote data
        const quoteRes = await fetch(`/api/stock-quote/${symbol}`);
        const quote = await quoteRes.json();
        setQuoteData(quote);

        // Fetch news data
        const newsRes = await fetch(`/api/news/${symbol}`);
        const news = await newsRes.json();
        setNewsData(news.slice(0, 5)); // Top 5 news items
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading {symbol}...</div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>No data available</div>
      </div>
    );
  }

  const priceChange = quoteData.change || 0;
  const priceChangePercent = quoteData.changesPercentage || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header: Symbol and Price */}
      <div
        className="px-4 py-3"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        {/* Symbol Search */}
        <div className="mb-3">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Stock Symbol"
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Symbol, Name, Exchange */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {quoteData.symbol}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {quoteData.name} | {quoteData.exchange}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last updated: {new Date(quoteData.timestamp * 1000).toLocaleString()}
            </p>
          </div>

          {/* Price and Change */}
          <div className="text-right">
            <div
              className="text-3xl font-bold"
              style={{ color: isPositive ? 'var(--green-base)' : 'var(--red-base)' }}
            >
              {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {isPositive ? '+' : ''}${priceChange.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* News Section */}
        <div
          className="px-4 py-3"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent News
            </h3>
            <button
              className="text-xs px-2 py-1 rounded"
              style={{
                background: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              More →
            </button>
          </div>

          {newsData && newsData.length > 0 ? (
            <div className="space-y-2">
              {newsData.map((item, index) => {
                const publishedDate = new Date(item.publishedDate);
                const now = new Date();
                const hoursDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
                const isRecent = hoursDiff < 1;
                const isDayOld = hoursDiff >= 1 && hoursDiff < 24;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs py-1"
                    style={{ borderBottom: '1px solid var(--border-secondary)' }}
                  >
                    {isRecent && <span style={{ filter: 'hue-rotate(0deg)' }}>🔥</span>}
                    {!isRecent && isDayOld && <span style={{ filter: 'hue-rotate(200deg)' }}>🔥</span>}
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {publishedDate.toLocaleTimeString()}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.title}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No recent news
            </div>
          )}
        </div>

        {/* Stock Metrics Grid */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* First Column */}
            <div className="space-y-2">
              <MetricRow label="Float" value={formatNumber(quoteData.sharesOutstanding)} />
              <MetricRow label="Relative Volume(5 min 3)" value="5,151,166.67" />
              <MetricRow label="Open Price" value={formatCurrency(quoteData.open)} />
              <MetricRow label="Low Price" value={formatCurrency(quoteData.dayLow)} />
              <MetricRow label="High in 52 Weeks" value={formatCurrency(quoteData.yearHigh)} />
              <MetricRow label="ATR (Rate)" value={quoteData.avgVolume ? (quoteData.avgVolume / 1000000).toFixed(2) : 'N/A'} />
              <MetricRow label="Earnings Date" value={quoteData.earningsAnnouncement || 'N/A'} />
            </div>

            {/* Second Column */}
            <div className="space-y-2">
              <MetricRow label="Volume" value={formatVolume(quoteData.volume)} />
              <MetricRow label="Gap(%)" value={calculateGap(quoteData.open, quoteData.previousClose)} />
              <MetricRow label="Previous Close" value={formatCurrency(quoteData.previousClose)} />
              <MetricRow label="High Price" value={formatCurrency(quoteData.dayHigh)} />
              <MetricRow label="Low in 52 Weeks" value={formatCurrency(quoteData.yearLow)} />
              <MetricRow label="Short Interest" value={(quoteData.sharesOutstanding * 0.05 / 1000000).toFixed(2) + 'M'} />
              <MetricRow label="Market Cap" value={formatMarketCap(quoteData.marketCap)} />
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <MetricRow label="Relative Volume/5 Ratio" value="8595.00" />
            <MetricRow label="Volume in 5 Minutes" value="85955.00" />
            <MetricRow label="Change From Close(%)" value={priceChangePercent.toFixed(2) + '%'} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for metric rows
function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)' }} className="font-mono">
        {value}
      </span>
    </div>
  );
}

// Formatting helpers
function formatCurrency(value: number | undefined): string {
  if (!value) return '-';
  return '$' + value.toFixed(2);
}

function formatVolume(value: number | undefined): string {
  if (!value) return '-';
  if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(2) + 'K';
  return value.toString();
}

function formatNumber(value: number | undefined): string {
  if (!value) return '-';
  return value.toLocaleString();
}

function formatMarketCap(value: number | undefined): string {
  if (!value) return '-';
  if (value >= 1000000000) return (value / 1000000000).toFixed(2) + 'B';
  if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
  return formatNumber(value);
}

function calculateGap(open: number | undefined, prevClose: number | undefined): string {
  if (!open || !prevClose) return '-';
  const gap = ((open - prevClose) / prevClose) * 100;
  return gap.toFixed(2) + '%';
}
