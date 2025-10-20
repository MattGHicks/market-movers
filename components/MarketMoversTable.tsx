import { MarketMover } from '@/types';
import { formatCurrency, formatPercent, formatLargeNumber, getChangeColorClass } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface MarketMoversTableProps {
  stocks: MarketMover[];
  title: string;
  type: 'gainers' | 'losers' | 'actives';
}

export function MarketMoversTable({ stocks, title, type }: MarketMoversTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-400 text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-4 text-slate-400 font-medium">Symbol</th>
              <th className="text-left p-4 text-slate-400 font-medium">Name</th>
              <th className="text-right p-4 text-slate-400 font-medium">Price</th>
              <th className="text-right p-4 text-slate-400 font-medium">Change</th>
              <th className="text-right p-4 text-slate-400 font-medium">Change %</th>
              <th className="text-right p-4 text-slate-400 font-medium">Volume</th>
            </tr>
          </thead>
          <tbody>
            {stocks.slice(0, 10).map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <tr
                  key={stock.symbol}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-bold text-white">{stock.symbol}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300 text-sm truncate max-w-[200px] block">
                      {stock.name}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-white">{formatCurrency(stock.price)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={getChangeColorClass(stock.change)}>
                      {isPositive ? '+' : ''}{formatCurrency(stock.change)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={cn(
                      'px-2 py-1 rounded text-sm font-medium',
                      isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    )}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-slate-300 text-sm">
                      {formatLargeNumber(stock.volume)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
