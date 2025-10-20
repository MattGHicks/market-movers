# Interactive Tables - Technical Documentation

**Version:** v0.4.1
**Date:** 2025-10-20
**Phase:** 2 - Interactive Tables

## Overview

This document covers the technical implementation of interactive table features added in Phase 2 of the UI/UX improvement project. These features transform static scanner tables into professional-grade, interactive data grids inspired by Trade Ideas and other industry-leading platforms.

## Features Delivered

### 1. Three-State Column Sorting
- Click any column header to sort data
- Cycle: null → ascending → descending → null
- Visual indicators (↑↓) show active sort state
- Sorts numbers and strings appropriately

### 2. Column Resizing
- Drag column borders to adjust widths
- Minimum width enforcement (50px)
- Smooth resize with cursor feedback
- Width state persists during session

### 3. Configurable Refresh Rates
- Dropdown selector: 5s, 10s, 30s, 1m
- Freeze/Resume button to pause auto-refresh
- Manual refresh button for instant updates
- Visual feedback (yellow highlight when frozen)

### 4. Flash Animations
- Green flash on price increase
- Red flash on price decrease
- Blue flash on volume change
- 600ms animation duration

## Architecture

### Custom Hooks Pattern

All interactive features are implemented as reusable custom hooks, following React best practices:

```
hooks/
├── useTableSort.ts      # Three-state column sorting
├── useColumnResize.ts   # Drag-to-resize columns
└── useDataFlash.ts      # Change detection & animations
```

This architecture provides:
- **Separation of concerns** - UI logic separate from business logic
- **Reusability** - Hooks can be used in any table component
- **Testability** - Easy to unit test in isolation
- **Type safety** - Full TypeScript generics support

## Implementation Details

### useTableSort Hook

**File:** `hooks/useTableSort.ts`
**Purpose:** Manage three-state column sorting logic

#### Interface

```typescript
interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

export function useTableSort<T>(
  data: T[] | undefined,
  defaultKey?: keyof T
): {
  sortedData: T[] | undefined;
  sortState: SortState;
  handleSort: (columnKey: string) => void;
}
```

#### State Machine

The sorting follows a three-state cycle:

```
null (unsorted) → asc (ascending) → desc (descending) → null
```

**Implementation:**
```typescript
const handleSort = (columnKey: string) => {
  setSortState((prev) => {
    if (prev.column === columnKey) {
      // Same column - cycle through states
      if (prev.direction === null) return { column: columnKey, direction: 'asc' };
      if (prev.direction === 'asc') return { column: columnKey, direction: 'desc' };
      return { column: null, direction: null }; // Back to unsorted
    }
    // New column - start at ascending
    return { column: columnKey, direction: 'asc' };
  });
};
```

#### Sorting Logic

Uses `useMemo` for performance optimization:

```typescript
const sortedData = useMemo(() => {
  if (!data || !sortState.column || !sortState.direction) return data;

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortState.column as keyof T];
    const bVal = b[sortState.column as keyof T];

    // Handle null/undefined
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Number comparison
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // String comparison
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortState.direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return sorted;
}, [data, sortState.column, sortState.direction]);
```

#### Usage in Components

```typescript
const { sortedData, sortState, handleSort } = useTableSort(stocks);

// In table header
<th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
  Price
  {sortState.column === 'price' && (
    <span>{sortState.direction === 'asc' ? '↑' : '↓'}</span>
  )}
</th>

// Render sorted data
{sortedData?.map(stock => <tr>...</tr>)}
```

### useColumnResize Hook

**File:** `hooks/useColumnResize.ts`
**Purpose:** Handle column width resizing via drag

#### Interface

```typescript
export function useColumnResize(
  initialColumns: ColumnConfig[]
): {
  columns: ColumnConfig[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
  handleResizeStart: (e: React.MouseEvent, column: ColumnConfig) => void;
}
```

#### Mouse Event Handling

The hook uses the standard drag pattern with mouse events:

```typescript
const handleResizeStart = useCallback((e: React.MouseEvent, column: ColumnConfig) => {
  e.preventDefault();
  e.stopPropagation(); // Don't trigger column sort

  // Store initial state
  resizingColumn.current = column.id;
  startX.current = e.clientX;
  startWidth.current = column.width;

  // Mouse move handler
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

  // Mouse up handler - cleanup
  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Apply styles and attach listeners
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none'; // Prevent text selection
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}, []);
```

#### Resize Handle UI

