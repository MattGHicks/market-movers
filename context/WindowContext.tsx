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
  saveWorkspace: (name: string) => void;
  loadWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Add a new window
  const addWindow = useCallback((type: WindowType, title: string, config: WindowConfig) => {
    const newWindow: WindowInstance = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      type,
      config,
      layout: {
        x: (windows.length * 2) % 12,
        y: Math.floor(windows.length / 6) * 4,
        w: 6,
        h: 4,
        minW: 3,
        minH: 2,
      },
    };

    setWindows(prev => [...prev, newWindow]);
  }, [windows.length]);

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
