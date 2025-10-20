# Window Resize System

**Feature Type:** UX Enhancement
**Version:** v0.4.2
**Date:** 2025-10-20
**Status:** ✅ Implemented

## Overview

Enhanced the window resize system to provide professional, Trade-Ideas style window manipulation with edge-based resizing, automatic viewport fitting, and intuitive visual feedback.

## Problem Statement

**Original Issue:**
- Windows could only be resized from the bottom-right corner
- Manual window stacking didn't automatically fit the viewport
- Users had to manually resize windows to fill available space
- No visual feedback when hovering over resize handles

**User Experience Impact:**
- Tedious window arrangement requiring multiple resize operations
- Wasted viewport space with gaps between windows
- Unclear where to grab to resize windows
- Professional traders expect edge-based resizing like Trade-Ideas

## Solution

### 1. Edge-Based Resize Handles

Added three resize handle types for professional window manipulation:

**Resize Options:**
- **Southeast (se)** - Bottom-right corner: resize both width and height
- **East (e)** - Right edge: resize width only
- **South (s)** - Bottom edge: resize height only

**Visual Feedback:**
- Transparent handles on all resize zones
- Blue highlight (rgba(59, 130, 246, 0.2)) on hover
- Appropriate cursors: `se-resize`, `ew-resize`, `ns-resize`
- 8px wide/tall hit zones for easy grabbing

### 2. Auto-Resize for Stacked Windows

Intelligent viewport fitting when windows are added or removed:

**Detection Logic:**
- Identifies vertically stacked windows by unique Y positions
- Calculates available viewport height (viewport - menu bar - padding - margins)
- Divides height equally among stacked rows
- Maintains minimum height of 3 rows per window

**Trigger Points:**
- Adding a new window: All windows auto-resize to fit
- Removing a window: Remaining windows expand to fill space
- Ensures no wasted vertical space

### 3. Default 5-Window Layout

Replaced empty workspace with professional default layout:

**Layout Structure:**
```
┌──────────┬──────────┬──────────┐
│  Gainers │  Losers  │  Active  │  Top row (50% viewport)
│  4 cols  │  4 cols  │  4 cols  │
├───────────────┬──────────────────┤
│  Market News  │     Alerts       │  Bottom row (50% viewport)
│   6 cols      │     6 cols       │
└───────────────┴──────────────────┘
```

**Default Windows:**
1. **Top Gainers Scanner** (x: 0, w: 4) - Pre-configured with 5 columns
2. **Top Losers Scanner** (x: 4, w: 4) - Matching column setup
3. **Most Active Scanner** (x: 8, w: 4) - Volume leaders
4. **Market News** (x: 0, w: 6) - Real-time news feed
5. **Alerts** (x: 6, w: 6) - Alert notifications

**Dynamic Sizing:**
- Calculates optimal height on load based on viewport
- Top row: 50% of available rows
- Bottom row: Remaining 50%
- Adapts to different screen sizes automatically

### 4. News Flame Indicator Position

Moved news flame indicators from left to right of ticker symbols:

**Before:** `🔥 AAPL`
**After:** `AAPL 🔥`

**Rationale:**
- Better visual flow: read symbol first, then see indicator
- Cleaner alignment in sorted lists
- Matches industry standards (Trade-Ideas, Bloomberg)
- Flame doesn't interfere with quick symbol scanning

## Technical Implementation

### File Changes

#### `app/globals.css` (Lines 273-300)
Added edge resize handle styles:

```css
/* Edge resize handles */
.react-resizable-handle-e {
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  background: transparent;
  transition: background 150ms ease;
}

.react-resizable-handle-e:hover {
  background: rgba(59, 130, 246, 0.2);
}

.react-resizable-handle-s {
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  cursor: ns-resize;
  background: transparent;
  transition: background 150ms ease;
}

.react-resizable-handle-s:hover {
  background: rgba(59, 130, 246, 0.2);
}
```

#### `components/WorkspaceGrid.tsx` (Line 97)
Enabled multiple resize handles:

```typescript
<GridLayout
  // ... other props
  resizeHandles={['se', 's', 'e']}  // Corner + edges
  // ... other props
>
```

#### `context/WindowContext.tsx` (Lines 25-150, 224-263, 267-304)

**Default Layout Initialization:**
```typescript
const getOptimalHeight = () => {
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const menuBarHeight = 60;
  const rowHeight = 80;
  const padding = 16;
  const margin = 16;
  const availableHeight = viewportHeight - menuBarHeight - padding - margin;
  const totalRows = Math.floor(availableHeight / rowHeight);

  const topRowHeight = Math.floor(totalRows / 2);
  const bottomRowHeight = totalRows - topRowHeight;

  return { topRowHeight, bottomRowHeight };
};
```

**Auto-Resize in `addWindow()`:**
```typescript
// Auto-resize windows to fit viewport height
const yPositions = [...new Set(allWindows.map(w => w.layout.y))].sort((a, b) => a - b);

if (yPositions.length > 1) {
  // Windows are stacked - resize to fit
  const rowsPerWindow = Math.floor(totalRows / yPositions.length);
  const finalRows = Math.max(rowsPerWindow, minRows);

  return allWindows.map(w => {
    const yIndex = yPositions.indexOf(w.layout.y);
    return {
      ...w,
      layout: { ...w.layout, y: yIndex * finalRows, h: finalRows },
    };
  });
}
```

