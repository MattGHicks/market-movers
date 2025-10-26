'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LayoutGrid, X, Settings, GripVertical } from 'lucide-react';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { ScrollArea } from '@/components/ui/scroll-area';

export function WidgetOrganizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { widgets, removeWidget, updateWidget } = useWidgetStore();

  const widgetList = widgets.allIds.map((id) => widgets.byId[id]);

  const handleRemoveWidget = (id: string) => {
    removeWidget(id);
  };

  const handleToggleVisibility = (id: string, currentVisibility: boolean) => {
    updateWidget(id, {
      settings: {
        ...widgets.byId[id].settings,
        hidden: !currentVisibility,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          Organize Widgets
          {widgetList.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {widgetList.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Widget Organizer</DialogTitle>
          <DialogDescription>
            Manage, rename, and organize all your dashboard widgets.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {widgetList.length > 0 ? (
            <div className="space-y-2">
              {widgetList.map((widget, index) => (
                <div
                  key={widget.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  {/* Drag Handle */}
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Widget Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{widget.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted shrink-0">
                        {widget.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>
                        Position: {widget.layout.x},{widget.layout.y}
                      </span>
                      <span>
                        Size: {widget.layout.w}×{widget.layout.h}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Configure"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWidget(widget.id)}
                      className="h-8 w-8 text-destructive"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LayoutGrid className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Widgets Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start by adding widgets to your dashboard using the "Add Widget" button.
              </p>
            </div>
          )}
        </ScrollArea>

        {widgetList.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total: {widgetList.length} widget{widgetList.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to remove all widgets?')) {
                    widgetList.forEach((w) => removeWidget(w.id));
                  }
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
