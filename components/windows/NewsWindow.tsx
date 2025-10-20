'use client';

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
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', config?.symbol],
    queryFn: () => fetchNews(config?.symbol),
    refetchInterval: 60000, // Refetch every minute
  });

  const displayNews = config?.maxItems
    ? news?.slice(0, config.maxItems)
    : news?.slice(0, 10);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs text-slate-400">
          {config?.symbol ? `News for ${config.symbol}` : 'Market News'}
        </span>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="p-4 text-center text-slate-400">Loading news...</div>
        )}

        {error && (
          <div className="p-4 text-center text-red-400">
            Failed to load news
          </div>
        )}

        {displayNews && displayNews.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {displayNews.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 hover:bg-slate-800/50 transition-colors"
              >
                <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                  {item.text}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{item.source}</span>
                  <span>{new Date(item.publishedDate).toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="p-4 text-center text-slate-400">No news available</div>
          )
        )}
      </div>
    </div>
  );
}
