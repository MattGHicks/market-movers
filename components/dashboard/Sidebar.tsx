'use client';

import { LayoutDashboard, Settings, TrendingUp, ChevronLeft, ChevronRight, Moon, Sun, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutManager } from './LayoutManager';
import { WidgetOrganizer } from './WidgetOrganizer';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Scanners', href: '/scanners', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onAddWidget?: () => void;
  onLoadLayout?: (layouts: any, widgets: any[]) => void;
}

export function Sidebar({ onAddWidget, onLoadLayout }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="text-lg font-bold">Market Movers</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2 py-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t mx-2 my-2" />

      {/* Dashboard Controls */}
      {!isCollapsed && (
        <div className="px-2 space-y-2">
          {/* Add Widget Button */}
          {onAddWidget && (
            <Button onClick={onAddWidget} size="sm" variant="default" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          )}

          {/* Widget Organizer */}
          <WidgetOrganizer />

          {/* Layout Manager */}
          <LayoutManager onLoadLayout={onLoadLayout} />
        </div>
      )}

      {/* Collapsed state controls */}
      {isCollapsed && (
        <div className="px-2 space-y-2">
          {onAddWidget && (
            <Button onClick={onAddWidget} size="icon" variant="default" className="w-full" title="Add Widget">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Theme Toggle and Footer */}
      <div className="border-t">
        <div className={cn("p-2", isCollapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={isCollapsed ? "icon" : "sm"} className={!isCollapsed ? "w-full justify-start" : ""}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                {!isCollapsed && <span className="ml-2">Theme</span>}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isCollapsed && (
          <div className="p-3 pt-0">
            <p className="text-xs text-muted-foreground">
              © 2025 Market Movers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
