'use client';

import Link from 'next/link';
import { useTopGainers, useTopLosers, useMostActive } from '@/hooks/useMarketData';
import { MarketMoversTable } from '@/components/MarketMoversTable';
import { StockCard } from '@/components/StockCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FilterPanel } from '@/components/FilterPanel';
import { useFilters } from '@/context/FilterContext';
import { filterStocks } from '@/lib/filterStocks';
import { useAlertDetection } from '@/hooks/useAlertDetection';

export default function Home() {
  const { data: gainersData, isLoading: gainersLoading, error: gainersError } = useTopGainers();
  const { data: losersData, isLoading: losersLoading, error: losersError } = useTopLosers();
  const { data: activesData, isLoading: activesLoading, error: activesError } = useMostActive();
  const { filters } = useFilters();

  // Enable alert detection for significant price movements
  useAlertDetection(gainersData?.gainers, 'gainers');
  useAlertDetection(losersData?.losers, 'losers');
  useAlertDetection(activesData?.active, 'actives');

  const isLoading = gainersLoading || losersLoading || activesLoading;
  const hasError = gainersError || losersError || activesError;

  // Apply filters to data
  const filteredGainers = gainersData?.gainers ? filterStocks(gainersData.gainers, filters) : [];
  const filteredLosers = losersData?.losers ? filterStocks(losersData.losers, filters) : [];
  const filteredActives = activesData?.active ? filterStocks(activesData.active, filters) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Market Movers</h1>
            <p className="text-slate-400">Real-Time Stock Momentum Scanner</p>
            {gainersData?.timestamp && (
              <p className="text-slate-500 text-sm mt-2">
                Last updated: {new Date(gainersData.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
          <Link
            href="/settings"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {hasError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-8">
            <p className="text-red-400">
              Error loading market data. Please check your API key in .env.local
            </p>
          </div>
        )}

        {/* Top Gainers Cards */}
        {filteredGainers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Top 5 Gainers
              {filteredGainers.length < (gainersData?.gainers?.length || 0) && (
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({filteredGainers.length} of {gainersData?.gainers?.length} shown)
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredGainers.slice(0, 5).map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          </div>
        )}

        {/* Market Movers Tables */}
        <div className="space-y-8">
          {filteredGainers.length > 0 && (
            <MarketMoversTable
              stocks={filteredGainers}
              title="Top Gainers"
              type="gainers"
            />
          )}

          {filteredLosers.length > 0 && (
            <MarketMoversTable
              stocks={filteredLosers}
              title="Top Losers"
              type="losers"
            />
          )}

          {filteredActives.length > 0 && (
            <MarketMoversTable
              stocks={filteredActives}
              title="Most Active"
              type="actives"
            />
          )}

          {/* No Results Message */}
          {!isLoading && filteredGainers.length === 0 && filteredLosers.length === 0 && filteredActives.length === 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-8 text-center">
              <p className="text-slate-400">
                No stocks match your current filters. Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
