'use client';

import { MenuBar } from '@/components/MenuBar';
import { WorkspaceGrid } from '@/components/WorkspaceGrid';
import { useWindows } from '@/context/WindowContext';
import { useEffect } from 'react';
import { DEFAULT_SCANNER_COLUMNS } from '@/types/windows';

export default function Home() {
  const { addWindow, windows } = useWindows();

  // Create default windows on first load
  useEffect(() => {
    if (windows.length === 0) {
      // Add a default Top Gainers scanner
      addWindow('scanner', 'Top Gainers', {
        type: 'scanner',
        config: {
          name: 'Top Gainers',
          filters: {},
          columns: DEFAULT_SCANNER_COLUMNS,
          dataType: 'gainers',
          colorCoded: true,
          maxRows: 20,
        },
      });

      // Add Market News window
      addWindow('news', 'Market News', {
        type: 'news',
        config: {
          maxItems: 10,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <MenuBar />
      <div className="flex-1 overflow-hidden">
        {windows.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome to Market Movers Pro
              </h2>
              <p className="text-slate-400 mb-6">
                Click &quot;New&quot; in the menu bar to add your first scanner window
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => addWindow('scanner', 'Top Gainers', {
                    type: 'scanner',
                    config: {
                      name: 'Top Gainers',
                      filters: {},
                      columns: DEFAULT_SCANNER_COLUMNS,
                      dataType: 'gainers',
                      colorCoded: true,
                      maxRows: 20,
                    },
                  })}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  📈 Add Top Gainers
                </button>
                <button
                  onClick={() => addWindow('news', 'Market News', {
                    type: 'news',
                    config: {
                      maxItems: 15,
                    },
                  })}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  📰 Add News Feed
                </button>
              </div>
            </div>
          </div>
        ) : (
          <WorkspaceGrid />
        )}
      </div>
    </div>
  );
}