```typescript
// In table header cell
<div
  style={{
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '8px',
    cursor: 'col-resize',
  }}
  onMouseDown={(e) => handleResizeStart(e, col)}
  onClick={(e) => e.stopPropagation()} // Don't trigger sort
>
  <div style={{
    width: '1px',
    height: '16px',
    background: 'var(--border-hover)',
  }} />
</div>
```

#### Performance Considerations

- **useCallback** - Prevents unnecessary re-renders
- **Minimum width** - Enforces 50px minimum to prevent UI breaks
- **Event delegation** - Uses document-level listeners for smooth dragging
- **Cleanup** - Removes event listeners on mouseup to prevent memory leaks

### useDataFlash Hook

**File:** `hooks/useDataFlash.ts`
**Purpose:** Track data changes and trigger flash animations

#### Interface

```typescript
type FlashType = 'up' | 'down' | 'volume' | null;

export function useDataFlash(
  data: MarketMover[] | undefined
): {
  getFlashClass: (symbol: string, columnKey: string) => string;
}
```

#### Change Detection

Uses `useRef` to store previous data and detect changes:

```typescript
const previousData = useRef<Map<string, MarketMover>>(new Map());
const [flashingCells, setFlashingCells] = useState<Map<string, FlashType>>(new Map());

useEffect(() => {
  if (!data || data.length === 0) return;

  const newFlashes = new Map<string, FlashType>();

  data.forEach((stock) => {
    const prev = previousData.current.get(stock.symbol);

    if (prev) {
      // Check price changes
      if (prev.price !== stock.price) {
        const flashType = stock.price > prev.price ? 'up' : 'down';
        newFlashes.set(`${stock.symbol}-price`, flashType);
        newFlashes.set(`${stock.symbol}-change`, flashType);
        newFlashes.set(`${stock.symbol}-changePercent`, flashType);
      }

      // Check volume changes
      if (prev.volume !== stock.volume) {
        newFlashes.set(`${stock.symbol}-volume`, 'volume');
      }
    }

    // Update previous data for next comparison
    previousData.current.set(stock.symbol, stock);
  });

  if (newFlashes.size > 0) {
    setFlashingCells(newFlashes);

    // Clear flashing state after animation completes
    const timer = setTimeout(() => {
      setFlashingCells(new Map());
    }, 600); // Match CSS animation duration

    return () => clearTimeout(timer);
  }
}, [data]);
```

#### CSS Animation Mapping

```typescript
const getFlashClass = (symbol: string, columnKey: string): string => {
  const flashType = flashingCells.get(`${symbol}-${columnKey}`);
  if (!flashType) return '';

  switch (flashType) {
    case 'up':
      return 'cell-flash-up';
    case 'down':
      return 'cell-flash-down';
    case 'volume':
      return 'cell-flash-volume';
    default:
      return '';
  }
};
```

#### CSS Animations

Defined in `app/globals.css`:

```css
@keyframes flash-green {
  0%, 100% { background: transparent; }
  50% { background: var(--green-bg); }
}

@keyframes flash-red {
  0%, 100% { background: transparent; }
  50% { background: var(--red-bg); }
}

@keyframes flash-blue {
  0%, 100% { background: transparent; }
  50% { background: var(--blue-bg); }
}

.cell-flash-up {
  animation: flash-green 0.6s ease-out;
}

.cell-flash-down {
  animation: flash-red 0.6s ease-out;
}

.cell-flash-volume {
  animation: flash-blue 0.6s ease-out;
}
```

#### Usage in Components

```typescript
const { getFlashClass } = useDataFlash(sortedData);

// Apply flash class to table cells
<td className={`scanner-cell ${getFlashClass(stock.symbol, 'price')}`}>
  {formatCurrency(stock.price)}
</td>
```

## ScannerWindow Integration

**File:** `components/windows/ScannerWindow.tsx`

### Hook Composition

All three hooks are used together in the component:

```typescript
export function ScannerWindow({ config }: ScannerWindowProps) {
  // State for refresh controls
  const [refreshRate, setRefreshRate] = useState<number>(30000); // Default 30s
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Use column resize hook
  const { columns, setColumns, handleResizeStart } = useColumnResize(
    config?.columns || DEFAULT_SCANNER_COLUMNS
  );

  // Fetch data with configurable refresh
  const { data: gainersData, refetch } = useTopGainers(
    autoRefresh ? refreshRate : undefined
  );

  // Use sorting hook
  const { sortedData, sortState, handleSort } = useTableSort(stocks);

  // Use flash animation hook
  const { getFlashClass } = useDataFlash(sortedData);

  // ... render implementation
}
```

