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
  // Calculate optimal window height based on viewport
  const getOptimalHeight = () => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const menuBarHeight = 60;
    const rowHeight = 80;
    const padding = 16;
    const margin = 16;
    const availableHeight = viewportHeight - menuBarHeight - padding - margin;
    const totalRows = Math.floor(availableHeight / rowHeight);

    // 5 windows total: 3 scanners in top row, 2 windows in bottom row
    const topRowHeight = Math.floor(totalRows / 2);
    const bottomRowHeight = totalRows - topRowHeight;

    return { topRowHeight, bottomRowHeight };
  };

  const { topRowHeight, bottomRowHeight } = getOptimalHeight();

  const [windows, setWindows] = useState<WindowInstance[]>([
    // Top row: 3 scanners (4 columns each)
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
      layout: { x: 0, y: 0, w: 4, h: topRowHeight, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-losers',
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
      layout: { x: 4, y: 0, w: 4, h: topRowHeight, minW: 3, minH: 2 },
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
      layout: { x: 8, y: 0, w: 4, h: topRowHeight, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    // Bottom row: News (6 cols) + Alerts (6 cols)
    {
      id: 'default-news',
      title: 'Market News',
      type: 'news',
      config: {
        type: 'news',
        config: {
          maxItems: 20,
        },
      },
      layout: { x: 0, y: topRowHeight, w: 6, h: bottomRowHeight, minW: 3, minH: 2 },
      zIndex: 1,
      focused: false,
    },
    {
      id: 'default-alerts',
      title: 'Alerts',
      type: 'alerts',
      config: {
        type: 'alerts',
        config: {},
      },
      layout: { x: 6, y: topRowHeight, w: 6, h: bottomRowHeight, minW: 3, minH: 2 },
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

    // Calculate optimal height based on viewport (assuming 80px row height + 16px padding)
    // Viewport height minus menu bar (~60px) divided by row height
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const menuBarHeight = 60;
    const rowHeight = 80;
    const availableHeight = viewportHeight - menuBarHeight - 16; // 16px for padding
    const optimalRows = Math.floor(availableHeight / rowHeight);
    const defaultHeight = Math.max(6, Math.min(optimalRows, 12)); // Between 6-12 rows

    // Find first available position (top-left first-fit)
    const defaultWidth = 6;

    for (let y = 0; y < 100; y++) { // Max 100 rows
      for (let x = 0; x <= 12 - defaultWidth; x++) {
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

    // If no space found, place at bottom
    const maxY = Math.max(...windows.map(w => w.layout.y + w.layout.h), 0);
    return { x: 0, y: maxY, w: defaultWidth, h: defaultHeight };
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
        minW: 3,
        minH: 2,
      },
      zIndex: maxZIndex + 1,
      focused: true,
    };

    // Add new window and auto-resize all windows to fit viewport
    setWindows(prev => {
      const allWindows = [
        ...prev.map(w => ({ ...w, focused: false })),
        newWindow
      ];

      // Auto-resize windows to fit viewport height
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const menuBarHeight = 60;
      const rowHeight = 80;
      const padding = 16;
      const margin = 16;
      const availableHeight = viewportHeight - menuBarHeight - padding - margin;
      const totalRows = Math.floor(availableHeight / rowHeight);

      // Find all unique Y positions to determine vertical stacking
      const yPositions = [...new Set(allWindows.map(w => w.layout.y))].sort((a, b) => a - b);

      if (yPositions.length > 1) {
        // Windows are stacked - resize to fit
        const rowsPerWindow = Math.floor(totalRows / yPositions.length);
        const minRows = 3;
        const finalRows = Math.max(rowsPerWindow, minRows);

        return allWindows.map(w => {
          const yIndex = yPositions.indexOf(w.layout.y);
          return {
            ...w,
            layout: {
              ...w.layout,
              y: yIndex * finalRows,
              h: finalRows,
            },
          };
        });
      }

      return allWindows;
    });
  }, [windows, findFirstAvailablePosition]);

  // Remove a window
  const removeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const remainingWindows = prev.filter(w => w.id !== id);

      if (remainingWindows.length === 0) return remainingWindows;

      // Auto-resize remaining windows to fit viewport height
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const menuBarHeight = 60;
      const rowHeight = 80;
      const padding = 16;
      const margin = 16;
      const availableHeight = viewportHeight - menuBarHeight - padding - margin;
      const totalRows = Math.floor(availableHeight / rowHeight);

      // Find all unique Y positions to determine vertical stacking
      const yPositions = [...new Set(remainingWindows.map(w => w.layout.y))].sort((a, b) => a - b);

      if (yPositions.length > 1) {
        // Windows are stacked - resize to fit
        const rowsPerWindow = Math.floor(totalRows / yPositions.length);
        const minRows = 3;
        const finalRows = Math.max(rowsPerWindow, minRows);

        return remainingWindows.map(w => {
          const yIndex = yPositions.indexOf(w.layout.y);
          return {
            ...w,
            layout: {
              ...w.layout,
              y: yIndex * finalRows,
              h: finalRows,
            },
          };
        });
      }

      return remainingWindows;
    });
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

  // Fit all windows to viewport
  const fitAllWindows = useCallback(() => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const menuBarHeight = 60;
    const rowHeight = 80;
    const padding = 16;
    const margin = 16; // Total margin between windows
    const availableHeight = viewportHeight - menuBarHeight - padding - margin;
    const totalRows = Math.floor(availableHeight / rowHeight);

    setWindows(prev => {
      if (prev.length === 0) return prev;

      // Calculate how many rows each window should get
      const rowsPerWindow = Math.floor(totalRows / prev.length);
      const minRows = 3; // Minimum 3 rows per window
      const finalRows = Math.max(rowsPerWindow, minRows);

      // Arrange windows in a grid layout that fills viewport
      return prev.map((window, index) => {
        // Arrange in 2 columns if more than 2 windows
        const cols = prev.length > 2 ? 2 : 1;
        const windowsPerCol = Math.ceil(prev.length / cols);

        const col = Math.floor(index / windowsPerCol);
        const row = index % windowsPerCol;

        const width = cols === 2 ? 6 : 12;
        const x = col * 6;
        const y = row * finalRows;

        return {
          ...window,
          layout: {
            ...window.layout,
            x,
            y,
            w: width,
            h: finalRows,
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
