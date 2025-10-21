'use client';

import { useState, useEffect } from 'react';
import { useTopGainers, useTopLosers, useMostActive } from '@/hooks/useMarketData';
import { ScannerConfig, ColumnConfig, DEFAULT_SCANNER_COLUMNS } from '@/types/windows';
import { MarketMover } from '@/types';
import { filterStocks } from '@/lib/filterStocks';
import { formatCurrency, formatPercent, formatLargeNumber } from '@/lib/utils';
import { getChangeColor } from '@/lib/colorCoding';
import { useTableSort } from '@/hooks/useTableSort';
import { useColumnResize } from '@/hooks/useColumnResize';
import { useDataFlash } from '@/hooks/useDataFlash';
import { useSymbolSelection } from '@/context/SymbolSelectionContext';

interface ScannerWindowProps {
  config?: ScannerConfig;
}

export function ScannerWindow({ config }: ScannerWindowProps) {
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [refreshRate, setRefreshRate] = useState<number>(30000); // Default 30s
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tickersWithRecentNews, setTickersWithRecentNews] = useState<Set<string>>(new Set());
  const [tickersWithDayOldNews, setTickersWithDayOldNews] = useState<Set<string>>(new Set());

  // Symbol selection for cross-window sync
  const { setSelectedSymbol } = useSymbolSelection();

  // Use column resize hook
  const { columns, setColumns, handleResizeStart } = useColumnResize(
    config?.columns || DEFAULT_SCANNER_COLUMNS
  );

  // Fetch data based on dataType with configurable refresh
  const dataType = config?.dataType || 'gainers';
  const { data: gainersData, refetch: refetchGainers } = useTopGainers(autoRefresh ? refreshRate : undefined);
  const { data: losersData, refetch: refetchLosers } = useTopLosers(autoRefresh ? refreshRate : undefined);
  const { data: activesData, refetch: refetchActives } = useMostActive(autoRefresh ? refreshRate : undefined);

  // Select appropriate data source
  let stocks: MarketMover[] = [];
  let refetch = refetchGainers;

  if (dataType === 'gainers' && gainersData?.gainers) {
    stocks = gainersData.gainers;
    refetch = refetchGainers;
  } else if (dataType === 'losers' && losersData?.losers) {
    stocks = losersData.losers;
    refetch = refetchLosers;
  } else if (dataType === 'actives' && activesData?.active) {
    stocks = activesData.active;
    refetch = refetchActives;
  }

  // Apply filters if configured
  if (config?.filters) {
    stocks = filterStocks(stocks, config.filters);
  }

  // Limit rows if configured
  if (config?.maxRows) {
    stocks = stocks.slice(0, config.maxRows);
  }

  // Use sorting hook
  const { sortedData, sortState, handleSort } = useTableSort(stocks);

  // Use flash animation hook
  const { getFlashClass } = useDataFlash(sortedData);

  // Check for recent news for each ticker
  useEffect(() => {
    const checkRecentNews = async () => {
      if (!sortedData || sortedData.length === 0) return;

      const newsChecks = sortedData.map(async (stock) => {
        try {
          const response = await fetch(`/api/news/recent/${stock.symbol}`);
          const data = await response.json();
          return {
            symbol: stock.symbol,
            hasRecentNews: data.hasRecentNews,
            hasDayOldNews: data.hasDayOldNews
          };
        } catch (error) {
          return { symbol: stock.symbol, hasRecentNews: false, hasDayOldNews: false };
        }
      });

      const results = await Promise.all(newsChecks);
      const recentNewsSet = new Set(
        results.filter(r => r.hasRecentNews).map(r => r.symbol)
      );
      const dayOldNewsSet = new Set(
        results.filter(r => r.hasDayOldNews).map(r => r.symbol)
      );
      setTickersWithRecentNews(recentNewsSet);
      setTickersWithDayOldNews(dayOldNewsSet);
    };

    checkRecentNews();

    // Re-check every 2 minutes
    const interval = setInterval(checkRecentNews, 120000);
    return () => clearInterval(interval);
  }, [sortedData]);

  const formatValue = (value: any, format?: ColumnConfig['format'], colorCode?: boolean) => {
    if (value === undefined || value === null) return '-';

    const numValue = Number(value);
    const colorResult = colorCode ? getChangeColor(numValue) : null;

    const content = (() => {
      switch (format) {
        case 'currency':
          return formatCurrency(numValue);
        case 'percent':
          return formatPercent(numValue);
        case 'volume':
          return formatLargeNumber(numValue);
        case 'number':
          return numValue.toLocaleString();
        default:
          return String(value);
      }
    })();

    return (
      <span
        className={`scanner-number ${colorResult?.className || ''}`}
        style={colorResult?.style || { color: 'var(--text-primary)' }}
      >
        {content}
      </span>
    );
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
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {sortedData?.length || 0} stocks
          </span>

          {/* Freeze/Resume Button */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1"
            style={{
              background: autoRefresh ? 'var(--bg-hover)' : 'var(--yellow-bg)',
              color: autoRefresh ? 'var(--text-secondary)' : 'var(--yellow-base)',
              border: '1px solid var(--border-primary)',
            }}
            title={autoRefresh ? 'Pause auto-refresh' : 'Resume auto-refresh'}
          >
            {autoRefresh ? '⏸' : '▶'} {autoRefresh ? 'Freeze' : 'Resume'}
          </button>

          {/* Refresh Rate Selector */}
          <select
            value={refreshRate}
            onChange={(e) => setRefreshRate(Number(e.target.value))}
            className="text-xs rounded px-2 py-1 transition-colors"
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
            disabled={!autoRefresh}
          >
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
          </select>

          {/* Manual Refresh Button */}
          <button
            onClick={() => refetch()}
            className="px-2 py-1 text-xs rounded transition-colors"
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-active)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title="Refresh now"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Columns Button */}
        <button
          onClick={() => setShowColumnConfig(!showColumnConfig)}
          className="px-2 py-1 text-xs rounded transition-colors"
          style={{
            background: showColumnConfig ? 'var(--bg-active)' : 'var(--bg-hover)',
            color: showColumnConfig ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-active)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            if (!showColumnConfig) {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Columns
        </button>
      </div>

      {/* Column Configuration */}
      {showColumnConfig && (
        <div
          className="px-3 py-2"
          style={{
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex flex-wrap gap-2">
            {columns.map(col => (
              <label
                key={col.id}
                className="flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumn(col.id)}
                  className="rounded"
                />
                <span>{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="scanner-table">
          <thead>
            <tr>
              {visibleColumns.map(col => (
                <th
                  key={col.id}
                  className="scanner-header"
                  style={{
                    width: col.width,
                    position: 'relative',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                  }}
                  onClick={() => col.sortable !== false && handleSort(col.key as string)}
                  title={col.sortable !== false ? 'Click to sort' : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{col.label}</span>

                    {/* Sort indicator */}
                    {col.sortable !== false && sortState.column === col.key && (
                      <span style={{ marginLeft: '4px', fontSize: '10px' }}>
                        {sortState.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>

                  {/* Resize handle */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '8px',
                      cursor: 'col-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseDown={(e) => handleResizeStart(e, col)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        width: '1px',
                        height: '16px',
                        background: 'var(--border-hover)',
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData && sortedData.map((stock) => (
              <tr key={stock.symbol} className="scanner-row">
                {visibleColumns.map(col => {
                  const flashClass = getFlashClass(stock.symbol, col.key as string);
                  const isSymbolColumn = col.key === 'symbol';
                  const hasRecentNews = tickersWithRecentNews.has(stock.symbol);
                  const hasDayOldNews = tickersWithDayOldNews.has(stock.symbol);

                  return (
                    <td
                      key={col.id}
                      className={`scanner-cell ${flashClass} ${isSymbolColumn ? 'cursor-pointer hover:bg-[var(--bg-hover)]' : ''}`}
                      onClick={isSymbolColumn ? () => setSelectedSymbol(stock.symbol) : undefined}
                      style={isSymbolColumn ? { transition: 'background 150ms ease' } : undefined}
                    >
                      {formatValue(stock[col.key as keyof MarketMover], col.format, col.colorCode)}
                      {isSymbolColumn && hasRecentNews && <span className="ml-1" style={{ filter: 'hue-rotate(0deg)' }}>🔥</span>}
                      {isSymbolColumn && !hasRecentNews && hasDayOldNews && <span className="ml-1" style={{ filter: 'hue-rotate(200deg)' }}>🔥</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {(!sortedData || sortedData.length === 0) && (
          <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
            No stocks found matching criteria
          </div>
        )}
      </div>
    </div>
  );
}
