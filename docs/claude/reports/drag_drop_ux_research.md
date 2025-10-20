# Dashboard Drag-and-Drop & Window Management UX Research

**Date:** 2025-10-20
**Purpose:** Research best practices for drag-and-drop UX from professional platforms
**Target Application:** Market Movers workspace system (react-grid-layout)

---

## Executive Summary

This research analyzes drag-and-drop and window management UX patterns from leading professional platforms (TradingView, Notion, Figma, Grafana, Tableau) to identify best practices for improving the Market Movers workspace system. The findings reveal 8 key UX patterns, 12 specific technical solutions, and actionable recommendations for react-grid-layout configuration.

**Key Takeaways:**
1. Visual feedback during drag operations is critical for user confidence
2. Grid snapping with magnetic effects creates professional, polished experiences
3. Boundary constraints prevent windows from being lost off-screen
4. Accessibility (keyboard navigation) is essential, not optional
5. Performance optimization through debouncing/throttling is a must

---

## 1. Platform Analysis

### 1.1 TradingView - Workspace Management

**Key Features:**
- Customizable workspace with drag-and-drop for charts, indicators, and watchlists
- Multi-chart layouts allow multiple charts in workspace to maximize analysis
- Quick management of Stop Loss/Take Profit levels by dragging lines directly on charts
- Chart layouts save look, fill, design, settings, and drawings as reusable workspaces

**UX Patterns:**
- **Direct Manipulation:** Elements respond immediately to drag actions (SL/TP lines)
- **Layout Persistence:** Saved layouts include complete workspace state
- **Visual Consistency:** Drag handles and indicators use consistent styling
- **Real-World Mimicry:** Drag-and-drop mimics physical movement of trading tools

**Lesson for Market Movers:** Save complete window configurations including filters, column settings, and scroll positions - not just layout coordinates.

---

### 1.2 Notion - Block-Based Interface

**Key Features:**
- Six-dot icon (⋮⋮) consistently signals moveable elements
- Line indicator shows exactly where dragged item will be placed
- Consistent drag-and-drop builds strong mental model of customization
- Almost every component can be manipulated: blocks, table rows, gallery cards, dividers
- Flexible column layouts with adjustable widths via drag-and-drop

**UX Patterns:**
- **Progressive Disclosure:** Drag handles appear on hover, reducing visual clutter
- **Visual Placement Indicator:** Blue line shows insertion point during drag
- **Consistent Affordances:** Six-dot handle used universally across all draggable items
- **Stylus Support:** Optimized for both mouse and touch/stylus interactions
- **Fluid Layout:** Blocks can be dragged beside each other for multi-column layouts

**Lesson for Market Movers:** Implement clear visual indicators (line/highlight) showing where window will snap when dropped. Consider hover-only drag handles to reduce chrome.

---

### 1.3 Figma/FigJam - Canvas Interactions

**Key Features:**
- Free-form canvas allows unrestricted element movement
- Smart Animate provides smooth transitions between states
- "On Drag" interactions with configurable animation types
- Users can build diagrams and move elements freely across canvas
- Drag-and-drop supported across plugin windows and main canvas

**UX Patterns:**
- **Infinite Canvas:** No fixed grid constraints, maximum flexibility
- **Animation Smoothness:** requestAnimationFrame ensures 60fps drag operations
- **Multi-Select Drag:** Drag multiple selected items simultaneously
- **Snap-to-Object:** Elements snap to align with nearby objects (alignment guides)

**Lesson for Market Movers:** While grid-based, consider optional "free mode" for power users. Implement alignment guides when dragging near grid boundaries.

---

### 1.4 Grafana - Dashboard Editing

**Key Features:**
- SceneGridLayout with 24-column grid system
- `isDraggable` and `isLazy` properties control grid behavior
- Dashboard auto-layout organizes panels efficiently
- Rows group related panels with collapsible sections
- JSON model stores gridPos (x, y, w, h) for each panel

**UX Patterns:**
- **Lazy Loading:** Panels outside viewport not initialized until needed (performance)
- **Auto-Organization:** Panels automatically adjust to fill space efficiently
- **Row Grouping:** Logical grouping prevents overwhelming single-level layouts
- **Predictable Grid:** 24 columns provide fine-grained positioning control
- **Planning First:** Emphasizes upfront planning to avoid cluttered dashboards

**Best Practices:**
- Place most important panels at top
- Use rows/columns to group related content
- Don't dive into creating panels without a layout plan
- Avoid changing gridPos width manually (use maxPerRow instead)

**Lesson for Market Movers:** Implement "lazy loading" for window content to improve performance. Consider "row" concept for grouping related windows.

---

### 1.5 Tableau - Dashboard Builder

**Key Features:**
- Drag-and-drop for adding charts, trends, graphs
- Show/hide containers for overlaying instructions
- Transparent overlays for clickable areas
- Auto-deselect techniques for button interactions
- Vertical KPI positioning (left side) instead of horizontal

**UX Patterns:**
- **Widescreen Optimization:** Vertical layouts utilize modern monitor aspect ratios better
- **Layered Interactions:** Transparent overlays enable complex click targets
- **User Onboarding:** Overlay instructions help orient new users
- **UI Kit Approach:** Pre-designed elements speed up dashboard creation

**Lesson for Market Movers:** Consider vertical toolbar/palette for window types. Implement welcome overlay with drag-and-drop tutorial for first-time users.

---

## 2. Key UX Patterns Identified

### 2.1 Grid Snapping Behavior

#### Magnetic Snap
- **Best Practice:** Simulate "magnetic effect" that snaps objects into place
- **Animation:** 100ms transition into final position creates satisfying feedback
- **Threshold:** 10-15% of grid size is optimal snap threshold
- **Visual Guides:** Red guides appear showing snap targets and pixel distances

#### Implementation Approaches
```javascript
// Magnetic snap with animation
const snapThreshold = gridSize * 0.15; // 10-15% threshold
if (distanceToGrid < snapThreshold) {
  animateToPosition(targetPosition, 100); // 100ms transition
}
```

#### Alignment Guides
- **When to Show:** During drag operations, when near alignment with other windows
- **What to Show:** Vertical/horizontal lines indicating alignment opportunities
- **Style:** Subtle, high-contrast color (often red or blue)
- **Snap Distance:** Typically 5-10px from perfect alignment

**Recommendation for Market Movers:**
- Enable magnetic snapping with 100ms animation
- Show alignment guides when windows are within 10px of alignment
- Use blue guides (matching accent color) during drag operations

