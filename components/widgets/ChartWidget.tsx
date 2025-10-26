'use client';

import { useState, useEffect, useRef } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { useMarketData } from '@/contexts/MarketDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartWidgetConfig extends WidgetConfig {
  settings: {
    symbol: string;
  };
}

interface ChartWidgetProps {
  config: ChartWidgetConfig;
}

export function ChartWidget({ config }: ChartWidgetProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const { getStock, subscribe, unsubscribe } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [symbol, setSymbol] = useState(config.settings.symbol || 'AAPL');
  const [inputSymbol, setInputSymbol] = useState(symbol);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [priceData, setPriceData] = useState<{ time: number; value: number }[]>([]);

  const stock = getStock(symbol);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#374151', style: 1, visible: true },
        horzLines: { color: '#374151', style: 1, visible: true },
      },
      width: chartContainerRef.current.clientWidth,
      height: 200,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#374151',
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#22c55e',
      topColor: 'rgba(34, 197, 94, 0.4)',
      bottomColor: 'rgba(34, 197, 94, 0.0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Generate price data
  useEffect(() => {
    if (!stock) return;

    const data: { time: number; value: number }[] = [];
    const now = Math.floor(Date.now() / 1000);
    const basePrice = stock.price;
    const interval = 5 * 60; // 5 minutes

    // Generate 50 data points
    for (let i = 50; i >= 0; i--) {
      const time = now - i * interval;
      const variance = (Math.random() - 0.5) * basePrice * 0.02;
      const price = basePrice + variance;

      data.push({
        time,
        value: price,
      });
    }

    setPriceData(data);
  }, [stock, symbol]);

  // Update chart when data changes
  useEffect(() => {
    if (seriesRef.current && priceData.length > 0 && stock) {
      seriesRef.current.setData(priceData);

      // Update color based on stock change
      const isPositive = stock.changePercent >= 0;
      seriesRef.current.applyOptions({
        lineColor: isPositive ? '#22c55e' : '#ef4444',
        topColor: isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        bottomColor: isPositive ? 'rgba(34, 197, 94, 0.0)' : 'rgba(239, 68, 68, 0.0)',
      });

      // Fit content to chart
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [priceData, stock]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!stock) return;

    const updateHandler = (updatedStock: any) => {
      if (updatedStock.symbol === symbol && priceData.length > 0) {
        // Update the last price point with new price
        const now = Math.floor(Date.now() / 1000);
        const newPoint = {
          time: now,
          value: updatedStock.price,
        };

        const newData = [...priceData.slice(1), newPoint];
        setPriceData(newData);
      }
    };

    subscribe(symbol, updateHandler);

    return () => {
      unsubscribe(symbol, updateHandler);
    };
  }, [symbol, priceData, stock, subscribe, unsubscribe]);

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

        {/* TradingView Chart */}
        <div ref={chartContainerRef} className="w-full rounded" />

        {/* Chart Stats */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div>
            <div className="text-muted-foreground">High</div>
            <div className="font-semibold">
              ${formatNumber(priceData.length > 0 ? Math.max(...priceData.map(p => p.value)) : stock.price)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Low</div>
            <div className="font-semibold">
              ${formatNumber(priceData.length > 0 ? Math.min(...priceData.map(p => p.value)) : stock.price)}
            </div>
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
