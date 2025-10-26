/**
 * Widget system types for Market Movers
 */

import { z } from 'zod';
import { SortField, SortOrder, ScannerCriteria } from './stock.types';

// Base widget configuration
export const WidgetLayoutSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type WidgetLayout = z.infer<typeof WidgetLayoutSchema>;

export const WidgetConfigSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['top-list-scanner', 'chart', 'order-book']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  name: z.string().min(1).max(100),
  settings: z.record(z.unknown()),
  layout: WidgetLayoutSchema,
});

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

// Top List Scanner specific configuration
export const TopListScannerSettingsSchema = z.object({
  symbols: z.array(z.string()).max(500).default([]),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  volumeMin: z.number().min(0).optional(),
  volumeMax: z.number().min(0).optional(),
  changePercentMin: z.number().optional(),
  changePercentMax: z.number().optional(),
  marketCapMin: z.number().min(0).optional(),
  marketCapMax: z.number().min(0).optional(),
  sortBy: z.enum(['symbol', 'price', 'change', 'changePercent', 'volume', 'marketCap']).default('changePercent'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  maxItems: z.number().min(1).max(1000).default(50),
  refreshInterval: z.number().min(0).default(0),
});

export type TopListScannerSettings = z.infer<typeof TopListScannerSettingsSchema>;

export const TopListScannerConfigSchema = WidgetConfigSchema.extend({
  type: z.literal('top-list-scanner'),
  settings: TopListScannerSettingsSchema,
});

export type TopListScannerConfig = z.infer<typeof TopListScannerConfigSchema>;

// Widget registry types
export interface WidgetRegistryEntry {
  type: string;
  component: React.ComponentType<{ config: WidgetConfig }>;
  defaultConfig: Omit<WidgetConfig, 'id' | 'layout'>;
}

// Layout and workspace types
export interface UserLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: number;
  updatedAt: number;
}

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  widgetType: string;
  defaultSettings: Record<string, unknown>;
  isPublic: boolean;
}