---

### 2.2 Preventing Windows Lost Off-Screen

#### Boundary Detection Methods

**1. Hard Boundaries (Recommended)**
- Constrain drag position to viewport dimensions
- Prevent windows from moving beyond visible area
- Allow slight overhang for edge snapping (e.g., 20px)

```javascript
// Boundary constraint example
const constrainedX = Math.max(0, Math.min(x, viewportWidth - windowWidth));
const constrainedY = Math.max(0, Math.min(y, viewportHeight - windowHeight));
```

**2. Window Recovery Features**
- "Cascade Windows" menu option to reorganize off-screen windows
- "Reset Layout" button to restore default positions
- Arrow key navigation to move focused window back into view

**3. Visual Indicators**
- Red border flash when hitting boundary
- Cursor change when at edge (blocked cursor icon)
- Sound feedback (optional, use sparingly)

**Current Issue in Market Movers:**
- react-grid-layout uses grid coordinates, not absolute pixels
- Windows can't technically go "off-screen" due to grid constraints
- However, on small viewports, windows can be hidden below fold

**Recommendation:**
- Add `isBounded: true` to react-grid-layout config
- Implement responsive breakpoints for mobile (single column)
- Add "Fit All Windows" menu option to auto-resize to visible area

---

### 2.3 Visual Feedback During Drag Operations

#### Ghost Image
- **Definition:** Translucent copy of element that follows cursor during drag
- **Default Behavior:** Browser auto-generates ghost from drag target
- **Customization:** Use `DataTransfer.setDragImage()` for custom ghost

**Best Practices:**
- **Opacity:** 0.7-0.8 for ghost element
- **Z-Index:** Ensure ghost appears above all other elements (z-index: 1000+)
- **Cursor:** Change to "grabbing" (cursor: grabbing) during drag
- **Shadow:** Add drop shadow to ghost for elevation effect

#### Placeholder Element
- **Purpose:** Shows original position of dragged element
- **Style:** Dotted border or reduced opacity (0.3-0.5)
- **Behavior:** Remains in place during drag, removed on drop
- **Animation:** Animate placeholder collapse if drop location changes

#### Drop Zone Indicators
**Visual States:**
1. **Idle:** Normal appearance
2. **Hover (Invalid):** Red border or "prohibited" cursor
3. **Hover (Valid):** Green border or highlight effect
4. **Active Drop:** Pulsing animation or solid highlight

**Feedback Examples:**
- **Dotted border** around valid drop zone
- **Highlight** background color (subtle, 10% opacity)
- **+ Icon** in corner of ghost image when over valid target
- **Animation** showing snap-into-place preview

#### Animation Timing
- **Immediate:** 0ms - Cursor change, ghost creation
- **Quick:** 100ms - Snap animations, drop zone highlights
- **Smooth:** 200ms - Element repositioning, layout shifts
- **Slow:** 300ms - Invalid drop "bounce back" animation

**Current State in Market Movers:**
- Basic opacity change (0.8) during drag
- No custom ghost image
- No drop zone indicators
- 200ms transition for repositioning

**Recommendations:**
1. Add dotted border placeholder at original position
2. Implement subtle grid cell highlight for valid drop zones
3. Add "snap preview" animation showing final position before drop
4. Change cursor to "grabbing" during active drag

---

### 2.4 Resize Handles & Size Constraints

#### Handle Placement
**Standard Positions:**
- **SE (Southeast):** Bottom-right corner - primary handle
- **E (East):** Right edge - horizontal resize only
- **S (South):** Bottom edge - vertical resize only
- **All Corners:** NE, SE, SW, NW for power users (optional)

**Visual Design:**
- **Size:** 20x20px clickable area (current implementation)
- **Icon:** Two-line corner icon (⌟) or grip dots (⋰)
- **Color:** Subtle gray, brighter on hover
- **Cursor:** Direction-specific resize cursors (se-resize, e-resize, etc.)

#### Size Constraints
**Minimum Sizes:**
- **Purpose:** Prevent windows too small to be usable
- **Calculation:** Based on content minimum viable size
- **Current:** minW: 3 grid units, minH: 2 grid units
- **Recommendation:** Calculate from actual content requirements

```javascript
// Content-based minimum size
const minWidth = {
  scanner: 4, // Needs space for symbol + price + change columns
  news: 3,    // Narrower acceptable for news headlines
  alerts: 2,  // Minimal notification display
};

const minHeight = {
  scanner: 3, // Header + 2 rows minimum
  news: 2,    // Title + 1 item
  alerts: 2,  // Header + 1 alert
};
```

**Maximum Sizes:**
- **General Rule:** Don't restrict maximum size (breaks user expectations)
- **Exception:** On maximize, constrain to viewport dimensions
- **Grid Context:** Max limited by grid columns (12 cols in current setup)

#### Collision Detection During Resize
**react-grid-layout Behavior:**
- With `preventCollision: false` (current): Windows push others out of way
- With `preventCollision: true`: Windows can't resize into occupied space

**Best Practice:**
- Use `preventCollision: false` for fluid, auto-organizing layouts
- Show visual warning when collision would occur (optional)
- Allow overlap if `allowOverlap: true` is set

**Recommendations:**
1. Keep current SE handle, consider adding E and S handles
2. Calculate dynamic minimum sizes based on window type
3. Add visual feedback when attempting to resize below minimum
4. Test collision behavior with `preventCollision: true` for comparison

---

### 2.5 Collision Detection & Window Overlapping

#### React-Grid-Layout Options

**1. preventCollision**
```javascript
preventCollision: boolean = false
```
- **false (default):** Items can push other items out of the way
- **true:** Items cannot move into occupied space
- **Use Case:** Set to `true` for strict grid discipline

**2. allowOverlap**
```javascript
allowOverlap: boolean = false
```
- **false (default):** No overlapping allowed
- **true:** Items can be placed on top of each other
- **Note:** Implies `preventCollision: true`

**3. compactType**
```javascript
compactType: 'vertical' | 'horizontal' | null = 'vertical'
```
- **vertical:** Items compact upward to fill space
- **horizontal:** Items compact leftward
- **null:** No compaction - items stay where placed

**Current Configuration:**
```javascript
compactType={null}
preventCollision={false}
```

**Effect:** Windows stay where placed, can push others, but no auto-compaction.

#### Overlap Strategies

