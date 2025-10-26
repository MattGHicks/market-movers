'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import { AddWidgetDialog } from '@/components/dashboard/AddWidgetDialog';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { useState } from 'react';
import '@/lib/widgets'; // Import to register widgets

export default function Home() {
  const { addWidget, widgets, loadWidgets } = useWidgetStore();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  const handleOpenAddWidget = () => {
    setIsAddWidgetOpen(true);
  };

  const handleSelectWidget = (widgetType: string) => {
    const id = crypto.randomUUID();

    // Get widget-specific defaults
    const widgetDefaults: Record<string, any> = {
      'top-list-scanner': {
        name: `Scanner ${widgets.allIds.length + 1}`,
        settings: {
          symbols: [],
          sortBy: 'changePercent',
          sortOrder: 'desc',
          maxItems: 50,
          refreshInterval: 0,
        },
      },
      'watchlist': {
        name: `Watchlist ${widgets.allIds.filter((id) => widgets.byId[id].type === 'watchlist').length + 1}`,
        settings: {
          symbols: [],
        },
      },
      'market-overview': {
        name: 'Market Overview',
        settings: {},
      },
      'news': {
        name: 'Market News',
        settings: {},
      },
      'chart': {
        name: `Chart ${widgets.allIds.filter((id) => widgets.byId[id].type === 'chart').length + 1}`,
        settings: {
          symbol: 'AAPL',
        },
      },
      'alerts': {
        name: 'Alerts',
        settings: {
          strategies: [],
        },
      },
    };

    const defaults = widgetDefaults[widgetType] || { name: 'New Widget', settings: {} };

    addWidget({
      id,
      type: widgetType as any,
      version: '1.0.0',
      name: defaults.name,
      settings: defaults.settings,
      layout: {
        x: (widgets.allIds.length * 4) % 12,
        y: Math.floor((widgets.allIds.length * 4) / 12) * 6,
        w: 6,
        h: 6,
      },
    });
  };

  const handleLoadLayout = (layouts: any, widgetsToLoad: any[]) => {
    // Load widgets into store
    loadWidgets(widgetsToLoad);

    // Save layouts to localStorage for WidgetGrid to use
    localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));

    // Force a re-render by reloading the page
    window.location.reload();
  };

  return (
    <>
      <AddWidgetDialog
        open={isAddWidgetOpen}
        onOpenChange={setIsAddWidgetOpen}
        onSelectWidget={handleSelectWidget}
      />
      <DashboardLayout onAddWidget={handleOpenAddWidget} onLoadLayout={handleLoadLayout}>
        <WidgetGrid />
      </DashboardLayout>
    </>
  );
}
