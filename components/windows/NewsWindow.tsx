'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NewsConfig } from '@/types/windows';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedDate: string;
  text: string;
}

interface NewsWindowProps {
  config?: NewsConfig;
}

async function fetchNews(symbol?: string): Promise<NewsItem[]> {
  const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
  const url = symbol
    ? `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=20&apikey=${apiKey}`
    : `https://financialmodelingprep.com/api/v3/stock_news?limit=20&apikey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}

export function NewsWindow({ config }: NewsWindowProps) {
  const [searchTicker, setSearchTicker] = useState(config?.symbol || '');
  const [activeSymbol, setActiveSymbol] = useState(config?.symbol || '');

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', activeSymbol || 'all'],
    queryFn: () => fetchNews(activeSymbol || undefined),
    refetchInterval: 60000, // Refetch every minute
  });

  const handleSearch = () => {
    setActiveSymbol(searchTicker.toUpperCase().trim());
  };

  const handleClear = () => {
    setSearchTicker('');
    setActiveSymbol('');
  };

  const displayNews = config?.maxItems
    ? news?.slice(0, config.maxItems)
    : news?.slice(0, 10);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header with Search */}
      <div
        className="px-3 py-2"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search ticker..."
            className="flex-1 px-2 py-1 text-xs rounded"
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          />
          <button
            onClick={handleSearch}
            className="px-2 py-1 text-xs rounded transition-colors"
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-active)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Search
          </button>
          {activeSymbol && (
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs rounded transition-colors"
              style={{
                background: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-active)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Clear
            </button>
          )}
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {activeSymbol ? `News for ${activeSymbol}` : 'Market News'}
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
            Loading news...
          </div>
        )}

        {error && (
          <div className="p-4 text-center" style={{ color: 'var(--red-base)' }}>
            Failed to load news
          </div>
        )}

        {displayNews && displayNews.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border-secondary)' }}>
            {displayNews.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 transition-colors"
                style={{
                  borderBottom: '1px solid var(--border-secondary)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <h4
                  className="text-sm font-medium mb-1 line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-xs mb-2 line-clamp-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.text}
                </p>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{item.source}</span>
                  <span>{new Date(item.publishedDate).toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
              No news available
            </div>
          )
        )}
      </div>
    </div>
  );
}
