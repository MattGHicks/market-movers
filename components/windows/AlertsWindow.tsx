'use client';

import { useAlerts } from '@/context/AlertContext';
import { formatPercent } from '@/lib/utils';

export function AlertsWindow() {
  const { alerts, removeAlert } = useAlerts();

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div
        className="px-3 py-2"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {alerts.length} active alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-auto">
        {alerts.length > 0 ? (
          <div>
            {alerts.map(alert => {
              const bgColor =
                alert.type === 'success' ? 'var(--green-bg)' :
                alert.type === 'warning' ? 'var(--yellow-bg)' :
                alert.type === 'info' ? 'var(--blue-bg)' :
                'var(--red-bg)';

              return (
                <div
                  key={alert.id}
                  className="p-3"
                  style={{
                    background: bgColor,
                    borderBottom: '1px solid var(--border-secondary)',
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {alert.title}
                    </h4>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      style={{ color: 'var(--text-secondary)' }}
                      className="transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {alert.message}
                  </p>
                  {alert.stock && (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {alert.stock.symbol} • {formatPercent(alert.stock.changePercent)}
                    </div>
                  )}
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
            No active alerts
          </div>
        )}
      </div>
    </div>
  );
}
