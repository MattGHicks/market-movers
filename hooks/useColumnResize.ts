import { useState, useCallback, useRef } from 'react';
import { ColumnConfig } from '@/types/windows';

/**
 * Hook for managing column resizing and reordering via drag handles
 */
export function useColumnResize(initialColumns: ColumnConfig[]) {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const resizingColumn = useRef<string | null>(null);
  const draggingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleResizeStart = useCallback((e: React.MouseEvent, column: ColumnConfig) => {
    e.preventDefault();
    e.stopPropagation();

    resizingColumn.current = column.id;
    startX.current = e.clientX;
    startWidth.current = column.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColumn.current) return;

      const diff = moveEvent.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + diff); // Min 50px

      setColumns((cols) =>
        cols.map((col) =>
          col.id === resizingColumn.current
            ? { ...col, width: newWidth }
            : col
        )
      );
    };

    const handleMouseUp = () => {
      resizingColumn.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleColumnDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    draggingColumn.current = columnId;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggingColumn.current || draggingColumn.current === targetColumnId) {
      draggingColumn.current = null;
      return;
    }

    setColumns((cols) => {
      const dragIndex = cols.findIndex(col => col.id === draggingColumn.current);
      const dropIndex = cols.findIndex(col => col.id === targetColumnId);

      if (dragIndex === -1 || dropIndex === -1) return cols;

      const newCols = [...cols];
      const [draggedCol] = newCols.splice(dragIndex, 1);
      newCols.splice(dropIndex, 0, draggedCol);

      return newCols;
    });

    draggingColumn.current = null;
  }, []);

  return {
    columns,
    setColumns,
    handleResizeStart,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
  };
}
