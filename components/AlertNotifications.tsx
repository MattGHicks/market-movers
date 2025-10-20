'use client';

import { useAlerts } from '@/context/AlertContext';
import { formatPercent } from '@/lib/utils';

export function AlertNotifications() {
  const { alerts, removeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            p-4 rounded-lg shadow-lg border backdrop-blur-sm animate-slide-in
            ${alert.type === 'success' ? 'bg-green-500/20 border-green-500/50' : ''}
            ${alert.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50' : ''}
            ${alert.type === 'info' ? 'bg-blue-500/20 border-blue-500/50' : ''}
            ${alert.type === 'error' ? 'bg-red-500/20 border-red-500/50' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Icon */}
                {alert.type === 'success' && (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {alert.type === 'warning' && (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {alert.type === 'info' && (
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <h4 className="font-semibold text-white">{alert.title}</h4>
              </div>
              <p className="text-sm text-slate-300">{alert.message}</p>
              {alert.stock && (
                <div className="mt-2 pt-2 border-t border-slate-600/50">
                  <p className="text-xs text-slate-400">
                    <span className="font-bold text-white">{alert.stock.symbol}</span>
                    {' '}• {formatPercent(alert.stock.changePercent)}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-3 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
