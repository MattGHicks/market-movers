'use client';

import { useState, useEffect } from 'react';
import { BaseWidget } from './base/BaseWidget';
import { WidgetConfig } from '@/types/widget.types';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { useMarketData } from '@/contexts/MarketDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AlertStrategy {
  id: string;
  symbol: string;
  condition: 'above' | 'below' | 'change_percent' | 'volume' | 'new_high' | 'new_low';
  value: number;
  name: string;
}

interface TriggeredAlert {
  id: string;
  strategyId: string;
  strategyName: string;
  symbol: string;
  message: string;
  timestamp: Date;
}

interface AlertWidgetConfig extends WidgetConfig {
  settings: {
    strategies: AlertStrategy[];
  };
}

interface AlertWidgetProps {
  config: AlertWidgetConfig;
}

export function AlertWidget({ config }: AlertWidgetProps) {
  const { removeWidget, updateWidget } = useWidgetStore();
  const { getStock, subscribe, unsubscribe, getAllStocks } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [strategies, setStrategies] = useState<AlertStrategy[]>(config.settings.strategies || []);
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);

  // New strategy form state
  const [newSymbol, setNewSymbol] = useState('');
  const [newCondition, setNewCondition] = useState<AlertStrategy['condition']>('above');
  const [newValue, setNewValue] = useState('');
  const [newName, setNewName] = useState('');

  // Track previous prices for condition checking
  const [priceHistory, setPriceHistory] = useState<Record<string, { price: number; high: number; low: number }>>({});

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

  const handleAddStrategy = () => {
    if (!newSymbol || !newValue) return;

    const stock = getStock(newSymbol.toUpperCase());
    if (!stock) {
      alert(`Symbol "${newSymbol}" not found`);
      return;
    }

    const strategy: AlertStrategy = {
      id: crypto.randomUUID(),
      symbol: newSymbol.toUpperCase(),
      condition: newCondition,
      value: parseFloat(newValue),
      name: newName || `${newSymbol.toUpperCase()} ${newCondition} ${newValue}`,
    };

    const updatedStrategies = [...strategies, strategy];
    setStrategies(updatedStrategies);

    updateWidget(config.id, {
      settings: {
        ...config.settings,
        strategies: updatedStrategies,
      },
    });

    // Reset form
    setNewSymbol('');
    setNewValue('');
    setNewName('');
    setIsAddDialogOpen(false);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    const updatedStrategies = strategies.filter((s) => s.id !== strategyId);
    setStrategies(updatedStrategies);

    updateWidget(config.id, {
      settings: {
        ...config.settings,
        strategies: updatedStrategies,
      },
    });
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  // Check alert conditions
  useEffect(() => {
    if (strategies.length === 0) return;

    const checkConditions = () => {
      const allStocks = getAllStocks();
      const newAlerts: TriggeredAlert[] = [];

      strategies.forEach((strategy) => {
        const stock = getStock(strategy.symbol);
        if (!stock) return;

        const prevData = priceHistory[strategy.symbol];
        let triggered = false;
        let message = '';

        switch (strategy.condition) {
          case 'above':
            if (stock.price > strategy.value) {
              triggered = true;
              message = `${strategy.symbol} is above $${strategy.value.toFixed(2)} (current: $${stock.price.toFixed(2)})`;
            }
            break;

          case 'below':
            if (stock.price < strategy.value) {
              triggered = true;
              message = `${strategy.symbol} is below $${strategy.value.toFixed(2)} (current: $${stock.price.toFixed(2)})`;
            }
            break;

          case 'change_percent':
            if (Math.abs(stock.changePercent) >= strategy.value) {
              triggered = true;
              message = `${strategy.symbol} changed ${stock.changePercent.toFixed(2)}% (threshold: ${strategy.value}%)`;
            }
            break;

          case 'volume':
            if (stock.volume >= strategy.value) {
              triggered = true;
              message = `${strategy.symbol} volume is ${(stock.volume / 1000000).toFixed(2)}M (threshold: ${(strategy.value / 1000000).toFixed(2)}M)`;
            }
            break;

          case 'new_high':
            if (prevData && stock.price > prevData.high) {
              triggered = true;
              message = `${strategy.symbol} hit new high: $${stock.price.toFixed(2)}`;
            }
            break;

          case 'new_low':
            if (prevData && stock.price < prevData.low) {
              triggered = true;
              message = `${strategy.symbol} hit new low: $${stock.price.toFixed(2)}`;
            }
            break;
        }

        if (triggered) {
          // Check if this alert was already triggered in the last 30 seconds
          const recentAlert = alerts.find(
            (a) =>
              a.strategyId === strategy.id &&
              Date.now() - a.timestamp.getTime() < 30000
          );

          if (!recentAlert) {
            newAlerts.push({
              id: crypto.randomUUID(),
              strategyId: strategy.id,
              strategyName: strategy.name,
              symbol: strategy.symbol,
              message,
              timestamp: new Date(),
            });
          }
        }

        // Update price history
        setPriceHistory((prev) => ({
          ...prev,
          [strategy.symbol]: {
            price: stock.price,
            high: Math.max(prev[strategy.symbol]?.high || stock.price, stock.price),
            low: Math.min(prev[strategy.symbol]?.low || stock.price, stock.price),
          },
        }));
      });

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
      }
    };

    // Check conditions every 2 seconds
    const interval = setInterval(checkConditions, 2000);

    return () => clearInterval(interval);
  }, [strategies, priceHistory, alerts, getStock, getAllStocks]);

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'above': return 'Price Above';
      case 'below': return 'Price Below';
      case 'change_percent': return 'Change %';
      case 'volume': return 'Volume Above';
      case 'new_high': return 'New High';
      case 'new_low': return 'New Low';
      default: return condition;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();

    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <BaseWidget
        title={config.name}
        onRefresh={handleRefresh}
        onRemove={handleRemove}
        onRename={handleRename}
        isLoading={isLoading}
        footer={`${strategies.length} strategies • ${alerts.length} alerts`}
      >
        <div className="space-y-2">
          {/* Add Strategy Button */}
          <div className="flex gap-1">
            <Button onClick={() => setIsAddDialogOpen(true)} size="sm" variant="default" className="w-full h-7">
              <Plus className="h-3 w-3 mr-1" />
              Add Strategy
            </Button>
            {alerts.length > 0 && (
              <Button onClick={handleClearAlerts} size="sm" variant="outline" className="h-7 px-2">
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Strategies List */}
          {strategies.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Strategies</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="flex items-center justify-between p-1.5 bg-muted/30 rounded text-[10px] group">
                    <div className="flex-1">
                      <div className="font-medium">{strategy.name}</div>
                      <div className="text-muted-foreground">
                        {strategy.symbol} • {getConditionLabel(strategy.condition)}{' '}
                        {strategy.condition !== 'new_high' && strategy.condition !== 'new_low' &&
                          `${strategy.condition === 'volume' ? (strategy.value / 1000000).toFixed(2) + 'M' : strategy.value}`}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Feed */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase">
              Alert Feed {alerts.length > 0 && `(${alerts.length})`}
            </div>

            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Bell className="h-6 w-6 mb-2 opacity-50" />
                <p className="text-xs">No alerts yet</p>
                <p className="text-[10px] mt-1">Add strategies to start monitoring</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-[10px] font-medium">{alert.message}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">
                          {alert.strategyName}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground whitespace-nowrap">
                        <Clock className="h-2.5 w-2.5" />
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {strategies.length === 0 && alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No strategies configured</p>
              <p className="text-[10px] mt-1">Click "Add Strategy" to get started</p>
            </div>
          )}
        </div>
      </BaseWidget>

      {/* Add Strategy Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Alert Strategy</DialogTitle>
            <DialogDescription>
              Create a new alert that triggers when conditions are met
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symbol</label>
              <Input
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <Select value={newCondition} onValueChange={(v) => setNewCondition(v as AlertStrategy['condition'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                  <SelectItem value="change_percent">Change % (absolute)</SelectItem>
                  <SelectItem value="volume">Volume Above</SelectItem>
                  <SelectItem value="new_high">New High of Day</SelectItem>
                  <SelectItem value="new_low">New Low of Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newCondition !== 'new_high' && newCondition !== 'new_low' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Value {newCondition === 'volume' && '(in shares)'}
                  {newCondition === 'change_percent' && '(%)'}
                </label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={newCondition === 'volume' ? '1000000' : '100'}
                  step={newCondition === 'change_percent' ? '0.1' : '1'}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Name (optional)</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Alert Strategy"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStrategy}>
                Add Strategy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
