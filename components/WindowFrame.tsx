'use client';

import { WindowInstance } from '@/types/windows';
import { useWindows } from '@/context/WindowContext';
import { ScannerWindow } from './windows/ScannerWindow';
import { NewsWindow } from './windows/NewsWindow';
import { AlertsWindow } from './windows/AlertsWindow';

interface WindowFrameProps {
  window: WindowInstance;
}

export function WindowFrame({ window }: WindowFrameProps) {
  const { removeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindows();

  const renderContent = () => {
    if (window.minimized) return null;

    switch (window.type) {
      case 'scanner':
        return <ScannerWindow config={window.config.type === 'scanner' ? window.config.config : undefined} />;
      case 'news':
        return <NewsWindow config={window.config.type === 'news' ? window.config.config : undefined} />;
      case 'alerts':
        return <AlertsWindow />;
      default:
        return <div className="p-4 text-slate-400">Window type not implemented yet</div>;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-slate-900 border border-slate-700 rounded-lg overflow-hidden ${window.maximized ? 'fixed inset-4 z-50' : ''}`}>
      {/* Window Header */}
      <div className="window-header flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 cursor-move">
        <h3 className="text-sm font-semibold text-white">{window.title}</h3>
        <div className="flex items-center gap-1">
          {/* Minimize */}
          <button
            onClick={() => minimizeWindow(window.id)}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="Minimize"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Maximize/Restore */}
          {window.maximized ? (
            <button
              onClick={() => restoreWindow(window.id)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="Restore"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => maximizeWindow(window.id)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="Maximize"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5" />
              </svg>
            </button>
          )}

          {/* Close */}
          <button
            onClick={() => removeWindow(window.id)}
            className="p-1 hover:bg-red-600 rounded transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
