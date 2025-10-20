'use client';

import { useTopGainers, useTopLosers, useMostActive } from '@/hooks/useMarketData';
import { MarketMoversTable } from '@/components/MarketMoversTable';
import { StockCard } from '@/components/StockCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Home() {
  const { data: gainersData, isLoading: gainersLoading, error: gainersError } = useTopGainers();
  const { data: losersData, isLoading: losersLoading, error: losersError } = useTopLosers();
  const { data: activesData, isLoading: activesLoading, error: activesError } = useMostActive();

  const isLoading = gainersLoading || losersLoading || activesLoading;
  const hasError = gainersError || losersError || activesError;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Market Movers</h1>
          <p className="text-slate-400">Real-Time Stock Momentum Scanner</p>
          {gainersData?.timestamp && (
            <p className="text-slate-500 text-sm mt-2">
              Last updated: {new Date(gainersData.timestamp).toLocaleTimeString()}
            </p>
          )}
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
        {gainersData?.gainers && gainersData.gainers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Top 5 Gainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {gainersData.gainers.slice(0, 5).map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          </div>
        )}

        {/* Market Movers Tables */}
        <div className="space-y-8">
          {gainersData?.gainers && (
            <MarketMoversTable
              stocks={gainersData.gainers}
              title="Top Gainers"
              type="gainers"
            />
          )}

          {losersData?.losers && (
            <MarketMoversTable
              stocks={losersData.losers}
              title="Top Losers"
              type="losers"
            />
          )}

          {activesData?.active && (
            <MarketMoversTable
              stocks={activesData.active}
              title="Most Active"
              type="actives"
            />
          )}
        </div>
      </div>
    </main>
  );
}
