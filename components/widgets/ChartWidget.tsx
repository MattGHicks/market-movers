'use client';

import { useState, useEffect } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { useMarketData } from '@/contexts/MarketDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ChartWidgetConfig extends WidgetConfig {
  settings: {
    symbol: string;
  };
}

interface ChartWidgetProps {
  config: ChartWidgetConfig;
}

interface PricePoint {
  time: string;
  price: number;
  high: number;
  low: number;
}

export function ChartWidget({ config }: ChartWidgetProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const { getStock } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [symbol, setSymbol] = useState(config.settings.symbol || 'AAPL');
  const [inputSymbol, setInputSymbol] = useState(symbol);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);

  const stock = getStock(symbol);

  useEffect(() => {
    // Generate historical price data
    if (stock) {
      const data: PricePoint[] = [];
      const now = Date.now();
      const basePrice = stock.price;

      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 5 * 60 * 1000);
        const variance = (Math.random() - 0.5) * basePrice * 0.02;
        const price = basePrice + variance;
        const high = price + Math.random() * basePrice * 0.01;
        const low = price - Math.random() * basePrice * 0.01;

        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price,
          high,
          low,
        });
      }

      setPriceData(data);
    }
  }, [stock, symbol]);

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

  const handleSymbolChange = () => {
    const newSymbol = inputSymbol.trim().toUpperCase();
    if (!newSymbol) return;

    const foundStock = getStock(newSymbol);
    if (!foundStock) {
      alert(`Symbol "${newSymbol}" not found`);
      return;
    }

    setSymbol(newSymbol);
    updateWidget(config.id, {
      settings: {
        ...config.settings,
        symbol: newSymbol,
      },
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (!stock) {
    return (
      <BaseWidget
        title={config.name}
        onRefresh={handleRefresh}
        onRemove={handleRemove}
        onRename={handleRename}
        isLoading={isLoading}
        footer="No data"
      >
        <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
          <p className="text-xs">Symbol not found</p>
        </div>
      </BaseWidget>
    );
  }

  const maxPrice = Math.max(...priceData.map((d) => d.high));
  const minPrice = Math.min(...priceData.map((d) => d.low));
  const priceRange = maxPrice - minPrice;

  return (
    <BaseWidget
      title={config.name}
      onRefresh={handleRefresh}
      onRemove={handleRemove}
      onRename={handleRename}
      isLoading={isLoading}
      footer={`${symbol} • $${formatNumber(stock.price)}`}
    >
      <div className="space-y-2">
        {/* Symbol Search */}
        <div className="flex gap-1">
          <Input
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSymbolChange();
            }}
            placeholder="Enter symbol..."
            className="h-7 text-xs"
          />
          <Button onClick={handleSymbolChange} size="sm" className="h-7 px-2">
            <Search className="h-3 w-3" />
          </Button>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between pb-2 border-b">
          <div>
            <div className="text-sm font-bold">{symbol}</div>
            <div className="text-[10px] text-muted-foreground">{stock.name}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">${formatNumber(stock.price)}</div>
            <div
              className={`text-[10px] ${
                stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stock.changePercent >= 0 ? '+' : ''}
              {formatNumber(stock.changePercent)}%
            </div>
          </div>
        </div>

        {/* Simple Line Chart */}
        <div className="relative h-32 bg-muted/20 rounded">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={`${percent}%`}
                x2="100%"
                y2={`${percent}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted-foreground/20"
              />
            ))}

            {/* Price line */}
            <polyline
              points={priceData
                .map((point, index) => {
                  const x = (index / (priceData.length - 1)) * 100;
                  const y = ((maxPrice - point.price) / priceRange) * 100;
                  return `${x}%,${y}%`;
                })
                .join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}
            />

            {/* Area fill */}
            <polygon
              points={`0%,100% ${priceData
                .map((point, index) => {
                  const x = (index / (priceData.length - 1)) * 100;
                  const y = ((maxPrice - point.price) / priceRange) * 100;
                  return `${x}%,${y}%`;
                })
                .join(' ')} 100%,100%`}
              fill="currentColor"
              className={`${
                stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              } opacity-10`}
            />
          </svg>
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div>
            <div className="text-muted-foreground">High</div>
            <div className="font-semibold">${formatNumber(maxPrice)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Low</div>
            <div className="font-semibold">${formatNumber(minPrice)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Volume</div>
            <div className="font-semibold">
              {stock.volume >= 1000000
                ? `${(stock.volume / 1000000).toFixed(1)}M`
                : `${(stock.volume / 1000).toFixed(1)}K`}
            </div>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}
