'use client';

import { useState, useEffect } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketOverviewProps {
  config: WidgetConfig;
}

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function MarketOverview({ config }: MarketOverviewProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const [isLoading, setIsLoading] = useState(false);
  const [indices, setIndices] = useState<IndexData[]>([
    { symbol: 'SPY', name: 'S&P 500', price: 455.23, change: 3.45, changePercent: 0.76 },
    { symbol: 'QQQ', name: 'NASDAQ', price: 378.91, change: 5.23, changePercent: 1.40 },
    { symbol: 'DIA', name: 'Dow Jones', price: 365.42, change: 1.89, changePercent: 0.52 },
    { symbol: 'IWM', name: 'Russell 2000', price: 185.67, change: -0.45, changePercent: -0.24 },
    { symbol: 'VIX', name: 'Volatility', price: 14.23, change: -0.87, changePercent: -5.76 },
  ]);

  useEffect(() => {
    // Simulate real-time index updates
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((index) => {
          const randomChange = (Math.random() - 0.5) * 0.5;
          const newPrice = index.price + randomChange;
          const newChange = index.change + randomChange;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;

          return {
            ...index,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <BaseWidget
      title={config.name}
      onRefresh={handleRefresh}
      onRemove={handleRemove}
      onRename={handleRename}
      isLoading={isLoading}
      footer="Major Indices"
    >
      <div className="space-y-1">
        {indices.map((index) => (
          <div
            key={index.symbol}
            className="flex items-center justify-between p-2 hover:bg-accent rounded transition-colors"
          >
            <div className="flex-1">
              <div className="font-semibold text-sm">{index.symbol}</div>
              <div className="text-[10px] text-muted-foreground">{index.name}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold">${formatNumber(index.price)}</div>
                <div
                  className={`text-[10px] flex items-center gap-0.5 ${
                    index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {index.changePercent >= 0 ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5" />
                  )}
                  {index.changePercent >= 0 ? '+' : ''}
                  {formatNumber(index.changePercent)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseWidget>
  );
}
