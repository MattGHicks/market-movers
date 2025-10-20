# Market Movers UI/UX Improvements - v0.4.0 Design Document

**Date:** 2025-10-20
**Status:** Planning Phase
**Target Version:** v0.4.0

## Executive Summary

This document outlines comprehensive UI/UX improvements for Market Movers based on analysis of 15 professional trading scanners including Trade Ideas, Benzinga Pro, ThinkorSwim, Finviz Elite, BlackBoxStocks, TradingView, TC2000, and others.

The goal is to transform Market Movers from a functional workspace system into a **professional-grade trading platform** that rivals industry leaders in visual design, data density, and user experience.

---

## Research Summary: Professional Scanner Patterns

### Platforms Analyzed

1. **Trade Ideas** - Industry leader, function-over-form, highly customizable
2. **Benzinga Pro** - Modern UI, 10s refresh, CSV export, drag columns
3. **ThinkorSwim** - Institutional-grade, watchlist integration, custom columns
4. **Finviz Elite** - Heat maps, color-coded sectors, 63 filters
5. **BlackBoxStocks** - Real-time everything, options flow, dark pool scanner
6. **TradingView Pro+** - Clean design, Pine Script columns, flagged symbols
7. **TC2000** - 1-second refresh (Platinum), real-time scanning
8. **Market Chameleon** - Options-focused, unusual activity
9. **Scanz** - Day trading focus, alerts, multi-timeframe
10. **StocksToTrade** - News integration, social sentiment
11. **TrendSpider** - Technical analysis, automated scanners
12. **Tickeron** - AI-powered, pattern recognition
13. **Warrior Trading (DayTradeDash)** - Momentum focus, Level 2
14. **TradeStation** - Advanced filtering, institutional tools
15. **StockMarketEye** - Portfolio integration, fundamentals

### Key Findings

#### 1. Data Density & Display
- **Compact rows**: 20-30px row height for maximum data on screen
- **Condensed fonts**: Use tabular/monospace numbers for alignment
- **High information density**: Power users need efficiency over whitespace
- **Sticky headers**: Column headers remain visible during scroll
- **Alternating row colors**: Subtle zebra striping for readability

#### 2. Color Coding Standards
- **Green**: Bullish/positive/gains (varying shades for intensity)
- **Red**: Bearish/negative/losses (varying shades for intensity)
- **Yellow/Orange**: Warnings, unusual activity, breakouts
- **Blue/Cyan**: Informational, volume spikes, news
- **Gray**: Neutral, inactive, disabled
- **Color intensity**: Lighter = smaller change, darker = larger change

#### 3. Dark Mode Implementation
- **Default theme**: Professional traders prefer dark backgrounds
- **Contrast ratios**: WCAG AA compliant (4.5:1 minimum)
- **Color palette**: Colors that "pop" against dark backgrounds
- **Reduced eye strain**: Critical for all-day monitoring
- **OLED-friendly**: True blacks for power efficiency

#### 4. Real-Time Updates
- **Refresh rates**: Configurable from 1s to manual
  - Professional: 1-5 seconds
  - Standard: 10-30 seconds
  - Delayed: 60+ seconds or manual
- **Visual indicators**: Flashing/highlighting on data changes
- **Freeze functionality**: Pause updates to analyze specific snapshot
- **Smart updates**: Only update changed rows, not entire table

#### 5. Column Customization
- **Drag to reorder**: Click and drag column headers
- **Resizable columns**: Drag column borders to adjust width
- **Show/hide columns**: Checkbox menu or right-click
- **Custom columns**: User-defined formulas and indicators
- **Saved presets**: Multiple column layouts per scanner type
- **Sort by column**: Click header to sort (ascending/descending)

#### 6. Advanced Features
- **Heat map view**: Color-coded blocks by sector/performance
- **CSV export**: Export current scanner results
- **Symbol search**: Filter/search within results
- **Alert configuration**: Per-scanner alert rules
- **Chart integration**: Click symbol to open chart
- **Multi-timeframe**: View same stock across timeframes
- **Pre-market/After-hours**: Extended hours data
- **Options flow**: Large options orders (advanced)
- **Dark pool**: Block trades from private exchanges (advanced)

---

## Current State Analysis

### What We Have ✅
- Draggable windows (react-grid-layout)
- Resizable windows
- Multiple scanner windows
- Minimize/maximize controls
- Basic column show/hide
- Color-coded change/changePercent
- 30-second auto-refresh
- News window
- Alerts window
- Responsive grid layout
- Window persistence (localStorage)

### What We're Missing ❌

#### Critical Gaps
1. **No dark mode** - Light theme only
2. **Low data density** - Rows too large, too much whitespace
3. **Limited color coding** - Only change/changePercent
4. **No column reordering** - Can't drag columns
5. **No column resizing** - Fixed widths only
6. **No sorting** - Can't click headers to sort
7. **No search/filter** - Can't search within scanner results
8. **No export** - Can't save data to CSV
9. **No heat map view** - Missing visual overview
10. **No chart integration** - Can't view charts

