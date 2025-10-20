'use client';

import Link from 'next/link';
import { useFilters } from '@/context/FilterContext';
import { formatLargeNumber } from '@/lib/utils';

export default function SettingsPage() {
  const { filters, settings, updateFilters, updateSettings, resetFilters } = useFilters();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {/* Scan Settings */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Scan Settings</h2>

            <div className="space-y-4">
              {/* Refresh Interval */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auto-Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => updateSettings({
                    refreshInterval: Number(e.target.value)
                  })}
                  min="10"
                  max="300"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  How often to refresh market data (minimum: 10 seconds)
                </p>
              </div>

              {/* Alert Threshold */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Alert Threshold (% change)
                </label>
                <input
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => updateSettings({
                    alertThreshold: Number(e.target.value)
                  })}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Trigger alerts when stocks move by this percentage
                </p>
              </div>
            </div>
          </div>

          {/* Filter Settings */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Default Filters</h2>
              <button
                onClick={resetFilters}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>

            <div className="space-y-4">
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
                  placeholder="No minimum"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {filters.minVolume && (
                  <p className="text-xs text-slate-400 mt-1">
                    Showing stocks with volume ≥ {formatLargeNumber(filters.minVolume)}
                  </p>
                )}
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Minimum Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilters({
                        minPrice: e.target.value ? Number(e.target.value) : undefined
                      })}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full pl-7 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Maximum Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilters({
                        maxPrice: e.target.value ? Number(e.target.value) : undefined
                      })}
                      placeholder="No limit"
                      step="0.01"
                      className="w-full pl-7 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Change Percent */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Minimum Change Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.minChangePercent || ''}
                    onChange={(e) => updateFilters({
                      minChangePercent: e.target.value ? Number(e.target.value) : undefined
                    })}
                    placeholder="No minimum"
                    step="0.1"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400">%</span>
                </div>
                {filters.minChangePercent && (
                  <p className="text-xs text-slate-400 mt-1">
                    Showing stocks with ≥{filters.minChangePercent}% price change
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* API Information */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">API Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Data Provider</span>
                <span className="text-white">FinancialModelingPrep</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">API Status</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Refresh Rate</span>
                <span className="text-white">{settings.refreshInterval}s</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About Market Movers</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong className="text-white">Version:</strong> 0.1.0
              </p>
              <p>
                <strong className="text-white">Built with:</strong> Next.js, TypeScript, Tailwind CSS
              </p>
              <p className="text-slate-400 pt-2">
                Real-time stock market momentum scanner for identifying trading opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
