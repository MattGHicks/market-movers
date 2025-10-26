'use client';

import { useState } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { TopListScannerConfig, TopListScannerSettings } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { StockQuote } from '@/types/stock.types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ScannerConfigModal } from './ScannerConfigModal';
import { useMarketData } from '@/contexts/MarketDataContext';

interface TopListScannerProps {
  config: TopListScannerConfig;
}

export function TopListScanner({ config }: TopListScannerProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const { stocks } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Filter and sort stocks based on configuration
  const filteredStocks = stocks
    .filter(stock => {
      const settings = config.settings;

      // Price filters
      if (settings.minPrice && stock.price < settings.minPrice) return false;
      if (settings.maxPrice && stock.price > settings.maxPrice) return false;

      // Volume filters
      if (settings.minVolume && stock.volume < settings.minVolume) return false;
      if (settings.maxVolume && stock.volume > settings.maxVolume) return false;

      // Change% filters
      if (settings.minChangePercent && stock.changePercent < settings.minChangePercent) return false;
      if (settings.maxChangePercent && stock.changePercent > settings.maxChangePercent) return false;

      return true;
    })
    .sort((a, b) => {
      const sortBy = config.settings.sortBy;
      const order = config.settings.sortOrder === 'asc' ? 1 : -1;

      switch (sortBy) {
        case 'price':
          return (a.price - b.price) * order;
        case 'changePercent':
          return (a.changePercent - b.changePercent) * order;
        case 'volume':
          return (a.volume - b.volume) * order;
        default:
          return 0;
      }
    })
    .slice(0, config.settings.maxItems || 50);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleConfigure = () => {
    setIsConfigOpen(true);
  };

  const handleRemove = () => {
    removeWidget(config.id);
  };

  const handleRename = (newName: string) => {
    updateWidget(config.id, {
      name: newName,
    });
  };

  const handleSaveConfig = (newSettings: TopListScannerSettings) => {
    updateWidget(config.id, {
      settings: newSettings,
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatVolume = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <>
      <ScannerConfigModal
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        settings={config.settings}
        onSave={handleSaveConfig}
      />

      <BaseWidget
        title={config.name}
        onRefresh={handleRefresh}
        onConfigure={handleConfigure}
        onRemove={handleRemove}
        onRename={handleRename}
        isLoading={isLoading}
        footer={`${filteredStocks.length} stocks`}
      >
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-muted-foreground border-b pb-1">
          <div className="col-span-2">Symbol</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Change</div>
          <div className="col-span-2 text-right">Change %</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-2 text-right">Market Cap</div>
        </div>

        {/* Stocks List */}
        {filteredStocks.map((stock) => (
          <div
            key={stock.symbol}
            className="grid grid-cols-12 gap-1 text-xs py-1 hover:bg-accent rounded px-1 transition-colors cursor-pointer"
          >
            <div className="col-span-2 font-semibold">{stock.symbol}</div>
            <div className="col-span-2 text-right">${formatNumber(stock.price)}</div>
            <div
              className={`col-span-2 text-right flex items-center justify-end gap-1 ${
                stock.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stock.change >= 0 ? (
                <ArrowUp className="h-2.5 w-2.5" />
              ) : (
                <ArrowDown className="h-2.5 w-2.5" />
              )}
              {formatNumber(Math.abs(stock.change))}
            </div>
            <div
              className={`col-span-2 text-right ${
                stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stock.changePercent >= 0 ? '+' : ''}
              {formatNumber(stock.changePercent)}%
            </div>
            <div className="col-span-2 text-right text-muted-foreground">
              {formatVolume(stock.volume)}
            </div>
            <div className="col-span-2 text-right text-muted-foreground text-[10px]">
              ${formatVolume(stock.marketCap || 0)}
            </div>
          </div>
        ))}
      </div>
    </BaseWidget>
    </>
  );
}
