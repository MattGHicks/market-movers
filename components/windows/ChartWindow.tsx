'use client';

interface ChartConfig {
  symbol?: string;
  interval?: '1min' | '5min' | '15min' | '1hour' | '1day';
}

interface ChartWindowProps {
  config?: ChartConfig;
}

export function ChartWindow({ config }: ChartWindowProps) {
  const symbol = config?.symbol || 'AAPL';
  const interval = config?.interval || '5min';

  return (
    <div className="h-full flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="text-center space-y-4">
        <div className="text-6xl">📈</div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Chart Window
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          {symbol} - {interval}
        </p>
        <div
          className="px-4 py-2 rounded text-sm"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)'
          }}
        >
          Coming Soon: Interactive price chart with technical indicators
        </div>
      </div>
    </div>
  );
}
