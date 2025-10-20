'use client';

import { useWindows } from '@/context/WindowContext';
import GridLayout, { Layout } from 'react-grid-layout';
import { WindowFrame } from './WindowFrame';
import { useState, useEffect, useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export function WorkspaceGrid() {
  const { windows, updateLayout } = useWindows();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Debounce resize events for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateWidth, 100);
    };

    // Initial width
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Convert window layouts to react-grid-layout format
  const layouts: Layout[] = windows.map(window => ({
    i: window.id,
    x: window.layout.x,
    y: window.layout.y,
    w: window.layout.w,
    h: window.layout.h,
    minW: window.layout.minW || 3,
    minH: window.layout.minH || 2,
  }));

  const handleLayoutChange = (newLayout: Layout[]) => {
    updateLayout(newLayout);
  };

  return (
    <div ref={containerRef} className="h-full w-full p-2 bg-slate-950">
      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={80}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".window-header"
        compactType={null}
        preventCollision={false}
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
