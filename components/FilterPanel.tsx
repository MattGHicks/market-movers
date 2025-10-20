'use client';

import { useState } from 'react';
import { useFilters } from '@/context/FilterContext';
import { formatLargeNumber } from '@/lib/utils';
import { getActiveFilterCount } from '@/lib/filterStocks';

export function FilterPanel() {
  const { filters, updateFilters, resetFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = getActiveFilterCount(filters);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-white">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-sm">
              {activeCount} active
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-700 space-y-4">
          {/* Minimum Volume */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Minimum Volume
            </label>
            <input
              type="number"
              value={filters.minVolume || ''}
              onChange={(e) => updateFilters({
                minVolume: e.target.value ? Number(e.target.value) : undefined
              })}
              placeholder="e.g., 1000000"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {filters.minVolume && (
              <p className="text-xs text-slate-400 mt-1">
                {formatLargeNumber(filters.minVolume)} minimum
              </p>
            )}
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilters({
                  minPrice: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="$0"
                step="0.01"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilters({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="No limit"
                step="0.01"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Minimum Change Percent */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Minimum Change %
            </label>
            <input
              type="number"
              value={filters.minChangePercent || ''}
              onChange={(e) => updateFilters({
                minChangePercent: e.target.value ? Number(e.target.value) : undefined
              })}
              placeholder="e.g., 5"
              step="0.1"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {filters.minChangePercent && (
              <p className="text-xs text-slate-400 mt-1">
                Show stocks with ≥{filters.minChangePercent}% change
              </p>
            )}
          </div>

          {/* Reset Button */}
          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