**Strategy 1: No Overlap (Strict Grid)**
```javascript
preventCollision={true}
compactType={null}
```
- Windows cannot move into occupied cells
- User must manually reorganize to make space
- Most predictable but least flexible

**Strategy 2: Auto-Organize (Compact)**
```javascript
preventCollision={false}
compactType="vertical"
```
- Windows automatically fill gaps
- Moving one window triggers cascade of movements
- Can be disorienting for users

**Strategy 3: Push-Away (Current)**
```javascript
preventCollision={false}
compactType={null}
```
- Dragging window pushes others out of way
- No automatic gap-filling
- Balance of flexibility and predictability

**Strategy 4: Layered (Z-Index)**
```javascript
allowOverlap={true}
```
- Windows can overlap freely
- Click brings window to front (z-index management)
- Most flexible but requires good window management UX

**Recommendation:**
- **Keep current:** `preventCollision: false, compactType: null`
- **Add option:** Allow users to toggle between strategies in settings
- **Implement:** Z-index click-to-front regardless of overlap settings

---

### 2.6 Smart Positioning for New Windows

#### Placement Algorithms

**Algorithm 1: Top-Left First Fit**
```javascript
function findFirstAvailablePosition(existingWindows, newWindowSize) {
  const grid = createOccupancyGrid(existingWindows);

  // Scan from top-left
  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < 12; x++) {
      if (canFitAt(grid, x, y, newWindowSize)) {
        return { x, y };
      }
    }
  }

  // If no space, place at bottom
  return { x: 0, y: maxY + 1 };
}
```

**Algorithm 2: Centered Cascade**
```javascript
function cascadePosition(windowCount, baseX = 2, baseY = 1) {
  const offset = windowCount % 5; // Restart cascade every 5 windows
  return {
    x: baseX + offset,
    y: baseY + offset,
  };
}
```

**Algorithm 3: Smart Column Fill**
```javascript
function smartColumnFill(existingWindows, cols = 12) {
  // Try to fill columns evenly
  const columnOccupancy = calculateColumnOccupancy(existingWindows);
  const leastOccupiedColumn = findMinColumn(columnOccupancy);

  return {
    x: leastOccupiedColumn,
    y: getColumnMaxY(leastOccupiedColumn) + 1,
  };
}
```

**Algorithm 4: Context-Aware Placement**
```javascript
function contextAwarePlacement(windowType, existingWindows) {
  // Group similar window types together
  const similarWindows = existingWindows.filter(w => w.type === windowType);

  if (similarWindows.length > 0) {
    // Place near existing similar windows
    const lastSimilar = similarWindows[similarWindows.length - 1];
    return adjacentPosition(lastSimilar.layout);
  } else {
    // Use default algorithm
    return topLeftFirstFit(existingWindows);
  }
}
```

#### Current Implementation Analysis
Looking at workspace_system.md, the current implementation:
- Places new windows at incrementing positions
- Simple cascade pattern
- No collision checking on placement

**Recommendations:**
1. Implement **Top-Left First Fit** as primary algorithm
2. Add **Context-Aware Placement** for grouping similar windows
3. Allow user to override by clicking specific grid cell before creating window
4. Add visual preview showing where window will be placed

---

### 2.7 Z-Index & Layer Management

#### Stacking Context Fundamentals
- **Stacking Context:** Group of elements with common parent, move together on z-axis
- **Z-Index Scope:** Values only compared within same stacking context
- **Global vs Local:** Avoid global z-index numbers, use contextual layers

#### Recommended 7-Layer System

```css
/* Base Layer System */
--z-base: 0;           /* Default page content */
--z-dropdown: 100;     /* Dropdowns, tooltips */
--z-sticky: 200;       /* Sticky headers */
--z-overlay: 300;      /* Overlays, backdrops */
--z-modal: 400;        /* Modal dialogs */
--z-popover: 500;      /* Popovers, toasts */
--z-tooltip: 600;      /* Tooltips (highest) */
```

#### Dashboard-Specific Layers

```css
/* Workspace Layers */
--z-grid-base: 1;          /* Grid background */
--z-window-base: 10;       /* Normal windows */
--z-window-dragging: 100;  /* Window being dragged */
--z-window-focused: 50;    /* Focused window */
--z-menu-bar: 200;         /* Top menu bar */
--z-context-menu: 300;     /* Right-click menus */
--z-modal: 400;            /* Settings modal */
```

#### Click-to-Front Pattern
```javascript
function handleWindowClick(windowId) {
  // Find current max z-index
  const maxZ = Math.max(...windows.map(w => w.zIndex || 0));

  // Set clicked window z-index higher
  updateWindow(windowId, { zIndex: maxZ + 1 });
}

// Optimize: Periodic z-index normalization
function normalizeZIndices() {
  const sortedWindows = windows.sort((a, b) => a.zIndex - b.zIndex);
  sortedWindows.forEach((window, index) => {
    updateWindow(window.id, { zIndex: 10 + index });
  });
}
```

#### Current State Analysis
In `globals.css`:
```css
.react-grid-item.resizing {
  z-index: 100;
}

.react-grid-item.react-draggable-dragging {
  z-index: 100;
}
```

Issues:
- Fixed z-index (100) for all dragging
- No click-to-front functionality
- No focus management

**Recommendations:**
1. Implement dynamic z-index management in WindowContext
2. Add click handler to bring window to front
3. Add visual indicator for focused window (border highlight)
4. Implement z-index normalization to prevent runaway numbers
5. Add layers for future features (modals, menus, tooltips)

---

### 2.8 Accessibility - Keyboard Navigation & ARIA

#### WCAG Requirements
**Success Criterion 2.1.1 - Keyboard:**
- All functionality must be operable via keyboard
- No keyboard traps
- Focus must be visible

**For Drag-and-Drop:**
- Must provide alternative to drag-and-drop
- Or make drag-and-drop keyboard accessible

#### Keyboard Controls

**Navigation:**
- `Tab` - Move between windows
- `Arrow Keys` - Move focused window (when in "move mode")
- `Shift + Arrow` - Resize focused window
- `Enter/Space` - Activate window controls (minimize, maximize, close)
- `Escape` - Cancel drag/resize operation

**Action Modes:**
```
Tab to window → Space to enter "Move Mode" → Arrows to reposition → Enter to confirm
```

#### ARIA Attributes

**Draggable Items:**
```html
<div
  role="article"
  aria-label="Scanner Window - AAPL Movers"
  aria-grabbed="false"
  tabindex="0"
>
```

