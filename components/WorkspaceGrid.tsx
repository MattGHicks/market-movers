'use client';

import { useWindows } from '@/context/WindowContext';
import GridLayout, { Layout } from 'react-grid-layout';
import { WindowFrame } from './WindowFrame';
import { useState, useEffect, useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export function WorkspaceGrid() {
  const { windows, updateLayout, focusWindow } = useWindows();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(800);
  const [isDragging, setIsDragging] = useState(false);

  // Fixed grid: 16 columns x 9 rows
  const GRID_COLS = 16;
  const GRID_ROWS = 9;

  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    // Debounce resize events for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    };

    // Initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Calculate row height to fill container
  const rowHeight = Math.floor((containerHeight - 16) / GRID_ROWS);

  // Convert window layouts to react-grid-layout format
  const layouts: Layout[] = windows.map(window => ({
    i: window.id,
    x: window.layout.x,
    y: window.layout.y,
    w: window.layout.w,
    h: window.layout.h,
    minW: window.layout.minW || 2,
    minH: window.layout.minH || 1,
    maxH: GRID_ROWS, // Max height = 9 rows
  }));

  const handleLayoutChange = (newLayout: Layout[]) => {
    updateLayout(newLayout);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  const handleResizeStart = () => {
    setIsDragging(true);
  };

  const handleResizeStop = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <GridLayout
        className="layout h-full"
        layout={layouts}
        cols={GRID_COLS}
        rowHeight={rowHeight}
        width={containerWidth}
        maxRows={GRID_ROWS}
        autoSize={false}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".window-header"
        draggableCancel=".no-drag"
        compactType={null}
        preventCollision={false}
        isBounded={true}
        useCSSTransforms={true}
        margin={[8, 8]}
        containerPadding={[8, 8]}
        resizeHandles={['se', 's', 'e']}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        {windows.map(window => (
          <div key={window.id}>
            <WindowFrame window={window} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
