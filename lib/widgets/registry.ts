import { ComponentType } from 'react';
import { WidgetConfig, WidgetRegistryEntry } from '@/types/widget.types';

class WidgetRegistry {
  private widgets = new Map<string, WidgetRegistryEntry>();

  register(type: string, entry: WidgetRegistryEntry) {
    this.widgets.set(type, entry);
  }

  get(type: string): WidgetRegistryEntry | undefined {
    return this.widgets.get(type);
  }

  getComponent(type: string): ComponentType<{ config: WidgetConfig }> {
    const entry = this.widgets.get(type);
    if (!entry) {
      throw new Error(`Unknown widget type: ${type}`);
    }
    return entry.component;
  }

  getAll(): WidgetRegistryEntry[] {
    return Array.from(this.widgets.values());
  }

  getTypes(): string[] {
    return Array.from(this.widgets.keys());
  }
}

export const widgetRegistry = new WidgetRegistry();
