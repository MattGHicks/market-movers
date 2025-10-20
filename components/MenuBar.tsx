'use client';

import { useState } from 'react';
import { useWindows } from '@/context/WindowContext';
import { DEFAULT_SCANNER_COLUMNS } from '@/types/windows';
import { ThemeToggle } from '@/components/ThemeToggle';

export function MenuBar() {
  const { addWindow, saveWorkspace, workspaces, loadWorkspace, fitAllWindows } = useWindows();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showWorkspacesMenu, setShowWorkspacesMenu] = useState(false);

  const createScannerWindow = (dataType: 'gainers' | 'losers' | 'actives', name: string) => {
    addWindow('scanner', name, {
      type: 'scanner',
      config: {
        name,
        filters: {},
        columns: DEFAULT_SCANNER_COLUMNS,
        dataType,
        colorCoded: true,
        maxRows: 50,
      },
    });
    setShowNewMenu(false);
  };

  const createNewsWindow = () => {
    addWindow('news', 'Market News', {
      type: 'news',
      config: {
        maxItems: 20,
      },
    });
    setShowNewMenu(false);
  };

  const createAlertsWindow = () => {
    addWindow('alerts', 'Alerts', {
      type: 'alerts',
      config: {},
    });
    setShowNewMenu(false);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-primary)'
    }} className="px-4 py-2">
      <div className="flex items-center gap-6">
        {/* Logo/Title */}
        <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Market Movers Pro
        </div>

        {/* New Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNewMenu(!showNewMenu);
              setShowWorkspacesMenu(false);
            }}
            style={{
              color: 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
            className="px-3 py-1 text-sm rounded"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            New
          </button>

          {showNewMenu && (
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-lg)'
            }} className="absolute top-full left-0 mt-1 rounded-lg min-w-[200px] py-1 z-50">
              <button
                onClick={() => createScannerWindow('gainers', 'Top Gainers')}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                📈 Top Gainers Scanner
              </button>
              <button
                onClick={() => createScannerWindow('losers', 'Top Losers')}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                📉 Top Losers Scanner
              </button>
              <button
                onClick={() => createScannerWindow('actives', 'Most Active')}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                🔥 Most Active Scanner
              </button>
              <div style={{ borderTop: '1px solid var(--border-primary)' }} className="my-1"></div>
              <button
                onClick={createNewsWindow}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                📰 News Window
              </button>
              <button
                onClick={createAlertsWindow}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                🔔 Alerts Window
              </button>
            </div>
          )}
        </div>

        {/* Workspaces Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowWorkspacesMenu(!showWorkspacesMenu);
              setShowNewMenu(false);
            }}
            style={{
              color: 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
            className="px-3 py-1 text-sm rounded"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Workspaces
          </button>

          {showWorkspacesMenu && (
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-lg)'
            }} className="absolute top-full left-0 mt-1 rounded-lg min-w-[200px] py-1 z-50">
              <button
                onClick={() => {
                  const name = prompt('Workspace name:');
                  if (name) {
                    saveWorkspace(name);
                    setShowWorkspacesMenu(false);
                  }
                }}
                style={{ color: 'var(--text-secondary)' }}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                💾 Save Current Workspace
              </button>
              {workspaces.length > 0 && (
                <>
                  <div style={{ borderTop: '1px solid var(--border-primary)' }} className="my-1"></div>
                  <div style={{ color: 'var(--text-muted)' }} className="px-4 py-1 text-xs">
                    Saved Workspaces:
                  </div>
                  {workspaces.map(workspace => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        loadWorkspace(workspace);
                        setShowWorkspacesMenu(false);
                      }}
                      style={{ color: 'var(--text-secondary)' }}
                      className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    >
                      {workspace.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Settings Link */}
        <a
          href="/settings"
          style={{
            color: 'var(--text-secondary)',
            transition: 'all 0.2s'
          }}
          className="px-3 py-1 text-sm rounded"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Settings
        </a>

        {/* Fit to Screen Button */}
        <button
          onClick={fitAllWindows}
          style={{
            color: 'var(--text-secondary)',
            background: 'transparent',
            transition: 'all 0.2s'
          }}
          className="px-3 py-1 text-sm rounded"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Resize all windows to fill viewport"
        >
          Fit to Screen
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
