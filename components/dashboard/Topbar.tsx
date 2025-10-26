'use client';

import { Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutManager } from './LayoutManager';
import { WidgetOrganizer } from './WidgetOrganizer';

interface TopbarProps {
  onAddWidget?: () => void;
  onLoadLayout?: (layouts: any, widgets: any[]) => void;
}

export function Topbar({ onAddWidget, onLoadLayout }: TopbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Widget Organizer */}
        <WidgetOrganizer />

        {/* Layout Manager */}
        <LayoutManager onLoadLayout={onLoadLayout} />

        {/* Add Widget Button */}
        {onAddWidget && (
          <Button onClick={onAddWidget} size="sm" variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        )}

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
    </div>
  );
}
