'use client';

import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onAddWidget?: () => void;
  onLoadLayout?: (layouts: any, widgets: any[]) => void;
}

export function DashboardLayout({ children, onAddWidget, onLoadLayout }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onAddWidget={onAddWidget} onLoadLayout={onLoadLayout} />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
