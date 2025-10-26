'use client';

import { useState } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsWidgetProps {
  config: WidgetConfig;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Tech stocks rally as AI sector continues strong growth momentum',
    source: 'MarketWatch',
    time: '5m ago',
    url: '#',
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Federal Reserve signals potential rate cut in upcoming meeting',
    source: 'Bloomberg',
    time: '15m ago',
    url: '#',
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'Energy sector faces headwinds amid oil price volatility',
    source: 'Reuters',
    time: '32m ago',
    url: '#',
    sentiment: 'negative',
  },
  {
    id: '4',
    title: 'Retail sales data exceeds expectations for third consecutive month',
    source: 'CNBC',
    time: '1h ago',
    url: '#',
    sentiment: 'positive',
  },
  {
    id: '5',
    title: 'Major semiconductor manufacturer announces expansion plans',
    source: 'Financial Times',
    time: '2h ago',
    url: '#',
    sentiment: 'positive',
  },
  {
    id: '6',
    title: 'Banking sector shows mixed results in quarterly earnings',
    source: 'WSJ',
    time: '3h ago',
    url: '#',
    sentiment: 'neutral',
  },
  {
    id: '7',
    title: 'Electric vehicle stocks decline on supply chain concerns',
    source: 'MarketWatch',
    time: '4h ago',
    url: '#',
    sentiment: 'negative',
  },
  {
    id: '8',
    title: 'Consumer confidence index reaches new high',
    source: 'Bloomberg',
    time: '5h ago',
    url: '#',
    sentiment: 'positive',
  },
];

export function NewsWidget({ config }: NewsWidgetProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const [isLoading, setIsLoading] = useState(false);
  const [news] = useState<NewsItem[]>(mockNews);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleRemove = () => {
    removeWidget(config.id);
  };

  const handleRename = (newName: string) => {
    updateWidget(config.id, { name: newName });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-500';
      case 'negative':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <BaseWidget
      title={config.name}
      onRefresh={handleRefresh}
      onRemove={handleRemove}
      onRename={handleRename}
      isLoading={isLoading}
      footer={`${news.length} articles`}
    >
      <div className="space-y-1">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 hover:bg-accent rounded transition-colors group cursor-pointer"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{item.source}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {item.time}
                  </div>
                  <div
                    className={`text-[9px] px-1.5 py-0.5 rounded ${getSentimentColor(
                      item.sentiment
                    )}`}
                  >
                    {item.sentiment}
                  </div>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </BaseWidget>
  );
}
