'use client';

import { useState } from 'react';
import { useWindows } from '@/context/WindowContext';
import { DEFAULT_SCANNER_COLUMNS } from '@/types/windows';

export function MenuBar() {
  const { addWindow, saveWorkspace, workspaces, loadWorkspace } = useWindows();
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
    <div className="bg-slate-900 border-b border-slate-700 px-4 py-2">
      <div className="flex items-center gap-6">
        {/* Logo/Title */}
        <div className="font-bold text-white text-lg">Market Movers Pro</div>

        {/* New Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNewMenu(!showNewMenu);
              setShowWorkspacesMenu(false);
            }}
            className="px-3 py-1 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
          >
            New
          </button>

          {showNewMenu && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[200px] py-1 z-50">
              <button
                onClick={() => createScannerWindow('gainers', 'Top Gainers')}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                📈 Top Gainers Scanner
              </button>
              <button
                onClick={() => createScannerWindow('losers', 'Top Losers')}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                📉 Top Losers Scanner
              </button>
              <button
                onClick={() => createScannerWindow('actives', 'Most Active')}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                🔥 Most Active Scanner
              </button>
              <div className="border-t border-slate-700 my-1"></div>
              <button
                onClick={createNewsWindow}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                📰 News Window
              </button>
              <button
                onClick={createAlertsWindow}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
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
            className="px-3 py-1 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
          >
            Workspaces
          </button>

          {showWorkspacesMenu && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[200px] py-1 z-50">
              <button
                onClick={() => {
                  const name = prompt('Workspace name:');
                  if (name) {
                    saveWorkspace(name);
                    setShowWorkspacesMenu(false);
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                💾 Save Current Workspace
              </button>
              {workspaces.length > 0 && (
                <>
                  <div className="border-t border-slate-700 my-1"></div>
                  <div className="px-4 py-1 text-xs text-slate-500">Saved Workspaces:</div>
                  {workspaces.map(workspace => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        loadWorkspace(workspace);
                        setShowWorkspacesMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
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
          className="px-3 py-1 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
        >
          Settings
        </a>
      </div>
    </div>
  );
}
