'use client';

export function HaltsWindow() {
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Trading Halts
        </h3>
      </div>

      {/* Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="text-5xl">⏸️</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            No Active Halts
          </p>
          <div
            className="px-3 py-2 rounded text-xs max-w-xs"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-muted)'
            }}
          >
            Displays stocks that are currently halted or recently resumed trading
          </div>
        </div>
      </div>
    </div>
  );
}