**During Drag:**
```javascript
element.setAttribute('aria-grabbed', 'true');
element.setAttribute('aria-dropeffect', 'move');
```

**Drop Zones:**
```html
<div
  role="region"
  aria-label="Workspace Grid"
  aria-dropeffect="move"
>
```

**Live Regions (Status Updates):**
```html
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
>
  Window moved to row 2, column 3
</div>
```

#### Alternative Interaction Methods

**Method 1: Arrow Buttons**
```jsx
<div className="window-position-controls">
  <button aria-label="Move up">↑</button>
  <button aria-label="Move down">↓</button>
  <button aria-label="Move left">←</button>
  <button aria-label="Move right">→</button>
</div>
```

**Method 2: Position Input**
```jsx
<div className="window-position-form">
  <label>
    Row: <input type="number" min="0" value={y} onChange={handleYChange} />
  </label>
  <label>
    Column: <input type="number" min="0" max="11" value={x} onChange={handleXChange} />
  </label>
</div>
```

**Method 3: Move-to-Position Menu**
```jsx
<select aria-label="Move window to position">
  <option value="top-left">Top Left</option>
  <option value="top-center">Top Center</option>
  <option value="top-right">Top Right</option>
  {/* ... */}
</select>
```

#### Screen Reader Announcements

**Window Created:**
```
"Scanner window created at row 1, column 0. Press Tab to focus."
```

**Window Moved:**
```
"Scanner window moved to row 2, column 3"
```

**Window Resized:**
```
"Scanner window resized to 4 columns by 3 rows"
```

**Focus Indicators:**
```css
.window-frame:focus-within {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

**Recommendations for Market Movers:**
1. Add `aria-label` to each WindowFrame with descriptive title
2. Implement keyboard navigation for window movement
3. Add arrow button alternative in window header (hidden by default, shown on focus)
4. Create sr-only live region for announcing layout changes
5. Ensure all window controls (minimize, maximize, close) are keyboard accessible
6. Add skip link to jump between windows ("Next Window" button)

---

## 3. React-Grid-Layout Best Practices & Configuration

### 3.1 Core Configuration Options

#### Essential Props

```javascript
<GridLayout
  // Layout
  layout={layouts}              // Array of {i, x, y, w, h, minW, minH, maxW, maxH}
  cols={12}                      // Number of columns
  rowHeight={80}                 // Height of each row in px
  width={containerWidth}         // Container width (use WidthProvider)

  // Behavior
  isDraggable={true}             // Enable dragging
  isResizable={true}             // Enable resizing
  isBounded={false}              // Constrain to container boundaries
  preventCollision={false}       // Prevent items from overlapping
  allowOverlap={false}           // Allow items to overlap
  compactType={'vertical'}       // 'vertical' | 'horizontal' | null

  // Interaction
  draggableHandle={'.window-header'}  // CSS selector for drag handle
  draggableCancel={'.no-drag'}        // CSS selector for non-draggable areas

  // Callbacks
  onLayoutChange={handleLayoutChange}  // Called on every layout change
  onDragStart={handleDragStart}        // Called when drag starts
  onDragStop={handleDragStop}          // Called when drag ends
  onResizeStart={handleResizeStart}    // Called when resize starts
  onResizeStop={handleResizeStop}      // Called when resize ends

  // Performance
  useCSSTransforms={true}        // Use CSS transforms (better performance)
  transformScale={1}             // Scale factor for transforms
>
```

#### Current Configuration Analysis

**WorkspaceGrid.tsx:**
```javascript
<GridLayout
  layout={layouts}
  cols={12}                      // ✓ Good
  rowHeight={80}                 // ✓ Good
  width={containerWidth}         // ✓ Using manual width calculation
  onLayoutChange={handleLayoutChange}
  draggableHandle=".window-header"    // ✓ Good
  compactType={null}             // ✓ No auto-compaction
  preventCollision={false}       // ✓ Allow pushing
>
```

**Strengths:**
- Manual width calculation with debounced resize (100ms)
- Drag handle scoped to window header
- No compaction prevents unexpected moves

**Missing:**
- `isBounded` option (could prevent edge cases)
- Drag/resize lifecycle callbacks (for analytics, undo/redo)
- `useCSSTransforms` not explicitly set (defaults to true)

### 3.2 Performance Optimizations

#### 1. WidthProvider HOC (Alternative to Current Approach)

```javascript
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function WorkspaceGrid() {
  return (
    <ResponsiveGridLayout
      // No need for manual width calculation
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    >
      {children}
    </ResponsiveGridLayout>
  );
}
```

**Pros:**
- Automatic width handling
- Built-in responsive breakpoints
- Less code

**Cons:**
- Less control over resize behavior
- Current manual approach already works well

**Recommendation:** Keep current manual approach for more control, but document WidthProvider as alternative.

#### 2. Memoize Children

```javascript
const windowComponents = useMemo(
  () => windows.map(window => (
    <div key={window.id}>
      <WindowFrame window={window} />
    </div>
  )),
  [windows]
);

return (
  <GridLayout {...props}>
    {windowComponents}
  </GridLayout>
);
```

**Why:** react-grid-layout has optimized `shouldComponentUpdate`, but relies on memoized children array.

#### 3. Debounce Layout Changes

**Current Implementation:**
```javascript
// Debounce resize events for better performance
let resizeTimer: NodeJS.Timeout;
const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateWidth, 100);
};
```

**Additional Optimization:**
```javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedLayoutChange = useDebouncedCallback(
  (layout) => {
    updateLayout(layout);
    saveToLocalStorage(layout); // Only save after user stops dragging
  },
  250
);
```

#### 4. Throttle Drag Updates

```javascript
import { useThrottle } from 'use-throttle';

const handleDrag = (layout, oldItem, newItem, placeholder, e, element) => {
  // Throttle visual updates during drag
  const throttledUpdate = throttle(() => {
    updateDragPreview(newItem);
  }, 16); // 60fps

  throttledUpdate();
};
```

#### 5. requestAnimationFrame for Visual Updates

```javascript
let rafId = null;

const handleLayoutChange = (newLayout) => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    updateLayout(newLayout);
    rafId = null;
  });
};
```

**Recommendation:**
1. Implement children memoization immediately
2. Add debounced localStorage save (250ms)
3. Consider throttling drag updates if performance issues arise
4. Use requestAnimationFrame for visual feedback animations

### 3.3 Responsive Design

#### Breakpoint Strategy

```javascript
const breakpoints = {
  lg: 1200,  // Desktop
  md: 996,   // Laptop
  sm: 768,   // Tablet
  xs: 480,   // Mobile landscape
  xxs: 0     // Mobile portrait
};

