'use client';

import { WindowInstance } from '@/types/windows';
import { useWindows } from '@/context/WindowContext';
import { ScannerWindow } from './windows/ScannerWindow';
import { NewsWindow } from './windows/NewsWindow';
import { AlertsWindow } from './windows/AlertsWindow';
import { StockQuoteWindow } from './windows/StockQuoteWindow';
import { ChartWindow } from './windows/ChartWindow';
import { HaltsWindow } from './windows/HaltsWindow';
import { VolumeLeadersWindow } from './windows/VolumeLeadersWindow';
import { FivePillarsWindow } from './windows/FivePillarsWindow';

interface WindowFrameProps {
  window: WindowInstance;
}

export function WindowFrame({ window }: WindowFrameProps) {
  const { removeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow } = useWindows();

  const handleClick = () => {
    if (!window.focused) {
      focusWindow(window.id);
    }
  };

  const renderContent = () => {
    if (window.minimized) return null;

    switch (window.type) {
      case 'scanner':
        return <ScannerWindow config={window.config.type === 'scanner' ? window.config.config : undefined} />;
      case 'news':
        return <NewsWindow config={window.config.type === 'news' ? window.config.config : undefined} />;
      case 'alerts':
        return <AlertsWindow />;
      case 'stock-quote':
        return <StockQuoteWindow config={window.config.type === 'stock-quote' ? window.config.config : undefined} />;
      case 'chart':
        return <ChartWindow config={window.config.type === 'chart' ? window.config.config : undefined} />;
      case 'halts':
        return <HaltsWindow />;
      case 'volume-leaders':
        return <VolumeLeadersWindow />;
      case 'five-pillars':
        return <FivePillarsWindow />;
      default:
        return <div className="p-4 text-slate-400">Window type not implemented yet</div>;
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-lg overflow-hidden ${
        window.maximized ? 'fixed inset-4 z-50' : ''
      } ${window.focused ? 'window-focused' : ''}`}
      style={{
        background: 'var(--bg-secondary)',
        border: window.focused
          ? '2px solid var(--accent-primary)'
          : '1px solid var(--border-primary)',
        boxShadow: window.focused
          ? '0 0 0 4px rgba(59, 130, 246, 0.1), var(--shadow-lg)'
          : 'var(--shadow-md)',
        zIndex: window.zIndex || 1,
      }}
      onClick={handleClick}
      role="article"
      aria-label={`${window.title} window`}
      tabIndex={0}
    >
      {/* Window Header */}
      <div
        className="window-header flex items-center justify-between px-3 py-2 cursor-move"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {window.title}
        </h3>
        <div className="flex items-center gap-1">
          {/* Close */}
          <button
            onClick={() => removeWindow(window.id)}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--red-base)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