### Toolbar Controls

```typescript
<div className="flex items-center justify-between px-3 py-2">
  <div className="flex items-center gap-3">
    {/* Row count */}
    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
      {sortedData?.length || 0} stocks
    </span>

    {/* Freeze/Resume Button */}
    <button
      onClick={() => setAutoRefresh(!autoRefresh)}
      style={{
        background: autoRefresh ? 'var(--bg-hover)' : 'var(--yellow-bg)',
        color: autoRefresh ? 'var(--text-secondary)' : 'var(--yellow-base)',
      }}
    >
      {autoRefresh ? '⏸ Freeze' : '▶ Resume'}
    </button>

    {/* Refresh Rate Selector */}
    <select
      value={refreshRate}
      onChange={(e) => setRefreshRate(Number(e.target.value))}
      disabled={!autoRefresh}
    >
      <option value={5000}>5s</option>
      <option value={10000}>10s</option>
      <option value={30000}>30s</option>
      <option value={60000}>1m</option>
    </select>

    {/* Manual Refresh */}
    <button onClick={() => refetch()}>
      🔄 Refresh
    </button>
  </div>

  {/* Columns Button */}
  <button onClick={() => setShowColumnConfig(!showColumnConfig)}>
    Columns
  </button>
</div>
```

### Table Implementation

```typescript
<table className="scanner-table">
  <thead>
    <tr>
      {visibleColumns.map(col => (
        <th
          key={col.id}
          className="scanner-header"
          style={{
            width: col.width,
            position: 'relative',
            cursor: col.sortable !== false ? 'pointer' : 'default',
          }}
          onClick={() => col.sortable !== false && handleSort(col.key as string)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{col.label}</span>

            {/* Sort indicator */}
            {col.sortable !== false && sortState.column === col.key && (
              <span style={{ marginLeft: '4px', fontSize: '10px' }}>
                {sortState.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>

          {/* Resize handle */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '8px',
              cursor: 'col-resize',
            }}
            onMouseDown={(e) => handleResizeStart(e, col)}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '1px',
              height: '16px',
              background: 'var(--border-hover)',
            }} />
          </div>
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {sortedData && sortedData.map((stock) => (
      <tr key={stock.symbol} className="scanner-row">
        {visibleColumns.map(col => {
          const flashClass = getFlashClass(stock.symbol, col.key as string);
          return (
            <td key={col.id} className={`scanner-cell ${flashClass}`}>
              {formatValue(stock[col.key as keyof MarketMover], col.format, col.colorCode)}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>
```

## Performance Optimizations

### 1. useMemo for Sorting
- Sorting only recalculates when data or sort state changes
- Prevents unnecessary re-renders on every render cycle

### 2. useCallback for Event Handlers
- Resize handler memoized to prevent recreation
- Stable reference prevents child re-renders

### 3. Map for Flash State
- O(1) lookup time for flash classes
- More efficient than array searching

### 4. Timeout Cleanup
- Flash states cleared after animation completes
- Prevents memory accumulation

### 5. Conditional Rendering
- Only render sort indicators when active
- Minimize DOM elements

### 6. Event Delegation
- Document-level listeners for mouse move/up
- Better performance than per-column listeners

## React Query Integration

### Configurable Refresh Rates

```typescript
const { data, refetch } = useTopGainers(
  autoRefresh ? refreshRate : undefined
);
```

**Key Points:**
- Pass `undefined` to React Query when frozen (disables polling)
- Pass refresh rate in milliseconds when active
- Manual `refetch()` works regardless of auto-refresh state

### Refetch Behavior

```typescript
// Manual refresh button
<button onClick={() => refetch()}>🔄 Refresh</button>

// This triggers immediate refetch, even if polling is disabled
```

## Testing with Playwright

### Test Cases Verified

1. **Column Sorting**
   - Clicked column headers to verify sort indicators
   - Confirmed three-state cycle (null → asc → desc → null)
   - Tested with numeric and string columns

2. **Column Resizing**
   - Dragged column borders to resize
   - Verified minimum width enforcement
   - Checked cursor changes to `col-resize`

3. **Refresh Controls**
   - Tested Freeze/Resume button visual state
   - Verified dropdown selector options
   - Confirmed manual refresh button works

4. **Flash Animations**
   - Observed price change flashes (green/red)
   - Checked animation timing (600ms)

