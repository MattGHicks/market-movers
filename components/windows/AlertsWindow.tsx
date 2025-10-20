'use client';

import { useAlerts } from '@/context/AlertContext';
import { formatPercent } from '@/lib/utils';

export function AlertsWindow() {
  const { alerts, removeAlert } = useAlerts();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs text-slate-400">{alerts.length} active alerts</span>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-auto">
        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 ${
                  alert.type === 'success' ? 'bg-green-900/10' :
                  alert.type === 'warning' ? 'bg-yellow-900/10' :
                  alert.type === 'info' ? 'bg-blue-900/10' :
                  'bg-red-900/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mb-1">{alert.message}</p>
                {alert.stock && (
                  <div className="text-xs text-slate-400">
                    {alert.stock.symbol} • {formatPercent(alert.stock.changePercent)}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            No active alerts
          </div>
        )}
      </div>
    </div>
  );
}
