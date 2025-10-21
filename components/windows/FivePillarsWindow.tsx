'use client';

export function FivePillarsWindow() {
  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ross's 5 Pillars Scanner
          </h3>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Day Trading Strategy
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="text-5xl">🏛️</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            5 Pillars Strategy Scanner
          </p>
          <div
            className="px-3 py-2 rounded text-xs max-w-md"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-muted)'
            }}
          >
            Scans for stocks meeting Ross Cameron's 5 Pillars criteria:
            <ul className="mt-2 text-left space-y-1">
              <li>• Float under 100M shares</li>
              <li>• Relative volume {'>'} 2x</li>
              <li>• Price $2-20 range</li>
              <li>• Strong catalyst/news</li>
              <li>• Technical setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
