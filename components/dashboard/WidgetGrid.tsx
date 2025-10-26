'use client';

import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { useWidgetStore } from '@/lib/stores/widget-store';
import { widgetRegistry } from '@/lib/widgets';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function WidgetGrid() {
  const { widgets, updateWidget } = useWidgetStore();

  // Convert widgets to layout format
  const layouts = {
    lg: widgets.allIds.map((id) => ({
      i: id,
      x: widgets.byId[id].layout.x,
      y: widgets.byId[id].layout.y,
      w: widgets.byId[id].layout.w,
      h: widgets.byId[id].layout.h,
      minW: 2,
      minH: 2,
    })),
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    newLayout.forEach((item) => {
      const widget = widgets.byId[item.i];
      if (widget) {
        const hasChanged =
          widget.layout.x !== item.x ||
          widget.layout.y !== item.y ||
          widget.layout.w !== item.w ||
          widget.layout.h !== item.h;

        if (hasChanged) {
          updateWidget(item.i, {
            layout: {
              x: item.x,
              y: item.y,
              w: item.w,
              h: item.h,
            },
          });
        }
      }
    });
  };

  // If no widgets, show empty state
  if (widgets.allIds.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No widgets yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Add Widget" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      rowHeight={60}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".widget-drag-handle"
      isDraggable={true}
      isResizable={true}
      compactType="vertical"
      preventCollision={false}
      margin={[2, 2]}
      containerPadding={[2, 2]}
      resizeHandles={['se', 'sw', 'ne', 'nw', 's', 'e', 'w', 'n']}
    >
      {widgets.allIds.map((id) => {
        const widget = widgets.byId[id];
        try {
          const WidgetComponent = widgetRegistry.getComponent(widget.type);

          return (
            <div key={id} className="bg-card rounded-lg shadow-lg overflow-hidden">
              <WidgetComponent config={widget} />
            </div>
          );
        } catch (error) {
          console.error(`Failed to render widget ${id}:`, error);
          return (
            <div key={id} className="bg-card rounded-lg shadow-lg p-4">
              <p className="text-destructive">
                Error: Unknown widget type "{widget.type}"
              </p>
            </div>
          );
        }
      })}
    </ResponsiveGridLayout>
  );
}
