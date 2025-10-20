import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

/**
 * Hook for managing table sorting with three-state cycle (asc -> desc -> none)
 */
export function useTableSort<T>(data: T[] | undefined, defaultKey?: keyof T) {
  const [sortState, setSortState] = useState<SortState>({
    column: defaultKey ? String(defaultKey) : null,
    direction: null,
  });

  const handleSort = (columnKey: string) => {
    setSortState((prev) => {
      if (prev.column === columnKey) {
        // Cycle through: null -> asc -> desc -> null
        if (prev.direction === null) {
          return { column: columnKey, direction: 'asc' };
        } else if (prev.direction === 'asc') {
          return { column: columnKey, direction: 'desc' };
        } else {
          return { column: null, direction: null };
        }
      } else {
        // New column, start with asc
        return { column: columnKey, direction: 'asc' };
      }
    });
  };

  const sortedData = useMemo(() => {
    if (!data || !sortState.column || !sortState.direction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = (a as any)[sortState.column as string];
      const bVal = (b as any)[sortState.column as string];

      // Handle undefined/null values
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Numeric comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortState.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return sorted;
  }, [data, sortState.column, sortState.direction]);

  return {
    sortedData,
    sortState,
    handleSort,
  };
}