const cols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};
```

#### Mobile Considerations

**Portrait Mode (320-480px):**
- **Disable drag-and-drop** (difficult on small screens)
- **Single column layout** (cols: 1)
- **Stack windows vertically**
- **Full-width windows** (w: 1, filling single column)
- **Collapsible headers** to save space

**Tablet Mode (768-1024px):**
- **Enable drag-and-drop** (enough screen space)
- **2-3 column layout** (cols: 6)
- **Side-by-side windows** possible
- **Larger touch targets** (40x40px minimum)

**Implementation:**
```javascript
const isMobile = containerWidth < 768;

<GridLayout
  isDraggable={!isMobile}
  isResizable={!isMobile}
  cols={isMobile ? 1 : 12}
  // Mobile: all windows full width
  layout={isMobile ? mobileLayout : desktopLayout}
>
```

#### Touch Optimization

```css
/* Larger touch targets on mobile */
@media (max-width: 768px) {
  .window-header {
    height: 48px; /* Minimum 44px for touch */
  }

  .react-resizable-handle {
    width: 40px;
    height: 40px;
  }
}
```

**Current State:** No responsive breakpoints implemented.

**Recommendations:**
1. Add mobile detection (containerWidth < 768px)
2. Disable drag/resize on mobile
3. Force single-column layout on mobile
4. Increase touch target sizes (48x48px minimum)
5. Test on actual devices, not just browser resize

### 3.4 Advanced Features

#### 1. Prevent Collision Mode

```javascript
// Example 12 from react-grid-layout docs
<GridLayout
  preventCollision={true}
  compactType={null}
>
```

**Use Case:** Strict grid where windows cannot push each other.

**UX:** User must manually make space before moving window.

#### 2. Allow Overlap Mode

```javascript
<GridLayout
  allowOverlap={true}
  // Note: implies preventCollision={true}
>
```

**Use Case:** Layered window system (traditional OS-style).

**Requirements:**
- Z-index management
- Click-to-front behavior
- Visual focus indicators

#### 3. Bounded Dragging

```javascript
<GridLayout
  isBounded={true}
>
```

**Effect:** Items cannot be dragged outside container bounds.

**Benefit:** Prevents windows from being partially off-screen.

#### 4. Static Items

```javascript
const layouts = [
  { i: 'header', x: 0, y: 0, w: 12, h: 1, static: true },
  { i: 'window1', x: 0, y: 1, w: 4, h: 3 },
];
```

**Use Case:** Fixed header, toolbar, or status bar that shouldn't move.

#### 5. Drag from Outside

```javascript
<GridLayout
  onDrop={onDrop}
  isDroppable={true}
  droppingItem={{ i: '__dropping-elem__', w: 4, h: 3 }}
>
```

**Use Case:** Drag window type from palette onto grid.

**Implementation:**
```javascript
// In MenuBar
<div
  draggable
  onDragStart={(e) => {
    e.dataTransfer.setData('windowType', 'scanner');
  }}
>
  New Scanner
</div>

// In WorkspaceGrid
const onDrop = (layout, layoutItem, event) => {
  const windowType = event.dataTransfer.getData('windowType');
  addWindow(windowType, layoutItem.x, layoutItem.y);
};
```

**Recommendations:**
1. Add `isBounded: true` to prevent off-screen issues
2. Implement drag-from-outside for window palette
3. Consider static items for future menu bar integration
4. Experiment with preventCollision as user preference

---

## 4. Visual Feedback Strategies

### 4.1 During Drag

#### Ghost Element
```css
.react-grid-item.react-draggable-dragging {
  opacity: 0.7;              /* Current: 0.8 */
  z-index: 1000;             /* Current: 100 - increase */
  cursor: grabbing;          /* Add */
  filter: brightness(1.1);   /* Add subtle brightness */
  box-shadow: 0 10px 30px rgba(0,0,0,0.4); /* Add elevation */
}
```

#### Placeholder at Original Position
```css
.react-grid-placeholder {
  background: var(--accent-primary);
  opacity: 0.2;
  border: 2px dashed var(--accent-primary);
  border-radius: 8px;
  transition: all 100ms ease;
}
```

#### Drop Zone Highlight
```javascript
const [dragOverCell, setDragOverCell] = useState(null);

const handleDrag = (layout, oldItem, newItem) => {
  setDragOverCell({ x: newItem.x, y: newItem.y });
};

// In render
<div
  className={`grid-cell ${
    dragOverCell?.x === cellX && dragOverCell?.y === cellY
      ? 'drag-over'
      : ''
  }`}
/>
```

```css
.grid-cell.drag-over {
  background: var(--accent-primary);
  opacity: 0.1;
  border: 2px solid var(--accent-primary);
}
```

### 4.2 During Resize

#### Resize Handle Enhancement
```css
.react-resizable-handle-se::after {
  /* Current */
  border-right: 2px solid rgba(148, 163, 184, 0.6);
  border-bottom: 2px solid rgba(148, 163, 184, 0.6);

  /* Enhanced */
  transition: all 150ms ease;
}

.react-resizable-handle-se:hover::after {
  border-color: var(--accent-primary);
  border-width: 3px;
  width: 10px;
  height: 10px;
}

.resizing .react-resizable-handle-se::after {
  border-color: var(--accent-primary);
}
```

#### Size Display Tooltip
```javascript
const [resizeSize, setResizeSize] = useState(null);

const handleResize = (layout, oldItem, newItem) => {
  setResizeSize({ w: newItem.w, h: newItem.h });
};

const handleResizeStop = () => {
  setResizeSize(null);
};