**Auto-Resize in `removeWindow()`:**
Same logic applied when removing windows to expand remaining ones.

#### `components/windows/ScannerWindow.tsx` (Lines 343-347)
Moved flame indicators after ticker:

```typescript
<td key={col.id} className={`scanner-cell ${flashClass}`}>
  {formatValue(stock[col.key as keyof MarketMover], col.format, col.colorCode)}
  {isSymbolColumn && hasRecentNews && <span className="ml-1" style={{ filter: 'hue-rotate(0deg)' }}>🔥</span>}
  {isSymbolColumn && !hasRecentNews && hasDayOldNews && <span className="ml-1" style={{ filter: 'hue-rotate(200deg)' }}>🔥</span>}
</td>
```

## User Experience

### Before
1. **Empty workspace** on first load - must manually create windows
2. **Corner-only resize** - can only drag bottom-right corner
3. **Manual stacking** - must manually resize each window to fit viewport
4. **No visual feedback** - unclear where resize zones are
5. **Flame position** - `🔥 AAPL` interfered with symbol scanning

### After
1. **Pre-configured layout** - 5 windows ready to use immediately
2. **Edge resize** - drag any edge or corner for precise control
3. **Auto-fit viewport** - windows automatically expand to fill space
4. **Hover highlighting** - blue glow shows resize zones
5. **Flame position** - `AAPL 🔥` cleaner symbol scanning

## Benefits

### For Professional Traders
- **Faster setup** - Default layout matches common trading scenarios
- **Efficient window management** - Edge resizing like Trade-Ideas
- **No wasted space** - Auto-resize ensures full viewport usage
- **Quick scanning** - Flame indicators don't interfere with ticker reading

### For Development
- **Reusable patterns** - Auto-resize logic works for any window arrangement
- **Flexible defaults** - Easy to modify default layout
- **CSS-based feedback** - No JavaScript overhead for hover effects
- **Type-safe** - TypeScript ensures layout calculations are correct

## Edge Cases Handled

1. **Single row of windows** - No auto-resize applied (unnecessary)
2. **Minimum height constraint** - Windows never smaller than 3 rows
3. **Server-side rendering** - Falls back to 800px viewport for initial calculation
4. **Rapid add/remove** - State updates are batched correctly
5. **Very small viewports** - Minimum heights enforced for usability

## Future Enhancements

### Potential Improvements
- [ ] Save user's custom resize preferences per workspace
- [ ] Double-click edge to auto-fit to content
- [ ] Snap-to-grid when resizing (optional setting)
- [ ] Visual guides when dragging (alignment lines)
- [ ] Keyboard shortcuts for window arrangement (Ctrl+Arrow)
- [ ] Quick layouts: "2x2 Grid", "3 Columns", "Stacked"

### Related Features
- [ ] Window maximize/minimize animations
- [ ] Window focus indicators (subtle border)
- [ ] Window z-index management (click to front)
- [ ] Window snap zones (drag to edge = fullscreen)

## Testing Checklist

- [x] Corner resize (se) works in both directions
- [x] Right edge resize (e) changes width only
- [x] Bottom edge resize (s) changes height only
- [x] Hover shows blue highlight on all handles
- [x] Auto-resize triggers when adding window
- [x] Auto-resize triggers when removing window
- [x] Default layout fills entire viewport
- [x] Default layout adapts to different screen sizes
- [x] Flame indicators appear after ticker symbol
- [x] Red flame for news <1hr old
- [x] Blue flame for news 1-24hr old
- [x] No flame for news >24hr old or no news

## Performance Considerations

**CSS Optimizations:**
- Hardware-accelerated transitions (150ms ease)
- Minimal repaints (only on hover/resize)
- No JavaScript hover handlers (pure CSS)

**React Optimizations:**
- `useCallback` for resize handlers to prevent re-renders
- Debounced viewport calculations (100ms)
- Memoized window position calculations

**API Impact:**
- No additional API calls for resize features
- Auto-resize happens entirely client-side
- News flame checks cached (2-minute intervals)

## Lessons Learned

1. **Edge handles are essential** - Users expect to resize from any edge, not just corners
2. **Auto-fit is powerful** - Traders don't want to manually resize after every window add/remove
3. **Default layouts matter** - Empty workspace is intimidating; pre-configured layout shows possibilities
4. **Visual feedback is critical** - Hover effects make resize zones discoverable
5. **Flame positioning impacts UX** - Indicators should enhance, not interfere with primary data

## Related Documentation

- [Workspace System](/docs/claude/features/workspace_system.md) - Overall window management
- [News Flame Indicators](/docs/claude/features/news_flame_indicators.md) - News age indicators
- [Interactive Tables](/docs/claude/features/interactive_tables.md) - Table features
- [UX Improvements v0.4.0](/docs/claude/design/ui_ux_improvements_v0.4.0.md) - Design decisions

## References

**Industry Inspiration:**
- Trade-Ideas: Multi-edge resize handles, auto-fit viewport
- Think or Swim: Edge-based window manipulation
- Bloomberg Terminal: Snap-to-grid layouts
- Finviz Elite: Default workspace configurations

**Technical References:**
- [react-grid-layout docs](https://github.com/react-grid-layout/react-grid-layout) - `resizeHandles` prop
- [CSS resize cursors](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) - Standard cursor types
- [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions) - Smooth hover effects
