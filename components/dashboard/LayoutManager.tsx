'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { WidgetConfig } from '@/types/widget.types';

interface SavedLayout {
  name: string;
  timestamp: number;
  layouts: any;
  widgets: WidgetConfig[];
}

interface LayoutManagerProps {
  onLoadLayout?: (layouts: any, widgets: any[]) => void;
}

export function LayoutManager({ onLoadLayout }: LayoutManagerProps) {
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<string>('');

  const widgetState = useWidgetStore((state) => state.widgets);

  // Convert to array for saving
  const widgets = widgetState.allIds.map((id) => widgetState.byId[id]);

  // Load saved layouts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('market-movers-layouts');
    if (stored) {
      try {
        setSavedLayouts(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load layouts:', error);
      }
    }
  }, []);

  // Save layouts to localStorage
  const persistLayouts = (layouts: SavedLayout[]) => {
    localStorage.setItem('market-movers-layouts', JSON.stringify(layouts));
    setSavedLayouts(layouts);
  };

  const handleSaveLayout = () => {
    if (!layoutName.trim()) return;

    const currentLayouts = localStorage.getItem('dashboard-layouts');
    const layouts = currentLayouts ? JSON.parse(currentLayouts) : {};

    const newLayout: SavedLayout = {
      name: layoutName.trim(),
      timestamp: Date.now(),
      layouts,
      widgets,
    };

    const updated = [...savedLayouts, newLayout];
    persistLayouts(updated);
    setLayoutName('');
    setIsSaveDialogOpen(false);
  };

  const handleLoadLayout = () => {
    if (!selectedLayout) return;

    const layout = savedLayouts.find((l) => l.name === selectedLayout);
    if (layout && onLoadLayout) {
      onLoadLayout(layout.layouts, layout.widgets);
      setIsLoadDialogOpen(false);
      setSelectedLayout('');
    }
  };

  const handleDeleteLayout = (layoutName: string) => {
    const updated = savedLayouts.filter((l) => l.name !== layoutName);
    persistLayouts(updated);
    if (selectedLayout === layoutName) {
      setSelectedLayout('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSaveDialogOpen(true)}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Layout
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLoadDialogOpen(true)}
          className="gap-2"
          disabled={savedLayouts.length === 0}
        >
          <FolderOpen className="h-4 w-4" />
          Load Layout
        </Button>
      </div>

      {/* Save Layout Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Layout</DialogTitle>
            <DialogDescription>
              Give your layout a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="layout-name">Layout Name</Label>
              <Input
                id="layout-name"
                placeholder="My Layout"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveLayout();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLayoutName('');
                setIsSaveDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLayout} disabled={!layoutName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Layout Dialog */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Saved Layout</DialogTitle>
            <DialogDescription>
              Select a saved layout to load. This will replace your current layout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="layout-select">Saved Layouts</Label>
              <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                <SelectTrigger id="layout-select">
                  <SelectValue placeholder="Select a layout" />
                </SelectTrigger>
                <SelectContent>
                  {savedLayouts.map((layout) => (
                    <SelectItem key={layout.name} value={layout.name}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{layout.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(layout.timestamp)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* List of saved layouts with delete option */}
            {savedLayouts.length > 0 && (
              <div className="space-y-2">
                <Label>Manage Layouts</Label>
                <div className="space-y-1">
                  {savedLayouts.map((layout) => (
                    <div
                      key={layout.name}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{layout.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(layout.timestamp)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLayout(layout.name)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLayout('');
                setIsLoadDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleLoadLayout} disabled={!selectedLayout}>
              Load Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
