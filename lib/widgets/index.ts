/**
 * Widget registration
 * All widgets must be registered here to be available in the application
 */

import { widgetRegistry } from './registry';
import { TopListScanner } from '@/components/widgets/TopListScanner';
import { Watchlist } from '@/components/widgets/Watchlist';
import { MarketOverview } from '@/components/widgets/MarketOverview';
import { NewsWidget } from '@/components/widgets/NewsWidget';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { AlertWidget } from '@/components/widgets/AlertWidget';
import { WidgetRegistryEntry } from '@/types/widget.types';

// Register Top List Scanner
widgetRegistry.register('top-list-scanner', {
  type: 'top-list-scanner',
  component: TopListScanner as any,
  defaultConfig: {
    type: 'top-list-scanner',
    version: '1.0.0',
    name: 'Top List Scanner',
    settings: {
      symbols: [],
      sortBy: 'changePercent',
      sortOrder: 'desc',
      maxItems: 50,
      refreshInterval: 0,
    },
  },
} as WidgetRegistryEntry);

// Register Watchlist
widgetRegistry.register('watchlist', {
  type: 'watchlist',
  component: Watchlist as any,
  defaultConfig: {
    type: 'watchlist',
    version: '1.0.0',
    name: 'Watchlist',
    settings: {
      symbols: [],
    },
  },
} as WidgetRegistryEntry);

// Register Market Overview
widgetRegistry.register('market-overview', {
  type: 'market-overview',
  component: MarketOverview as any,
  defaultConfig: {
    type: 'market-overview',
    version: '1.0.0',
    name: 'Market Overview',
    settings: {},
  },
} as WidgetRegistryEntry);

// Register News Widget
widgetRegistry.register('news', {
  type: 'news',
  component: NewsWidget as any,
  defaultConfig: {
    type: 'news',
    version: '1.0.0',
    name: 'Market News',
    settings: {},
  },
} as WidgetRegistryEntry);

// Register Chart Widget
widgetRegistry.register('chart', {
  type: 'chart',
  component: ChartWidget as any,
  defaultConfig: {
    type: 'chart',
    version: '1.0.0',
    name: 'Price Chart',
    settings: {
      symbol: 'AAPL',
    },
  },
} as WidgetRegistryEntry);

// Register Alert Widget
widgetRegistry.register('alerts', {
  type: 'alerts',
  component: AlertWidget as any,
  defaultConfig: {
    type: 'alerts',
    version: '1.0.0',
    name: 'Alerts',
    settings: {
      strategies: [],
    },
  },
} as WidgetRegistryEntry);

// Export registry for use in app
export { widgetRegistry } from './registry';
