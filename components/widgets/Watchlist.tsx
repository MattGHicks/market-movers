'use client';

import { useState } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { ArrowUp, ArrowDown, Plus, X } from 'lucide-react';
import { useMarketData } from '@/contexts/MarketDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WatchlistConfig extends WidgetConfig {
  settings: {
    symbols: string[];
  };
}

interface WatchlistProps {
  config: WatchlistConfig;
}

export function Watchlist({ config }: WatchlistProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const { stocks, getStock } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const watchedStocks = config.settings.symbols
    .map((symbol) => getStock(symbol))
    .filter((stock) => stock !== undefined);

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

  const handleAddSymbol = () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (!symbol) return;

    // Check if stock exists
    const stock = getStock(symbol);
    if (!stock) {
      alert(`Symbol "${symbol}" not found`);
      return;
    }

    // Check if already in watchlist
    if (config.settings.symbols.includes(symbol)) {
      alert(`Symbol "${symbol}" is already in the watchlist`);
      return;
    }

    // Add to watchlist
    updateWidget(config.id, {
      settings: {
        ...config.settings,
        symbols: [...config.settings.symbols, symbol],
      },
    });

    setNewSymbol('');
    setIsAdding(false);
  };

  const handleRemoveSymbol = (symbol: string) => {
    updateWidget(config.id, {
      settings: {
        ...config.settings,
        symbols: config.settings.symbols.filter((s) => s !== symbol),
      },
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatVolume = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <BaseWidget
      title={config.name}
      onRefresh={handleRefresh}
      onRemove={handleRemove}
      onRename={handleRename}
      isLoading={isLoading}
      footer={`${watchedStocks.length} symbols`}
    >
      <div className="space-y-1">
        {/* Add Symbol Section */}
        {isAdding ? (
          <div className="flex gap-1 pb-1 border-b">
            <Input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSymbol();
                else if (e.key === 'Escape') setIsAdding(false);
              }}
              placeholder="Enter symbol..."
              className="h-7 text-xs"
              autoFocus
            />
            <Button onClick={handleAddSymbol} size="sm" className="h-7 px-2">
              Add
            </Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="ghost" className="h-7 px-2">
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs mb-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Symbol
          </Button>
        )}

        {/* Header */}
        <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-muted-foreground border-b pb-1">
          <div className="col-span-3">Symbol</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-3 text-right">Change %</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-1"></div>
        </div>

        {/* Stocks List */}
        {watchedStocks.length === 0 ? (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No symbols in watchlist. Click "Add Symbol" to get started.
          </div>
        ) : (
          watchedStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="grid grid-cols-12 gap-1 text-xs py-1 hover:bg-accent rounded px-1 transition-colors group"
            >
              <div className="col-span-3 font-semibold flex items-center">
                {stock.symbol}
              </div>
              <div className="col-span-3 text-right">${formatNumber(stock.price)}</div>
              <div
                className={`col-span-3 text-right flex items-center justify-end gap-0.5 ${
                  stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stock.changePercent >= 0 ? (
                  <ArrowUp className="h-2 w-2" />
                ) : (
                  <ArrowDown className="h-2 w-2" />
                )}
                <span className="text-[10px]">
                  {stock.changePercent >= 0 ? '+' : ''}
                  {formatNumber(stock.changePercent)}%
                </span>
              </div>
              <div className="col-span-2 text-right text-muted-foreground text-[10px]">
                {formatVolume(stock.volume)}
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <Button
                  onClick={() => handleRemoveSymbol(stock.symbol)}
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </BaseWidget>
  );
}
