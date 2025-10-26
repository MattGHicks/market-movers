'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart, Star, LineChart, Newspaper, BarChart3, Bell } from 'lucide-react';

interface WidgetOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  type: string;
}

const widgetOptions: WidgetOption[] = [
  {
    id: 'top-list-scanner',
    name: 'Top List Scanner',
    description: 'Customizable scanner with filters and sorting (gainers, losers, volume)',
    icon: BarChart,
    type: 'top-list-scanner',
  },
  {
    id: 'chart',
    name: 'Price Chart',
    description: 'Real-time price chart with technical indicators',
    icon: LineChart,
    type: 'chart',
  },
  {
    id: 'market-overview',
    name: 'Market Overview',
    description: 'Major market indices (SPY, QQQ, DIA, IWM, VIX)',
    icon: BarChart3,
    type: 'market-overview',
  },
  {
    id: 'news',
    name: 'Market News',
    description: 'Latest market news and sentiment analysis',
    icon: Newspaper,
    type: 'news',
  },
  {
    id: 'watchlist',
    name: 'Watchlist',
    description: 'Track your favorite stocks with custom symbol list',
    icon: Star,
    type: 'watchlist',
  },
  {
    id: 'alerts',
    name: 'Alerts',
    description: 'Create strategies and get alerts when conditions are met (price, volume, new highs/lows)',
    icon: Bell,
    type: 'alerts',
  },
];

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget: (widgetType: string) => void;
}

export function AddWidgetDialog({ open, onOpenChange, onSelectWidget }: AddWidgetDialogProps) {
  const handleSelectWidget = (widgetType: string) => {
    onSelectWidget(widgetType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {widgetOptions.map((widget) => {
            const Icon = widget.icon;
            return (
              <Button
                key={widget.id}
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:border-primary"
                onClick={() => handleSelectWidget(widget.type)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{widget.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  {widget.description}
                </p>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
