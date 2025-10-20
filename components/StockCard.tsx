import { MarketMover } from '@/types';
import { formatCurrency, formatPercent, formatLargeNumber, getChangeColorClass } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface StockCardProps {
  stock: MarketMover;
}

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
          <p className="text-sm text-slate-400 truncate max-w-[200px]">{stock.name}</p>
        </div>
        <div className={cn(
          'px-2 py-1 rounded text-sm font-medium',
          isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        )}>
          {formatPercent(stock.changePercent)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Price</span>
          <span className="text-white font-medium">{formatCurrency(stock.price)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Change</span>
          <span className={cn('font-medium', getChangeColorClass(stock.change))}>
            {isPositive ? '+' : ''}{formatCurrency(stock.change)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Volume</span>
          <span className="text-white text-sm">{formatLargeNumber(stock.volume)}</span>
        </div>

        {stock.marketCap && (
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Market Cap</span>
            <span className="text-white text-sm">{formatLargeNumber(stock.marketCap)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