#### Secondary Gaps
- No freeze/unfreeze refresh
- No refresh rate configuration per scanner
- No flashing updates on data changes
- No sticky headers when scrolling
- No tabular number formatting
- Limited technical indicators
- No pre-market/after-hours data
- No custom column formulas
- No saved column presets
- No symbol clicking interactions

---

## Design Improvements: Detailed Specifications

### Phase 1: Core Visual Overhaul (v0.4.0)

#### 1.1 Dark Mode Theme System

**Implementation:**
- Create theme context with light/dark modes
- Use CSS custom properties for theming
- Add theme toggle to settings/menu bar
- Persist theme preference to localStorage

**Color Palette:**

```css
/* Dark Theme */
--bg-primary: #0a0e13;          /* Main background (near black) */
--bg-secondary: #151921;        /* Window backgrounds */
--bg-tertiary: #1e2330;         /* Window headers, hover states */
--bg-hover: #262d3d;            /* Hover backgrounds */

--text-primary: #e0e6ed;        /* Main text */
--text-secondary: #8b92a0;      /* Secondary text, labels */
--text-muted: #545b6a;          /* Disabled, less important */

--border-primary: #2a3140;      /* Window borders */
--border-secondary: #1e2330;    /* Subtle dividers */

--accent-primary: #3b82f6;      /* Blue - links, focus */
--accent-hover: #2563eb;        /* Blue hover */

--green-base: #10b981;          /* Positive/gains */
--green-light: #34d399;         /* Light positive */
--green-dark: #059669;          /* Strong positive */
--red-base: #ef4444;            /* Negative/losses */
--red-light: #f87171;           /* Light negative */
--red-dark: #dc2626;            /* Strong negative */
--yellow-base: #f59e0b;         /* Warning/unusual */
--blue-base: #06b6d4;           /* Info/volume */
```

**Light Theme:**
```css
/* Light Theme */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;
--bg-hover: #e5e7eb;

--text-primary: #111827;
--text-secondary: #6b7280;
--text-muted: #9ca3af;

--border-primary: #e5e7eb;
--border-secondary: #f3f4f6;

/* Same accent colors work for both themes */
```

**Files to Create:**
- `context/ThemeContext.tsx`
- `styles/themes.css`
- `components/ThemeToggle.tsx`

#### 1.2 High-Density Data Table

**Goals:**
- Fit 30-40 stocks on screen simultaneously
- Improve readability with proper spacing
- Enable faster scanning of opportunities

**Changes:**

```typescript
// Scanner table styles
.scanner-table {
  font-size: 13px;              /* Smaller, professional font */
  line-height: 1.3;             /* Tighter line height */
}

.scanner-row {
  height: 28px;                 /* Compact row height */
  border-bottom: 1px solid var(--border-secondary);
  transition: background 0.15s;
}

.scanner-row:hover {
  background: var(--bg-hover);
  cursor: pointer;
}

.scanner-row:nth-child(even) {
  background: rgba(0, 0, 0, 0.02); /* Subtle zebra striping */
}

.scanner-cell {
  padding: 4px 8px;             /* Compact padding */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scanner-header {
  position: sticky;
  top: 0;
  background: var(--bg-tertiary);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px;
  border-bottom: 2px solid var(--border-primary);
  z-index: 10;
}
```

**Typography:**
```css
/* Use tabular numbers for alignment */
.scanner-number {
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}
```

#### 1.3 Enhanced Color Coding

**Intensity-Based Colors:**

```typescript
// Color coding function
function getColorByIntensity(value: number, type: 'gain' | 'loss'): string {
  const absValue = Math.abs(value);

  if (type === 'gain') {
    if (absValue >= 10) return 'var(--green-dark)';      // >10%
    if (absValue >= 5) return 'var(--green-base)';       // 5-10%
    if (absValue >= 2) return 'var(--green-light)';      // 2-5%
    return 'var(--text-secondary)';                       // <2%
  } else {
    if (absValue >= 10) return 'var(--red-dark)';        // >10%
    if (absValue >= 5) return 'var(--red-base)';         // 5-10%
    if (absValue >= 2) return 'var(--red-light)';        // 2-5%
    return 'var(--text-secondary)';                       // <2%
  }
}

// Apply to multiple columns
const COLOR_CODED_COLUMNS = [
  'change',
  'changePercent',
  'preMarketChange',
  'afterHoursChange',
  'dayRange',
];

// Volume intensity (relative to average)
function getVolumeColor(volume: number, avgVolume: number): string {
  const ratio = volume / avgVolume;
  if (ratio >= 3) return 'var(--yellow-base)';   // 3x+ unusual
  if (ratio >= 2) return 'var(--blue-base)';     // 2x+ high
  return 'var(--text-primary)';                  // Normal
}
```

