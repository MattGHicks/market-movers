'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { ScanFilter, ScanSettings } from '@/types';

interface FilterContextType {
  filters: ScanFilter;
  settings: ScanSettings;
  updateFilters: (filters: Partial<ScanFilter>) => void;
  updateSettings: (settings: Partial<ScanSettings>) => void;
  resetFilters: () => void;
}

const defaultFilters: ScanFilter = {
  minVolume: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minChangePercent: undefined,
  sectors: undefined,
};

const defaultSettings: ScanSettings = {
  refreshInterval: 30, // seconds
  filters: defaultFilters,
  alertThreshold: 5, // 5% change triggers alert
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ScanFilter>(defaultFilters);
  const [settings, setSettings] = useState<ScanSettings>(defaultSettings);

  const updateFilters = (newFilters: Partial<ScanFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateSettings = (newSettings: Partial<ScanSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        settings,
        updateFilters,
        updateSettings,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