### Playwright Test Script Example

```typescript
// Navigate to app
await page.goto('http://localhost:3000');

// Create scanner window
await page.click('button:has-text("New")');
await page.click('text=Top Gainers Scanner');

// Test sorting
await page.click('th:has-text("Price")');
const sortIndicator = await page.locator('th:has-text("Price") span').textContent();
expect(sortIndicator).toBe('↑'); // Ascending

// Test freeze button
await page.click('button:has-text("Freeze")');
const frozenButton = await page.locator('button:has-text("Resume")');
expect(frozenButton).toBeVisible();

// Test refresh rate selector
await page.selectOption('select', '10000');
const selectedValue = await page.locator('select').inputValue();
expect(selectedValue).toBe('10000');
```

## Known Issues and Limitations

### Current Limitations

1. **Column widths not persisted**
   - Widths reset on window close/reopen
   - Future: Save to workspace config

2. **Sort state not persisted**
   - Sorting resets when scanner data refreshes
   - Future: Maintain sort state across refreshes

3. **Flash animations on initial load**
   - All cells flash on first data load
   - Future: Skip flash for initial data

4. **No multi-column sorting**
   - Can only sort by one column at a time
   - Future: Shift+click for secondary sort

### Workarounds

1. **Width Persistence**: Use column configuration to set default widths
2. **Sort Persistence**: Re-apply sort after each refresh (requires state management)
3. **Initial Flash**: Add flag to skip flash on first render

## Future Enhancements

### Planned for v0.5.0

1. **Advanced Sorting**
   - Multi-column sorting (Shift+click)
   - Custom sort functions per column
   - Sort persistence across refreshes

2. **Column Management**
   - Save custom column layouts
   - Drag-to-reorder columns
   - Column width presets

3. **Enhanced Animations**
   - Configurable flash duration
   - Different flash styles (pulse, fade, slide)
   - Disable flash option in settings

4. **Performance**
   - Virtual scrolling for 1000+ rows
   - Debounced resize updates
   - Web Worker for sorting large datasets

5. **Keyboard Shortcuts**
   - Arrow keys for navigation
   - Space to freeze/resume
   - 'R' to refresh
   - '/' for search within table

## Best Practices

### When Using These Hooks

1. **Always memoize data**: Use `useMemo` for expensive transformations
2. **Clean up event listeners**: Remove listeners in cleanup functions
3. **Handle undefined data**: Check for null/undefined before operations
4. **Prevent event bubbling**: Use `stopPropagation()` for nested handlers
5. **Type your columns**: Use TypeScript generics for type safety

### Example: Adding to New Component

```typescript
import { useTableSort } from '@/hooks/useTableSort';
import { useColumnResize } from '@/hooks/useColumnResize';
import { useDataFlash } from '@/hooks/useDataFlash';

function MyCustomTable({ data }: { data: MyDataType[] }) {
  // Set up columns
  const initialColumns = [
    { id: 'name', label: 'Name', key: 'name', width: 150, visible: true },
    { id: 'value', label: 'Value', key: 'value', width: 100, visible: true },
  ];

  // Use hooks
  const { columns, handleResizeStart } = useColumnResize(initialColumns);
  const { sortedData, sortState, handleSort } = useTableSort(data);
  const { getFlashClass } = useDataFlash(sortedData);

  // Render table
  return (
    <table>
      <thead>
        {/* Headers with sort and resize */}
      </thead>
      <tbody>
        {sortedData?.map(row => (
          <tr>
            {columns.map(col => (
              <td className={getFlashClass(row.id, col.key)}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Code Statistics

### Files Created
- `hooks/useTableSort.ts` - 82 lines
- `hooks/useColumnResize.ts` - 56 lines
- `hooks/useDataFlash.ts` - 70 lines
- Total: **208 lines** of new hook code

### Files Modified
- `components/windows/ScannerWindow.tsx` - 319 lines (was 180 lines)
- `app/globals.css` - Added 35 lines for animations
- Total: **~175 lines** of integration code

### Total Impact
- **383 lines** of new/modified code
- **3 reusable hooks**
- **7 interactive features** delivered

## References

### Related Documentation
- [UI/UX Improvements Design Doc](../design/ui_ux_improvements_v0.4.0.md)
- [Workspace System](./workspace_system.md)
- [Theme System](./theme_system.md)

### External Resources
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React Query](https://tanstack.com/query/latest)

---

**Last Updated:** 2025-10-20
**Author:** Claude Code
**Version:** v0.4.1