**Visual Indicators:**
- **Bold text** for values >5%
- **Background highlight** for unusual activity
- **Icons** for breakouts, alerts, news

#### 1.4 Interactive Column Headers

**Features:**
- Click to sort (ascending/descending/none)
- Right-click for column menu
- Drag to reorder columns
- Resize by dragging border

**Implementation with @dnd-kit:**

```typescript
// types/windows.ts - Add to ColumnConfig
export interface ColumnConfig {
  id: string;
  label: string;
  key: keyof MarketMover;
  width: number;
  visible: boolean;
  sortable?: boolean;
  resizable?: boolean;
  format?: 'currency' | 'percent' | 'volume' | 'number';
  colorCode?: boolean;
  align?: 'left' | 'right' | 'center';
  order: number;  // NEW: for column ordering
}

// Sorting state
interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}
```

**UI Component:**
```tsx
<th
  className="scanner-header resizable-column"
  onClick={() => handleSort(column.id)}
  onContextMenu={(e) => handleColumnMenu(e, column)}
  draggable
  onDragStart={(e) => handleDragStart(e, column)}
  onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, column)}
>
  <div className="header-content">
    <span>{column.label}</span>
    {sortState.column === column.id && (
      <span className="sort-icon">
        {sortState.direction === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </div>
  <div
    className="resize-handle"
    onMouseDown={(e) => handleResizeStart(e, column)}
  />
</th>
```

#### 1.5 Real-Time Update Indicators

**Flash on Change:**
```css
@keyframes flash-green {
  0%, 100% { background: transparent; }
  50% { background: rgba(16, 185, 129, 0.2); }
}

@keyframes flash-red {
  0%, 100% { background: transparent; }
  50% { background: rgba(239, 68, 68, 0.2); }
}

.cell-flash-up {
  animation: flash-green 0.6s ease-out;
}

.cell-flash-down {
  animation: flash-red 0.6s ease-out;
}
```

**Track Changes:**
```typescript
// In ScannerWindow component
const [previousData, setPreviousData] = useState<MarketMover[]>([]);
const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set());

useEffect(() => {
  if (data && previousData.length > 0) {
    const changes = new Set<string>();
    data.forEach((stock, idx) => {
      const prev = previousData.find(p => p.symbol === stock.symbol);
      if (prev && prev.price !== stock.price) {
        changes.add(`${stock.symbol}-price`);
      }
      if (prev && prev.volume !== stock.volume) {
        changes.add(`${stock.symbol}-volume`);
      }
    });
    setFlashingCells(changes);
    setTimeout(() => setFlashingCells(new Set()), 600);
  }
  setPreviousData(data || []);
}, [data]);
```

#### 1.6 Configurable Refresh Rate

**Per-Scanner Configuration:**
```typescript
// Add to ScannerWindowConfig
export interface ScannerWindowConfig {
  name: string;
  filters: ScanFilter;
  columns: ColumnConfig[];
  dataType: 'gainers' | 'losers' | 'actives' | 'custom';
  colorCoded: boolean;
  maxRows: number;
  refreshRate: 1000 | 5000 | 10000 | 30000 | 60000 | null; // NEW
  autoRefresh: boolean; // NEW
}
```

**UI Control:**
```tsx
<div className="scanner-controls">
  <button
    onClick={() => setAutoRefresh(!autoRefresh)}
    className={autoRefresh ? 'active' : 'paused'}
  >
    {autoRefresh ? '⏸ Freeze' : '▶ Resume'}
  </button>

  <select
    value={refreshRate || 'manual'}
    onChange={(e) => setRefreshRate(Number(e.target.value))}
  >
    <option value={1000}>1s (Pro)</option>
    <option value={5000}>5s</option>
    <option value={10000}>10s</option>
    <option value={30000}>30s</option>
    <option value={60000}>1m</option>
    <option value="manual">Manual</option>
  </select>

  <button onClick={refetch}>🔄 Refresh Now</button>
</div>
```

---

### Phase 2: Advanced Features (v0.4.1-0.4.2)

#### 2.1 Search & Filter Within Scanner

