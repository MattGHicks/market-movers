'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { WindowInstance, WindowType, WindowConfig, Workspace } from '@/types/windows';
import { Layout } from 'react-grid-layout';

interface WindowContextType {
  windows: WindowInstance[];
  addWindow: (type: WindowType, title: string, config: WindowConfig) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInstance>) => void;
  updateLayout: (layouts: Layout[]) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  fitAllWindows: () => void;
  saveWorkspace: (name: string) => void;
  loadWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  // Fixed grid: 16 columns x 9 rows
  const GRID_COLS = 16;
  const GRID_ROWS = 9;

  const [windows, setWindows] = useState<WindowInstance[]>([
    // Top row: Alerts (left) + Top Losers (center) + Stock Quote (right)
    {
      id: 'default-alerts',
      title: 'Alerts',
      type: 'alerts',
      config: {
        type: 'alerts',
        config: {},
      },
      layout: { x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-losers-1',
      title: 'Top Losers',
      type: 'scanner',
      config: {
        type: 'scanner',
        config: {
          name: 'Top Losers',
          filters: {},
          columns: [
            { id: 'symbol', label: 'Symbol', key: 'symbol', visible: true, width: 80, sortable: true },
            { id: 'price', label: 'Price ($)', key: 'price', visible: true, width: 80, format: 'currency', sortable: true },
            { id: 'change', label: 'Change ($)', key: 'change', visible: true, width: 80, format: 'currency', colorCode: true, sortable: true },
            { id: 'changesPercentage', label: 'Chg %', key: 'changesPercentage', visible: true, width: 80, format: 'percent', colorCode: true, sortable: true },
            { id: 'volume', label: 'Volume', key: 'volume', visible: true, width: 100, format: 'volume', sortable: true },
          ],
          dataType: 'losers',
          colorCoded: true,
          maxRows: 50,
        },
      },
      layout: { x: 3, y: 0, w: 7, h: 4, minW: 4, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-stock-quote',
      title: 'Stock Quote',
      type: 'stock-quote',
      config: {
        type: 'stock-quote',
        config: {
          symbol: 'AAPL',
        },
      },
      layout: { x: 10, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      zIndex: 1,
      focused: false,
    },
    // Bottom row: Top Gainers + Top Losers + Top Losers (small) + Most Active
    {
      id: 'default-gainers',
      title: 'Top Gainers',
      type: 'scanner',
      config: {
        type: 'scanner',
        config: {
          name: 'Top Gainers',
          filters: {},
          columns: [
            { id: 'symbol', label: 'Symbol', key: 'symbol', visible: true, width: 80, sortable: true },
            { id: 'price', label: 'Price ($)', key: 'price', visible: true, width: 80, format: 'currency', sortable: true },
            { id: 'change', label: 'Change ($)', key: 'change', visible: true, width: 80, format: 'currency', colorCode: true, sortable: true },
            { id: 'changesPercentage', label: 'Chg %', key: 'changesPercentage', visible: true, width: 80, format: 'percent', colorCode: true, sortable: true },
            { id: 'volume', label: 'Volume', key: 'volume', visible: true, width: 100, format: 'volume', sortable: true },
          ],
          dataType: 'gainers',
          colorCoded: true,
          maxRows: 50,
        },
      },
      layout: { x: 0, y: 4, w: 4, h: 5, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-losers-2',
      title: 'Top Losers',
      type: 'scanner',
      config: {
        type: 'scanner',
        config: {
          name: 'Top Losers',
          filters: {},
          columns: [
            { id: 'symbol', label: 'Symbol', key: 'symbol', visible: true, width: 80, sortable: true },
            { id: 'price', label: 'Price ($)', key: 'price', visible: true, width: 80, format: 'currency', sortable: true },
            { id: 'change', label: 'Change ($)', key: 'change', visible: true, width: 80, format: 'currency', colorCode: true, sortable: true },
            { id: 'changesPercentage', label: 'Chg %', key: 'changesPercentage', visible: true, width: 80, format: 'percent', colorCode: true, sortable: true },
            { id: 'volume', label: 'Volume', key: 'volume', visible: true, width: 100, format: 'volume', sortable: true },
          ],
          dataType: 'losers',
          colorCoded: true,
          maxRows: 50,
        },
      },
      layout: { x: 4, y: 4, w: 4, h: 5, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-losers-3',
      title: 'Top Losers',
      type: 'scanner',
      config: {
        type: 'scanner',
        config: {
          name: 'Top Losers',
          filters: {},
          columns: [
            { id: 'symbol', label: 'Symbol', key: 'symbol', visible: true, width: 80, sortable: true },
            { id: 'price', label: 'Price ($)', key: 'price', visible: true, width: 80, format: 'currency', sortable: true },
            { id: 'change', label: 'Change ($)', key: 'change', visible: true, width: 80, format: 'currency', colorCode: true, sortable: true },
            { id: 'changesPercentage', label: 'Chg %', key: 'changesPercentage', visible: true, width: 80, format: 'percent', colorCode: true, sortable: true },
            { id: 'volume', label: 'Volume', key: 'volume', visible: true, width: 100, format: 'volume', sortable: true },
          ],
          dataType: 'losers',
          colorCoded: true,
          maxRows: 50,
        },
      },
      layout: { x: 8, y: 4, w: 3, h: 5, minW: 2, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-actives',
      title: 'Most Active',
      type: 'scanner',
      config: {
        type: 'scanner',
        config: {
          name: 'Most Active',
          filters: {},
          columns: [
            { id: 'symbol', label: 'Symbol', key: 'symbol', visible: true, width: 80, sortable: true },
            { id: 'price', label: 'Price ($)', key: 'price', visible: true, width: 80, format: 'currency', sortable: true },
            { id: 'change', label: 'Change ($)', key: 'change', visible: true, width: 80, format: 'currency', colorCode: true, sortable: true },
            { id: 'changesPercentage', label: 'Chg %', key: 'changesPercentage', visible: true, width: 80, format: 'percent', colorCode: true, sortable: true },
            { id: 'volume', label: 'Volume', key: 'volume', visible: true, width: 100, format: 'volume', sortable: true },
          ],
          dataType: 'actives',
          colorCoded: true,
          maxRows: 50,
        },
      },
      layout: { x: 11, y: 4, w: 5, h: 5, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
  ]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Smart positioning algorithm: Find first available grid position
  const findFirstAvailablePosition = useCallback((windows: WindowInstance[]) => {
    const occupied = new Set<string>();

    // Mark all occupied cells
    windows.forEach(window => {
      for (let y = window.layout.y; y < window.layout.y + window.layout.h; y++) {
        for (let x = window.layout.x; x < window.layout.x + window.layout.w; x++) {
          occupied.add(`${x},${y}`);
        }
      }
    });

    // Fixed grid: 16 columns x 9 rows
    const defaultWidth = 8;  // Half of 16 columns
    const defaultHeight = 4; // About half of 9 rows

    // Find first available position (top-left first-fit)
    for (let y = 0; y <= GRID_ROWS - defaultHeight; y++) {
      for (let x = 0; x <= GRID_COLS - defaultWidth; x++) {
        let canFit = true;

        // Check if position is available
        for (let dy = 0; dy < defaultHeight && canFit; dy++) {
          for (let dx = 0; dx < defaultWidth && canFit; dx++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              canFit = false;
            }
          }
        }

        if (canFit) {
          return { x, y, w: defaultWidth, h: defaultHeight };
        }
      }
    }

    // If no space found, place at (0,0) - overlapping
    return { x: 0, y: 0, w: defaultWidth, h: defaultHeight };
  }, []);

  // Add a new window
  const addWindow = useCallback((type: WindowType, title: string, config: WindowConfig) => {
    const maxZIndex = Math.max(...windows.map(w => w.zIndex || 0), 0);
    const position = findFirstAvailablePosition(windows);

    const newWindow: WindowInstance = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      type,
      config,
      layout: {
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
        minW: 2,
        minH: 1,
      },
      zIndex: maxZIndex + 1,
      focused: true,
    };

    // Add new window (no auto-resize with fixed grid)
    setWindows(prev => [
      ...prev.map(w => ({ ...w, focused: false })),
      newWindow
    ]);
  }, [windows, findFirstAvailablePosition]);

  // Remove a window
  const removeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  // Update window properties
  const updateWindow = useCallback((id: string, updates: Partial<WindowInstance>) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  // Update layouts from react-grid-layout
  const updateLayout = useCallback((layouts: Layout[]) => {
    setWindows(prev =>
      prev.map(window => {
        const layout = layouts.find(l => l.i === window.id);
        if (layout) {
          return {
            ...window,
            layout: {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
              minW: window.layout.minW,
              minH: window.layout.minH,
            },
          };
        }
        return window;
      })
    );
  }, []);

  // Minimize window
  const minimizeWindow = useCallback((id: string) => {
    updateWindow(id, { minimized: true, maximized: false });
  }, [updateWindow]);

  // Maximize window
  const maximizeWindow = useCallback((id: string) => {
    updateWindow(id, { maximized: true, minimized: false });
  }, [updateWindow]);

  // Restore window
  const restoreWindow = useCallback((id: string) => {
    updateWindow(id, { minimized: false, maximized: false });
  }, [updateWindow]);

  // Focus window (click-to-front)
  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex || 0), 0);
      return prev.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? maxZ + 1 : w.zIndex,
      }));
    });
  }, []);

  // Fit all windows to grid (16x9 fixed grid)
  const fitAllWindows = useCallback(() => {
    setWindows(prev => {
      if (prev.length === 0) return prev;

      // Arrange windows in a grid layout that fills the 16x9 grid
      return prev.map((window, index) => {
        // Arrange in 2 columns if more than 2 windows
        const cols = prev.length > 2 ? 2 : 1;
        const windowsPerCol = Math.ceil(prev.length / cols);

        const col = Math.floor(index / windowsPerCol);
        const row = index % windowsPerCol;

        const width = cols === 2 ? 8 : GRID_COLS; // Half grid or full grid
        const height = Math.floor(GRID_ROWS / windowsPerCol);
        const x = col * 8;
        const y = row * height;

        return {
          ...window,
          layout: {
            ...window.layout,
            x,
            y,
            w: width,
            h: height,
          },
        };
      });
    });
  }, []);

  // Save current workspace
  const saveWorkspace = useCallback((name: string) => {
    const workspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      windows,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWorkspaces(prev => [...prev, workspace]);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('market-movers-workspaces');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('market-movers-workspaces', JSON.stringify([...existing, workspace]));
    }
  }, [windows]);

  // Load workspace
  const loadWorkspace = useCallback((workspace: Workspace) => {
    setWindows(workspace.windows);
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        addWindow,
        removeWindow,
        updateWindow,
        updateLayout,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        fitAllWindows,
        saveWorkspace,
        loadWorkspace,
        workspaces,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
}
