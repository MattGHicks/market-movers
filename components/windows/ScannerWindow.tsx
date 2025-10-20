'use client';

import { useState } from 'react';
import { useTopGainers, useTopLosers, useMostActive } from '@/hooks/useMarketData';
import { ScannerConfig, ColumnConfig, DEFAULT_SCANNER_COLUMNS } from '@/types/windows';
import { MarketMover } from '@/types';
import { filterStocks } from '@/lib/filterStocks';
import { formatCurrency, formatPercent, formatLargeNumber, getChangeColorClass } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface ScannerWindowProps {
  config?: ScannerConfig;
}

export function ScannerWindow({ config }: ScannerWindowProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(
    config?.columns || DEFAULT_SCANNER_COLUMNS
  );
  const [showColumnConfig, setShowColumnConfig] = useState(false);

  // Fetch data based on dataType
  const dataType = config?.dataType || 'gainers';
  const { data: gainersData } = useTopGainers();
  const { data: losersData } = useTopLosers();
  const { data: activesData } = useMostActive();

  // Select appropriate data source
  let stocks: MarketMover[] = [];
  if (dataType === 'gainers' && gainersData?.gainers) stocks = gainersData.gainers;
  else if (dataType === 'losers' && losersData?.losers) stocks = losersData.losers;
  else if (dataType === 'actives' && activesData?.active) stocks = activesData.active;

  // Apply filters if configured
  if (config?.filters) {
    stocks = filterStocks(stocks, config.filters);
  }

  // Limit rows if configured
  if (config?.maxRows) {
    stocks = stocks.slice(0, config.maxRows);
  }

  const formatValue = (value: any, format?: ColumnConfig['format'], colorCode?: boolean) => {
    if (value === undefined || value === null) return '-';

    const className = colorCode ? getChangeColorClass(Number(value)) : 'text-white';

    switch (format) {
      case 'currency':
        return <span className={className}>{formatCurrency(Number(value))}</span>;
      case 'percent':
        return <span className={className}>{formatPercent(Number(value))}</span>;
      case 'volume':
        return <span className="text-slate-300">{formatLargeNumber(Number(value))}</span>;
      case 'number':
        return <span className={className}>{Number(value).toLocaleString()}</span>;
      default:
        return <span className={className}>{String(value)}</span>;
    }
  };

  const toggleColumn = (columnId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{stocks.length} stocks</span>
        </div>
        <button
          onClick={() => setShowColumnConfig(!showColumnConfig)}
          className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
        >
          Columns
        </button>
      </div>

      {/* Column Configuration */}
      {showColumnConfig && (
        <div className="px-3 py-2 bg-slate-800/30 border-b border-slate-700">
          <div className="flex flex-wrap gap-2">
            {columns.map(col => (
              <label
                key={col.id}
                className="flex items-center gap-1 text-xs cursor-pointer hover:bg-slate-700/50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumn(col.id)}
                  className="rounded"
                />
                <span className="text-slate-300">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
            <tr>
              {visibleColumns.map(col => (
                <th
                  key={col.id}
                  className="px-3 py-2 text-left text-xs font-medium text-slate-400"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, idx) => {
              const isPositive = stock.change >= 0;
              const bgColor = config?.colorCoded
                ? isPositive
                  ? 'bg-green-900/20 hover:bg-green-900/30'
                  : 'bg-red-900/20 hover:bg-red-900/30'
                : 'hover:bg-slate-800/50';

              return (
                <tr
                  key={stock.symbol}
                  className={cn('border-b border-slate-800/50 transition-colors', bgColor)}
                >
                  {visibleColumns.map(col => (
                    <td key={col.id} className="px-3 py-2">
                      {formatValue(stock[col.key as keyof MarketMover], col.format, col.colorCode)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {stocks.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No stocks found matching criteria
          </div>
        )}
      </div>
    </div>
  );
}