**Quick Symbol Search:**
```tsx
<div className="scanner-search">
  <input
    type="text"
    placeholder="Search symbols..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
  {searchTerm && (
    <button onClick={() => setSearchTerm('')}>✕</button>
  )}
</div>

// Filter displayed stocks
const filteredStocks = stocks.filter(stock =>
  stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
  stock.name?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### 2.2 CSV Export

**Export Current View:**
```typescript
function exportToCSV(stocks: MarketMover[], columns: ColumnConfig[]) {
  const visibleColumns = columns.filter(col => col.visible);

  // Header row
  const headers = visibleColumns.map(col => col.label).join(',');

  // Data rows
  const rows = stocks.map(stock =>
    visibleColumns.map(col => {
      const value = stock[col.key];
      // Format based on column type
      if (col.format === 'currency') return `$${value.toFixed(2)}`;
      if (col.format === 'percent') return `${value.toFixed(2)}%`;
      if (col.format === 'volume') return formatVolume(value);
      return value;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scanner-${Date.now()}.csv`;
  a.click();
}
```

#### 2.3 Heat Map View

**Visual Overview Mode:**
```tsx
// New window type: 'heatmap'
export type WindowType = 'scanner' | 'alerts' | 'news' | 'chart' | 'heatmap';

// HeatMapWindow.tsx
export function HeatMapWindow({ config }: { config: HeatMapWindowConfig }) {
  const { data } = useQuery({
    queryKey: ['heatmap'],
    queryFn: fetchAllMarketData,
    refetchInterval: 60000,
  });

  // Group by sector
  const sectors = groupBySector(data);

  return (
    <div className="heatmap-grid">
      {sectors.map(sector => (
        <div key={sector.name} className="sector-group">
          <h3>{sector.name}</h3>
          <div className="stock-tiles">
            {sector.stocks.map(stock => (
              <div
                key={stock.symbol}
                className="stock-tile"
                style={{
                  background: getHeatMapColor(stock.changePercent),
                  width: `${getSize(stock.marketCap)}px`,
                  height: `${getSize(stock.marketCap)}px`,
                }}
              >
                <div className="tile-symbol">{stock.symbol}</div>
                <div className="tile-change">{stock.changePercent.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getHeatMapColor(changePercent: number): string {
  if (changePercent >= 5) return '#059669';     // Strong green
  if (changePercent >= 2) return '#10b981';     // Green
  if (changePercent >= 0) return '#34d399';     // Light green
  if (changePercent >= -2) return '#f87171';    // Light red
  if (changePercent >= -5) return '#ef4444';    // Red
  return '#dc2626';                             // Strong red
}
```

#### 2.4 Click-to-Chart Integration

**Symbol Click Interaction:**
```typescript
function handleSymbolClick(symbol: string) {
  // Create new chart window focused on this symbol
  addWindow('chart', `${symbol} Chart`, {
    type: 'chart',
    config: {
      symbol,
      interval: '5m',
      indicators: ['SMA', 'Volume'],
    },
  });
}
```

**Chart Window (Future):**
```tsx
// ChartWindow.tsx - Placeholder for future
export function ChartWindow({ config }: { config: ChartWindowConfig }) {
  return (
    <div className="chart-window">
      <div className="chart-header">
        <h3>{config.symbol}</h3>
        <select value={config.interval} onChange={handleIntervalChange}>
          <option value="1m">1 Min</option>
          <option value="5m">5 Min</option>
          <option value="15m">15 Min</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
        </select>
      </div>

      {/* Use TradingView widget or lightweight-charts */}
      <div id={`chart-${config.symbol}`} className="chart-container" />

      {/* Technical indicators */}
      <div className="indicator-controls">
        {/* Checkbox list of available indicators */}
      </div>
    </div>
  );
}
```

#### 2.5 Column Presets & Saved Layouts

**Preset Management:**
```typescript
interface ColumnPreset {
  id: string;
  name: string;
  columns: ColumnConfig[];
}

const DEFAULT_PRESETS: ColumnPreset[] = [
  {
    id: 'momentum',
    name: 'Momentum Trading',
    columns: [
      { id: 'symbol', label: 'Symbol', ... },
      { id: 'price', label: 'Price', ... },
      { id: 'changePercent', label: 'Chg %', ... },
      { id: 'volume', label: 'Volume', ... },
      { id: 'relativeVolume', label: 'Rel Vol', ... },
    ],
  },
  {
    id: 'fundamental',
    name: 'Fundamentals',
    columns: [
      { id: 'symbol', label: 'Symbol', ... },
      { id: 'price', label: 'Price', ... },
      { id: 'marketCap', label: 'Market Cap', ... },
      { id: 'pe', label: 'P/E', ... },
      { id: 'dividend', label: 'Div Yield', ... },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Analysis',
    columns: [
      { id: 'symbol', label: 'Symbol', ... },
      { id: 'price', label: 'Price', ... },
      { id: 'rsi', label: 'RSI', ... },
      { id: 'macd', label: 'MACD', ... },
      { id: '52weekHigh', label: '52W High', ... },
    ],
  },
];

// UI for preset selection
<select onChange={(e) => applyPreset(e.target.value)}>
  <option value="">Custom</option>
  {DEFAULT_PRESETS.map(preset => (
    <option key={preset.id} value={preset.id}>{preset.name}</option>
  ))}
</select>
```

---

### Phase 3: Advanced Data & Indicators (v0.5.0)

#### 3.1 Additional FMP Data Points

**Expand MarketMover Type:**
```typescript
export interface MarketMover {
  // Existing
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;

  // NEW - Basic
  dayLow?: number;
  dayHigh?: number;
  yearLow?: number;
  yearHigh?: number;
  previousClose?: number;
  avgVolume?: number;

  // NEW - Extended Hours
  preMarketPrice?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
  afterHoursPrice?: number;
  afterHoursChange?: number;
  afterHoursChangePercent?: number;

  // NEW - Fundamentals
  pe?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  beta?: number;

  // NEW - Technical
  rsi?: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;

  // NEW - Meta
  sector?: string;
  industry?: string;
  exchange?: string;
  hasNews?: boolean;
  hasEarnings?: boolean;
}
```

**New API Endpoints:**
```typescript
// lib/api/fmp-client.ts

export async function getDetailedQuotes(symbols: string[]): Promise<QuoteDetail[]> {
  // Batch fetch detailed quotes
  const data = await fetchFMP<any[]>(
    `/quote/${symbols.join(',')}`,
    { extended: 'true' }
  );
  return data.map(mapToQuoteDetail);
}

export async function getTechnicalIndicators(symbol: string): Promise<TechnicalIndicators> {
  // Fetch RSI, SMA, etc.
  const [rsi, sma] = await Promise.all([
    fetchFMP(`/technical_indicator/daily/${symbol}?type=rsi&period=14`),
    fetchFMP(`/technical_indicator/daily/${symbol}?type=sma&period=20`),
  ]);
  return { rsi: rsi[0]?.rsi, sma20: sma[0]?.sma };
}

export async function getPreMarketMovers(): Promise<MarketMover[]> {
  const data = await fetchFMP('/stock_market/actives', {
    time: 'pre'
  });
  return data.map(mapToMarketMover);
}
```

#### 3.2 Calculated Columns

**Relative Volume:**
```typescript
function calculateRelativeVolume(current: number, average: number): number {
  return average > 0 ? current / average : 0;
}

// Display as "2.5x" badge
<span className={relVol >= 2 ? 'high-volume' : ''}>
  {relVol.toFixed(1)}x
</span>
```

**Distance from 52-Week High:**
```typescript
function distanceFrom52WeekHigh(price: number, high: number): number {
  return ((price - high) / high) * 100;
}

// Display as "-15.3%" (how far below high)
<span className="distance-high">
  {distance.toFixed(1)}%
</span>
```

**Gap Up/Down:**
```typescript
function calculateGap(open: number, previousClose: number): number {
  return ((open - previousClose) / previousClose) * 100;
}

// Show on open with icon
{Math.abs(gap) >= 2 && (
  <span className={gap > 0 ? 'gap-up' : 'gap-down'}>
    {gap > 0 ? '⬆' : '⬇'} {Math.abs(gap).toFixed(1)}%
  </span>
)}
```

---

## Implementation Roadmap

### v0.4.0: Core Visual Overhaul (Week 1-2)
**Priority: MUST HAVE**

- [ ] Dark/Light theme system with toggle
- [ ] High-density table styling (compact rows)
- [ ] Enhanced color coding (intensity-based)
- [ ] Tabular number formatting
- [ ] Sticky column headers
- [ ] Zebra striping for rows
- [ ] Hover states and interactions
- [ ] Update all existing windows to new theme

**Estimated Lines of Code:** ~800
**Files to Create:** 4-5
**Files to Modify:** 8-10

### v0.4.1: Interactive Tables (Week 3)
**Priority: MUST HAVE**

- [ ] Click headers to sort (asc/desc/none)
- [ ] Drag columns to reorder
- [ ] Resize columns by dragging borders
- [ ] Right-click column menu (hide/show)
- [ ] Flash animations on data updates
- [ ] Configurable refresh rate per scanner
- [ ] Freeze/unfreeze button
- [ ] Manual refresh button

**Estimated Lines of Code:** ~600
**Files to Create:** 2-3
**Files to Modify:** 3-4

### v0.4.2: Search & Export (Week 3-4)
**Priority: MUST HAVE**

- [ ] Symbol search within scanner
- [ ] CSV export functionality
- [ ] Row count display
- [ ] Last updated timestamp
- [ ] Status indicators (loading, error, paused)

**Estimated Lines of Code:** ~300
**Files to Create:** 1-2
**Files to Modify:** 2-3

### v0.4.3: Column Presets (Week 4)
**Priority: SHOULD HAVE**

- [ ] 3-5 default presets (Momentum, Fundamentals, Technical)
- [ ] Apply preset to scanner
- [ ] Save custom presets
- [ ] Manage presets (edit, delete)
- [ ] Import/export presets

**Estimated Lines of Code:** ~400
**Files to Create:** 2-3
**Files to Modify:** 3-4

### v0.5.0: Advanced Features (Week 5-6)
**Priority: NICE TO HAVE**

- [ ] Heat map window
- [ ] Chart window (TradingView widget or lightweight-charts)
- [ ] Click symbol to open chart
- [ ] Extended hours data
- [ ] Additional technical indicators
- [ ] Sector/industry grouping
- [ ] News badges on symbols
- [ ] Custom alerts per scanner

**Estimated Lines of Code:** ~1,000
**Files to Create:** 5-7
**Files to Modify:** 5-6

---

## Wireframes & Visual Mockups

### Dark Mode Scanner Window

```
┌────────────────────────────────────────────────────────────────┐
│ Top Gainers                          [⏸ Freeze] [5s▾] [🔄] [⚙] │
├────────────────────────────────────────────────────────────────┤
│ [🔍 Search symbols...]                    Showing 25 of 457    │
├────────────────────────────────────────────────────────────────┤
│ SYMBOL │ PRICE   │ CHANGE │ CHG %  │ VOLUME  │ REL VOL │ MKT CAP│
│────────┼─────────┼────────┼────────┼─────────┼─────────┼────────│
│ TSLA ⬆ │ $245.67 │ +15.23 │ +6.61% │  89.2M  │  3.2x   │  779B  │ <- Green row
│ NVDA 📰│ $485.12 │ +12.45 │ +2.63% │ 142.8M  │  2.1x   │  1.2T  │ <- Light green
│ AAPL   │ $178.34 │  +2.11 │ +1.20% │  54.3M  │  1.1x   │  2.8T  │ <- Subtle green
│ GOOGL  │ $142.89 │  +0.87 │ +0.61% │  23.1M  │  0.9x   │  1.8T  │
│ MSFT   │ $378.45 │  -1.23 │ -0.32% │  18.7M  │  0.8x   │  2.8T  │
│ META   │ $312.67 │  -3.45 │ -1.09% │  12.4M  │  0.7x   │  800B  │ <- Light red
│ AMZN   │ $145.23 │  -4.67 │ -3.11% │  38.9M  │  1.5x   │  1.5T  │ <- Red row
│────────┴─────────┴────────┴────────┴─────────┴─────────┴────────│
│ ▼ Load More (432 remaining)...                                  │
└────────────────────────────────────────────────────────────────┘

Legend:
- 🌑 Dark background (#151921)
- ⬆ Gap up indicator (yellow)
- 📰 Has news (blue badge)
- Green shades: Light (#34d399) -> Base (#10b981) -> Dark (#059669)
- Red shades: Light (#f87171) -> Base (#ef4444) -> Dark (#dc2626)
- Hover: Highlight row with (#262d3d)
- Numbers: Monospace font, tabular-nums
```

### Heat Map View

```
┌────────────────────────────────────────────────────────────────┐
│ Market Heat Map                                   [Sector▾] [⚙] │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TECHNOLOGY              FINANCIALS        HEALTHCARE           │
│  ┌─────┬────┬───┐       ┌────┬────┐      ┌────┬────┐          │
│  │AAPL │MSFT│   │       │JPM │BAC │      │JNJ │UNH │          │
│  │+1.2%│+0.3│GOO│       │-0.5│+0.8│      │+0.4│-1.2│          │
│  │     │    │+0.6│      └────┴────┘      └────┴────┘          │
│  ├─────┴────┴───┤                                              │
│  │    NVDA      │       ENERGY                                 │
│  │    +6.6%     │       ┌────┬────┐                            │
│  └──────────────┘       │XOM │CVX │                            │
│                         │+2.1│+1.8│                            │
│  CONSUMER                └────┴────┘                            │
│  ┌────┬────┬────┐                                              │
│  │TSLA│AMZN│WMT │                                              │
│  │+6.6│-3.1│+0.2│                                              │
│  └────┴────┴────┘                                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘

Color Scale:
Strong Loss (-5%+): #dc2626 (Dark Red)
Loss (-2% to -5%): #ef4444 (Red)
Small Loss (0 to -2%): #f87171 (Light Red)
Small Gain (0 to +2%): #34d399 (Light Green)
Gain (+2% to +5%): #10b981 (Green)
Strong Gain (+5%+): #059669 (Dark Green)

Tile size = relative market cap
```

### MenuBar with Theme Toggle

```
┌────────────────────────────────────────────────────────────────┐
│ 📊 Market Movers  [New ▾] [Workspaces ▾] [Settings] [🌙|☀️]   │
└────────────────────────────────────────────────────────────────┘
       └─ New Scanner ──┐
          - Top Gainers      <-- Pre-configured
          - Top Losers
          - Most Active
          - Pre-Market
          - Custom Scanner   <-- Opens filter dialog
       └─ New Window ───┐
          - Market News
          - Heat Map
          - Alerts
          - Chart          <-- Opens symbol search
```

---

## Technical Implementation Details

### Theme Context Architecture

```typescript
// context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('market-movers-theme') as Theme;
    if (stored) setThemeState(stored);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('market-movers-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### Column Ordering with @dnd-kit

```typescript
// components/windows/ScannerWindow.tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableColumnHeader } from './SortableColumnHeader';

function ScannerWindow({ config }: { config: ScannerWindowConfig }) {
  const [columns, setColumns] = useState(config.columns);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumns((cols) => {
      const oldIndex = cols.findIndex(c => c.id === active.id);
      const newIndex = cols.findIndex(c => c.id === over.id);
      return arrayMove(cols, oldIndex, newIndex);
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <table className="scanner-table">
        <thead>
          <tr>
            <SortableContext
              items={columns.map(c => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.filter(c => c.visible).map(column => (
                <SortableColumnHeader key={column.id} column={column} />
              ))}
            </SortableContext>
          </tr>
        </thead>
        <tbody>
          {/* Render rows */}
        </tbody>
      </table>
    </DndContext>
  );
}
```

### Column Resizing

```typescript
// hooks/useColumnResize.ts
import { useState, useCallback, useRef } from 'react';

export function useColumnResize(initialColumns: ColumnConfig[]) {
  const [columns, setColumns] = useState(initialColumns);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleResizeStart = useCallback((e: React.MouseEvent, column: ColumnConfig) => {
    e.preventDefault();
    resizingColumn.current = column.id;
    startX.current = e.clientX;
    startWidth.current = column.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColumn.current) return;
      const diff = moveEvent.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + diff); // Min 50px

      setColumns(cols =>
        cols.map(col =>
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
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return { columns, setColumns, handleResizeStart };
}
```

### Sorting Logic

```typescript
// hooks/useTableSort.ts
import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc' | null;

export function useTableSort<T>(data: T[], defaultKey?: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      // Cycle: asc -> desc -> null
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [data, sortKey, sortDirection]);

  return { sortedData, sortKey, sortDirection, handleSort };
}
```

---

## Performance Considerations

### 1. Virtual Scrolling for Large Datasets
For scanners with >100 stocks, implement virtual scrolling:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedScannerTable({ stocks }: { stocks: MarketMover[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: stocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28, // Row height
    overscan: 10, // Render 10 extra rows for smooth scrolling
  });

  return (
    <div ref={parentRef} className="scanner-scroll-container">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const stock = stocks[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ScannerRow stock={stock} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 2. Memoization for Row Rendering

```typescript
const ScannerRow = memo(({ stock, columns }: { stock: MarketMover; columns: ColumnConfig[] }) => {
  return (
    <tr className="scanner-row">
      {columns.filter(c => c.visible).map(column => (
        <td key={column.id} className="scanner-cell">
          <CellRenderer stock={stock} column={column} />
        </td>
      ))}
    </tr>
  );
}, (prev, next) => {
  // Only re-render if stock data actually changed
  return prev.stock.symbol === next.stock.symbol &&
         prev.stock.price === next.stock.price &&
         prev.stock.volume === next.stock.volume;
});
```

### 3. Debounced Search

```typescript
import { useDeferredValue } from 'react';

function ScannerWindow() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);

  // Use deferredSearch for filtering to avoid blocking UI
  const filteredStocks = useMemo(() => {
    return stocks.filter(s =>
      s.symbol.toLowerCase().includes(deferredSearch.toLowerCase())
    );
  }, [stocks, deferredSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 4. Smart Refresh Strategy

Only update changed data, not entire table:

```typescript
function useSmart Refresh(queryKey: string[], refreshRate: number) {
  const { data, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    refetchInterval: refreshRate,
  });

  const [previousData, setPreviousData] = useState(data);
  const [changedSymbols, setChangedSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!data || !previousData) return;

    const changes = new Set<string>();
    data.forEach((stock: MarketMover) => {
      const prev = previousData.find((p: MarketMover) => p.symbol === stock.symbol);
      if (prev && (prev.price !== stock.price || prev.volume !== stock.volume)) {
        changes.add(stock.symbol);
      }
    });

    setChangedSymbols(changes);
    setPreviousData(data);

    // Clear changed status after flash animation
    setTimeout(() => setChangedSymbols(new Set()), 600);
  }, [data]);

  return { data, changedSymbols, refetch };
}
```

---

## Testing Strategy

### Visual Regression Testing
Once Playwright MCP is working:

```typescript
// tests/visual/scanner-dark-mode.spec.ts
test('Scanner window in dark mode', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.setItem('market-movers-theme', 'dark'));
  await page.reload();

  // Create scanner
  await page.click('text=New');
  await page.click('text=Top Gainers');

  // Wait for data load
  await page.waitForSelector('.scanner-table tbody tr');

  // Screenshot
  await page.screenshot({ path: 'screenshots/scanner-dark-mode.png' });
});
```

### Unit Tests for Color Functions

```typescript
// lib/__tests__/colorCoding.test.ts
import { getColorByIntensity } from '../colorCoding';

describe('Color coding', () => {
  it('should return dark green for >10% gains', () => {
    expect(getColorByIntensity(15, 'gain')).toBe('var(--green-dark)');
  });

  it('should return dark red for >10% losses', () => {
    expect(getColorByIntensity(-12, 'loss')).toBe('var(--red-dark)');
  });

  it('should return muted color for <2% changes', () => {
    expect(getColorByIntensity(0.5, 'gain')).toBe('var(--text-secondary)');
  });
});
```

### Performance Benchmarks

```typescript
// tests/performance/table-render.bench.ts
import { bench } from 'vitest';

bench('Render 100 stock rows', async () => {
  const stocks = generateMockStocks(100);
  render(<ScannerTable stocks={stocks} />);
});

bench('Sort 1000 stocks by price', async () => {
  const stocks = generateMockStocks(1000);
  stocks.sort((a, b) => b.price - a.price);
});
```

---

## Migration Guide (v0.3.0 → v0.4.0)

### Breaking Changes
- Theme system requires wrapping app in `<ThemeProvider>`
- `ColumnConfig` type updated with new fields (`order`, `align`, `resizable`)
- CSS custom properties replace hardcoded colors

### Migration Steps

1. **Wrap app in ThemeProvider:**
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider> {/* NEW */}
          <QueryClientProvider client={queryClient}>
            <WindowProvider>
              <FilterProvider>
                <AlertProvider>
                  {children}
                </AlertProvider>
              </FilterProvider>
            </WindowProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

2. **Update CSS to use theme variables:**
```css
/* Before */
background: #ffffff;
color: #000000;

/* After */
background: var(--bg-primary);
color: var(--text-primary);
```

3. **Add order field to existing columns:**
```typescript
// types/windows.ts
export const DEFAULT_SCANNER_COLUMNS: ColumnConfig[] = [
  { id: 'symbol', label: 'Symbol', key: 'symbol', width: 80, visible: true, order: 0 }, // NEW
  { id: 'price', label: 'Price', key: 'price', width: 80, visible: true, order: 1 }, // NEW
  // ...
];
```

4. **Test all windows in both themes**

---

## Success Metrics

### User Experience Goals
- [ ] Data density: 30+ stocks visible without scrolling (1080p screen)
- [ ] Performance: <100ms for sorting/filtering 1000 stocks
- [ ] Accessibility: WCAG AA contrast ratios in both themes
- [ ] Load time: <2s for initial scanner load
- [ ] Refresh latency: <500ms for 5-second refresh

### Feature Adoption Targets
- 90%+ of users enable dark mode
- 70%+ of users customize columns
- 50%+ of users create multiple scanners
- 30%+ of users export to CSV
- 20%+ of users use heat map view

---

## Open Questions & Decisions Needed

1. **Chart Integration:**
   - TradingView widget (easy, but external dependency)?
   - lightweight-charts (more control, but more work)?
   - Both with user preference?

2. **Real-Time Data:**
   - Stick with 30s+ refresh for FMP API limits?
   - Add WebSocket support for future?
   - Implement optimistic updates?

3. **Mobile Responsiveness:**
   - Full mobile support (complex given drag/drop)?
   - Desktop-only with mobile read-only view?
   - Progressive enhancement approach?

4. **Data Persistence:**
   - Continue with localStorage?
   - Add optional cloud sync?
   - Export/import workspace configurations?

5. **Advanced Filters:**
   - Visual filter builder (like Finviz)?
   - Code-based filters (like TradingView Pine)?
   - Pre-built strategy templates?

---

## Conclusion

This comprehensive UI/UX overhaul will transform Market Movers from a functional tool into a **professional-grade trading platform** that competes with industry leaders.

### Immediate Next Steps (v0.4.0)
1. Implement dark/light theme system
2. Apply high-density table styling
3. Add enhanced color coding
4. Make columns sortable

### Timeline
- **v0.4.0-0.4.3:** 4 weeks (core visual + interactions)
- **v0.5.0:** 2 weeks (advanced features)
- **Total:** 6 weeks to professional-grade UI

The research shows that successful trading platforms prioritize:
1. **Data density** over whitespace
2. **Dark mode** as default
3. **Color coding** for quick insights
4. **Customization** for power users
5. **Performance** for real-time data

Our roadmap addresses all five priorities systematically.

---

**Ready to begin implementation? Let's start with Phase 1: Dark Mode + High-Density Tables.**