// Render tooltip
{resizeSize && (
  <div className="resize-tooltip">
    {resizeSize.w} × {resizeSize.h}
  </div>
)}
```

### 4.3 Snapping Feedback

#### Magnetic Snap Animation
```javascript
const handleDragStop = (layout, oldItem, newItem) => {
  // Snap to nearest grid position with animation
  const snappedX = Math.round(newItem.x);
  const snappedY = Math.round(newItem.y);

  if (newItem.x !== snappedX || newItem.y !== snappedY) {
    // Trigger snap animation
    animateWindowPosition(newItem.i, snappedX, snappedY, 100);
  }
};
```

```css
.window-snapping {
  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Alignment Guides
```javascript
const [alignmentGuides, setAlignmentGuides] = useState([]);

const handleDrag = (layout, oldItem, newItem) => {
  const guides = findAlignmentGuides(newItem, layout);
  setAlignmentGuides(guides);
};

// Render guides
{alignmentGuides.map(guide => (
  <div
    key={guide.id}
    className="alignment-guide"
    style={{
      [guide.direction === 'horizontal' ? 'top' : 'left']: guide.position,
    }}
  />
))}
```

```css
.alignment-guide {
  position: absolute;
  background: var(--accent-primary);
  z-index: 999;
  pointer-events: none;
  animation: guide-flash 300ms ease;
}

.alignment-guide[data-direction="horizontal"] {
  height: 1px;
  width: 100%;
}

.alignment-guide[data-direction="vertical"] {
  width: 1px;
  height: 100%;
}

@keyframes guide-flash {
  from { opacity: 0; }
  to { opacity: 0.6; }
}
```

### 4.4 Focus & Selection

#### Focused Window
```css
.window-frame.focused {
  outline: 2px solid var(--accent-primary);
  outline-offset: -2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.window-header.focused {
  background: var(--accent-primary);
  color: white;
}
```

#### Multiple Selection (Future)
```css
.window-frame.selected {
  outline: 2px solid var(--accent-primary);
  outline-offset: -2px;
}

.window-frame.selected .window-header::before {
  content: "✓";
  margin-right: 8px;
  color: var(--accent-primary);
}
```

**Recommendations:**
1. Enhance ghost element with shadow and brightness
2. Add placeholder border at original position
3. Implement resize size tooltip
4. Add alignment guides during drag
5. Enhance focus indicators for accessibility

---

## 5. Additional Features & Considerations

### 5.1 Undo/Redo

#### State Structure
```javascript
interface LayoutHistory {
  past: Layout[][];      // Previous layouts
  present: Layout[];     // Current layout
  future: Layout[][];    // Redo stack
}
```

#### Implementation
```javascript
import { useReducer } from 'react';

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        past: [...state.past, state.present],
        present: action.layout,
        future: [],
      };

    case 'UNDO':
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };

    case 'REDO':
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
  }
};

const [layoutHistory, dispatch] = useReducer(historyReducer, {
  past: [],
  present: initialLayout,
  future: [],
});
```

#### Keyboard Shortcuts
```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        dispatch({ type: 'REDO' });
      } else {
        dispatch({ type: 'UNDO' });
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### 5.2 Layout Templates

#### Template Structure
```javascript
interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  windows: {
    type: WindowType;
    title: string;
    layout: { x: number; y: number; w: number; h: number };
    config: WindowConfig;
  }[];
}
```

#### Example Templates
```javascript
const templates = {
  'day-trader': {
    name: 'Day Trader',
    description: 'Large scanner, news feed, alerts',
    windows: [
      {
        type: 'scanner',
        title: 'Top Gainers',
        layout: { x: 0, y: 0, w: 8, h: 6 },
        config: { /* ... */ },
      },
      {
        type: 'news',
        title: 'Market News',
        layout: { x: 8, y: 0, w: 4, h: 3 },
        config: { /* ... */ },
      },
      {
        type: 'alerts',
        title: 'Price Alerts',
        layout: { x: 8, y: 3, w: 4, h: 3 },
        config: { /* ... */ },
      },
    ],
  },

  'swing-trader': {
    name: 'Swing Trader',
    description: 'Multiple scanners for different timeframes',
    windows: [
      {
        type: 'scanner',
        title: 'Weekly Gainers',
        layout: { x: 0, y: 0, w: 6, h: 4 },
        config: { /* ... */ },
      },
      {
        type: 'scanner',
        title: 'Daily Gainers',
        layout: { x: 6, y: 0, w: 6, h: 4 },
        config: { /* ... */ },
      },
      // ...
    ],
  },
};
```

### 5.3 Multi-Monitor Support

#### Detection
```javascript
const detectMultiMonitor = () => {
  if (window.screen && 'isExtended' in window.screen) {
    return window.screen.isExtended;
  }
  return false;
};

const getScreenDetails = async () => {
  if ('getScreenDetails' in window) {
    const screens = await window.getScreenDetails();
    return screens.screens;
  }
  return [window.screen];
};
```

#### Pop-Out Windows
```javascript
const popOutWindow = (windowId) => {
  const window = windows.find(w => w.id === windowId);

  const popup = window.open(
    `/window/${windowId}`,
    `window-${windowId}`,
    `width=800,height=600`
  );

  // Send window state to popup
  popup.postMessage({ window }, '*');

  // Remove from main grid
  removeWindow(windowId);
};
```

### 5.4 Collaborative Editing

#### Broadcast Layout Changes
```javascript
import { useChannel } from '@ably-labs/react-hooks';

const [channel] = useChannel('workspace-layout', (message) => {
  if (message.data.userId !== currentUserId) {
    updateLayout(message.data.layout);
  }
});

const handleLayoutChange = (newLayout) => {
  updateLayout(newLayout);
  channel.publish('layout-change', {
    userId: currentUserId,
    layout: newLayout,
  });
};
```

#### Conflict Resolution
```javascript
const mergeLayouts = (localLayout, remoteLayout) => {
  // Last-write-wins strategy
  const merged = [...localLayout];

  remoteLayout.forEach(remoteItem => {
    const localIndex = merged.findIndex(item => item.i === remoteItem.i);

    if (localIndex === -1) {
      // New window from remote
      merged.push(remoteItem);
    } else if (remoteItem.timestamp > merged[localIndex].timestamp) {
      // Remote is newer
      merged[localIndex] = remoteItem;
    }
  });

  return merged;
};
```

---

## 6. Implementation Roadmap

### Phase 1: Critical UX Improvements (v0.4.0)

**Priority: High - Immediate Impact**

1. **Visual Feedback Enhancements**
   - [ ] Add placeholder border at original position during drag
   - [ ] Enhance ghost element opacity and shadow
   - [ ] Change cursor to "grabbing" during drag
   - [ ] Add resize size tooltip during resize
   - [ ] Enhance resize handle hover state

2. **Focus & Accessibility**
   - [ ] Implement focused window styling (border highlight)
   - [ ] Add click-to-front behavior (z-index management)
   - [ ] Add aria-label to each window
   - [ ] Ensure keyboard focus indicators are visible
   - [ ] Add sr-only status announcements

3. **Smart Positioning**
   - [ ] Implement top-left first-fit algorithm for new windows
   - [ ] Add visual preview showing where new window will appear
   - [ ] Fix cascading to prevent all windows in same spot

**Estimated Effort:** 8-12 hours

---

### Phase 2: Polish & Performance (v0.5.0)

**Priority: Medium - Quality Improvements**

1. **Snapping & Alignment**
   - [ ] Add magnetic snap animation (100ms)
   - [ ] Implement alignment guides during drag
   - [ ] Add snap-to-grid visual feedback
   - [ ] Configure snap threshold (10-15% of grid size)

2. **Performance Optimization**
   - [ ] Memoize window children array
   - [ ] Debounce localStorage saves (250ms)
   - [ ] Add lazy loading for window content
   - [ ] Throttle drag updates if needed

3. **Boundary Management**
   - [ ] Add `isBounded: true` to prevent edge cases
   - [ ] Implement "Fit All Windows" menu option
   - [ ] Add warning when attempting to move off-screen
   - [ ] Test on various viewport sizes

**Estimated Effort:** 12-16 hours

---

### Phase 3: Advanced Features (v0.6.0)

**Priority: Low - Power User Features**

1. **Undo/Redo**
   - [ ] Implement layout history state
   - [ ] Add undo/redo reducer
   - [ ] Add keyboard shortcuts (Cmd/Ctrl+Z)
   - [ ] Add undo/redo buttons in menu bar
   - [ ] Limit history to 50 steps

2. **Keyboard Navigation**
   - [ ] Implement arrow key movement in "move mode"
   - [ ] Add Shift+Arrow for resizing
   - [ ] Add keyboard shortcuts for common actions
   - [ ] Add arrow button alternative controls
   - [ ] Test with screen readers

3. **Layout Templates**
   - [ ] Create 3-5 default templates (day trader, swing trader, etc.)
   - [ ] Add template selector in menu
   - [ ] Allow saving current layout as template
   - [ ] Add template preview thumbnails
   - [ ] Export/import templates as JSON

**Estimated Effort:** 20-24 hours

---

### Phase 4: Responsive & Mobile (v0.7.0)

**Priority: Medium - Broader Accessibility**

1. **Mobile Support**
   - [ ] Detect mobile viewport (< 768px)
   - [ ] Force single-column layout on mobile
   - [ ] Disable drag/resize on mobile
   - [ ] Increase touch target sizes (48px)
   - [ ] Test on actual mobile devices

2. **Responsive Breakpoints**
   - [ ] Implement responsive breakpoints (lg, md, sm, xs)
   - [ ] Adjust column count per breakpoint
   - [ ] Save separate layouts per breakpoint
   - [ ] Test on various screen sizes
   - [ ] Optimize for tablet landscape/portrait

3. **Touch Optimization**
   - [ ] Add long-press to enter move mode
   - [ ] Implement pinch-to-resize (if feasible)
   - [ ] Add visual feedback for touch interactions
   - [ ] Test multitouch scenarios

**Estimated Effort:** 16-20 hours

---

### Phase 5: Advanced Interactions (v1.0.0)

**Priority: Low - Future Enhancements**

1. **Multi-Select & Batch Operations**
   - [ ] Add Shift+Click multi-select
   - [ ] Implement drag multiple windows
   - [ ] Add "Align" menu for selected windows
   - [ ] Add "Distribute Evenly" option
   - [ ] Add "Group" feature

2. **Drag from Outside**
   - [ ] Implement window palette/sidebar
   - [ ] Add drag-and-drop from palette to grid
   - [ ] Show drop preview during drag
   - [ ] Animate window appearance on drop

3. **Collaboration (if needed)**
   - [ ] Add real-time layout sync
   - [ ] Implement conflict resolution
   - [ ] Show other users' cursors
   - [ ] Add layout sharing via URL

**Estimated Effort:** 24-32 hours

---

## 7. Configuration Recommendations

### 7.1 Immediate Changes to WorkspaceGrid.tsx

```typescript
<GridLayout
  className="layout"
  layout={layouts}
  cols={12}
  rowHeight={80}
  width={containerWidth}

  // Behavior
  isDraggable={true}
  isResizable={true}
  isBounded={true}                    // NEW: Prevent off-screen
  preventCollision={false}
  compactType={null}

  // Interaction
  draggableHandle=".window-header"
  draggableCancel=".no-drag"          // NEW: Prevent dragging from inputs

  // Callbacks
  onLayoutChange={handleLayoutChange}
  onDragStart={handleDragStart}       // NEW: For visual feedback
  onDragStop={handleDragStop}         // NEW: For snap animation
  onResizeStart={handleResizeStart}   // NEW: For resize tooltip
  onResizeStop={handleResizeStop}     // NEW: For cleanup

  // Performance
  useCSSTransforms={true}             // NEW: Explicit (default anyway)
>
```

### 7.2 CSS Enhancements to globals.css

```css
/* Enhanced drag ghost */
.react-grid-item.react-draggable-dragging {
  transition: none;
  z-index: 1000;              /* Increased from 100 */
  opacity: 0.7;               /* Slightly more transparent */
  cursor: grabbing;           /* NEW */
  filter: brightness(1.1);    /* NEW */
  box-shadow: 0 10px 30px rgba(0,0,0,0.4); /* NEW */
}

/* Placeholder at original position */
.react-grid-placeholder {
  background: var(--accent-primary);
  opacity: 0.15;
  border: 2px dashed var(--accent-primary);
  border-radius: 8px;
  transition: all 100ms ease;
}

/* Enhanced resize handle */
.react-resizable-handle-se::after {
  content: "";
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(148, 163, 184, 0.6);
  border-bottom: 2px solid rgba(148, 163, 184, 0.6);
  transition: all 150ms ease; /* NEW */
}

.react-resizable-handle-se:hover::after {
  border-color: var(--accent-primary);
  border-width: 3px;
  width: 10px;
  height: 10px;
}

/* Focused window */
.window-frame:focus-within,
.window-frame.focused {
  outline: 2px solid var(--accent-primary);
  outline-offset: -2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Alignment guides */
.alignment-guide {
  position: absolute;
  background: var(--accent-primary);
  z-index: 999;
  pointer-events: none;
  opacity: 0.6;
}

.alignment-guide[data-direction="horizontal"] {
  height: 1px;
  width: 100%;
}

.alignment-guide[data-direction="vertical"] {
  width: 1px;
  height: 100%;
}
```

### 7.3 WindowContext Enhancements

```typescript
interface WindowInstance {
  id: string;
  title: string;
  type: WindowType;
  config: WindowConfig;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
  zIndex?: number;        // NEW: For layering
  focused?: boolean;      // NEW: For focus management
  minimized?: boolean;
  maximized?: boolean;
}

interface WindowContextValue {
  windows: WindowInstance[];
  addWindow: (type: WindowType, title: string, config: WindowConfig, position?: {x: number, y: number}) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInstance>) => void;
  updateLayout: (layout: Layout[]) => void;
  focusWindow: (id: string) => void;        // NEW
  saveWorkspace: (name: string) => void;
  loadWorkspace: (name: string) => void;
  undo: () => void;                         // NEW (Phase 3)
  redo: () => void;                         // NEW (Phase 3)
}
```

---

## 8. Testing Checklist

### 8.1 Visual Feedback

- [ ] Ghost element appears at 0.7 opacity during drag
- [ ] Cursor changes to "grabbing" during drag
- [ ] Placeholder border shows original position
- [ ] Drop shadow visible on dragged element
- [ ] Resize handle highlights on hover
- [ ] Resize tooltip shows dimensions during resize
- [ ] Alignment guides appear when dragging near aligned position
- [ ] Snap animation plays on drop (100ms)

### 8.2 Interaction

- [ ] Windows can be dragged by header only
- [ ] Windows cannot be dragged by content area
- [ ] Clicking window brings it to front (z-index)
- [ ] Focused window has visible border highlight
- [ ] Resize handle works in bottom-right corner
- [ ] Windows push others out of way during drag
- [ ] No unexpected layout shifts after drag complete
- [ ] New windows appear in first available space

### 8.3 Boundaries

- [ ] Windows cannot be dragged completely off-screen
- [ ] Windows cannot be resized below minimum size
- [ ] Windows snap to grid on drop
- [ ] No windows lost after viewport resize
- [ ] "Fit All Windows" menu option works correctly

### 8.4 Performance

- [ ] Drag operations maintain 60fps
- [ ] No lag during resize
- [ ] Layout changes debounced appropriately
- [ ] No excessive re-renders during drag
- [ ] Children array memoized properly

### 8.5 Accessibility

- [ ] All windows keyboard navigable (Tab)
- [ ] Focus indicators visible
- [ ] Screen reader announces window creation
- [ ] Screen reader announces layout changes
- [ ] Keyboard shortcuts work (if implemented)
- [ ] Alternative controls available (arrow buttons)
- [ ] No keyboard traps

### 8.6 Mobile/Touch

- [ ] Touch drag works on tablet (if enabled)
- [ ] Touch targets minimum 44x44px
- [ ] Single-column layout on mobile
- [ ] Drag/resize disabled on mobile (if configured)
- [ ] No zoom issues on double-tap

### 8.7 Edge Cases

- [ ] Empty workspace shows welcome screen
- [ ] Duplicate window IDs prevented
- [ ] Malformed layouts handled gracefully
- [ ] Very small viewport (320px) works
- [ ] Very large viewport (4K) works
- [ ] Rapid drag/drop operations stable
- [ ] Concurrent layout changes (race conditions) handled

---

## 9. Key Metrics to Track

### 9.1 Performance Metrics

- **Frame Rate During Drag:** Target 60fps (16.67ms per frame)
- **Time to Interactive (TTI):** < 3 seconds on initial load
- **Layout Shift (CLS):** < 0.1 (minimize unexpected shifts)
- **Memory Usage:** Monitor for leaks during extended sessions

### 9.2 UX Metrics

- **Drag Success Rate:** % of drag operations that complete successfully
- **Accidental Window Close Rate:** Track unintended closes (minimize)
- **Layout Saves per Session:** Indicates user engagement with workspaces
- **Window Creation Rate:** Popular window types

### 9.3 Error Metrics

- **Layout Corruption Rate:** Malformed layouts that fail to load
- **Windows Lost Off-Screen:** Before and after boundary fixes
- **Collision Issues:** Overlapping windows when shouldn't
- **Performance Degradation:** Lag reports from users

---

## 10. Additional Resources

### 10.1 Documentation

- **react-grid-layout GitHub:** https://github.com/react-grid-layout/react-grid-layout
- **Examples:** https://react-grid-layout.github.io/react-grid-layout/examples/
- **W3C ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/patterns/
- **MDN Drag and Drop API:** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

### 10.2 Libraries to Consider

- **use-debounce:** https://www.npmjs.com/package/use-debounce
- **react-use:** https://github.com/streamich/react-use (useThrottle, useMeasure)
- **redux-undo:** https://github.com/omnidan/redux-undo
- **react-hotkeys-hook:** https://www.npmjs.com/package/react-hotkeys-hook

### 10.3 Inspiration

- **TradingView:** https://www.tradingview.com
- **Notion:** https://www.notion.so
- **Figma:** https://www.figma.com
- **Grafana:** https://grafana.com
- **Tableau:** https://www.tableau.com

---

## 11. Conclusion

This research has identified 8 critical UX patterns and 12 technical solutions from leading dashboard platforms. The Market Movers workspace system has a solid foundation with react-grid-layout, but significant UX improvements are needed to match professional standards.

**Highest Impact Improvements:**
1. **Visual Feedback** - Clear drag/resize indicators build user confidence
2. **Focus Management** - Click-to-front and visual focus indicators are essential
3. **Smart Positioning** - Proper algorithms prevent window placement frustration
4. **Accessibility** - Keyboard navigation and ARIA support are not optional

**Quick Wins (Phase 1):**
- Enhanced ghost element styling (2 hours)
- Click-to-front z-index management (3 hours)
- Top-left first-fit positioning algorithm (3 hours)
- Basic ARIA labels (2 hours)

**Total Estimated Effort:** 80-104 hours across 5 phases

The phased roadmap allows incremental improvements while maintaining system stability. Each phase delivers measurable UX enhancements that users will notice and appreciate.

---

**Next Steps:**
1. Review this report with team
2. Prioritize Phase 1 improvements for v0.4.0
3. Create implementation tasks in project tracker
4. Begin with visual feedback enhancements (highest impact, lowest risk)
5. Gather user feedback after each phase

---

*Report compiled by Claude Code*
*Research Date: 2025-10-20*
*Project: Market Movers - Multi-Window Workspace System*
