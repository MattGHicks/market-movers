# Market Movers - Widget Guide

## Overview
Market Movers now includes **6 fully functional widgets** for comprehensive market analysis and tracking.

## Available Widgets

### 1. **Top List Scanner** ⭐
- **Icon**: BarChart
- **Description**: The most powerful widget - customizable scanner with advanced filters
- **Features**:
  - Filter by price range, volume, and change%
  - Sort by multiple criteria (price, volume, change%)
  - Sort order (ascending/descending)
  - Configurable max items (up to 50)
  - Real-time data updates
- **Use Cases**:
  - Find stocks matching specific criteria
  - **Top Gainers**: Sort by change% descending
  - **Top Losers**: Sort by change% ascending
  - **Volume Leaders**: Sort by volume descending
  - Screen for high volume stocks
  - Filter by price range for penny stocks or blue chips
  - Combine filters (e.g., high volume + positive change)

### 2. **Price Chart** 📊 (New!)
- **Icon**: LineChart
- **Description**: Professional TradingView Lightweight Charts integration
- **Features**:
  - **TradingView Lightweight Charts v5** - Industry-standard charting library
  - **Dynamic Resizing** - Chart adapts to both width and height changes
  - **Symbol Search** - Search and switch between any tracked stock
  - **Real-time Updates** - Price updates every 2 seconds
  - **Color-coded Lines** - Green for gains, red for losses
  - **High/Low/Volume Stats** - Key metrics below the chart
  - **50 Data Points** - Historical 5-minute interval data
  - **ResizeObserver** - Smooth resizing with react-grid-layout
- **Technical Details**:
  - Uses `LineSeries` API (v5 compatible)
  - Interval polling for data updates (not WebSocket)
  - Flexbox layout for proper height distribution
  - Line 257: `components/widgets/ChartWidget.tsx`
- **Use Case**: Track individual stock price movement with professional charting

### 3. **Alerts** 🔔 (New!)
- **Icon**: Bell
- **Description**: Create strategies and get alerts when conditions are met
- **Condition Types**:
  1. **Price Above** - Alert when price goes above threshold
  2. **Price Below** - Alert when price drops below threshold
  3. **Change Percent** - Alert on specific % gain/loss
  4. **Volume** - Alert on volume threshold
  5. **New High** - Alert on 50-period new high
  6. **New Low** - Alert on 50-period new low
- **Features**:
  - **Strategy Builder** - Create multiple strategies per widget
  - **Real-time Monitoring** - Checks conditions every 2 seconds
  - **Alert Feed** - Chronological list of triggered alerts
  - **Timestamps** - When each alert was triggered
  - **Remove Strategies** - Delete strategies you no longer need
  - **Price History Tracking** - Maintains 50 price points for high/low detection
- **Use Cases**:
  - Breakout notifications
  - Support/resistance alerts
  - Volume surge detection
  - New high/low tracking
  - Multiple strategy monitoring
- **Technical Details**:
  - Stores strategies in widget settings
  - Uses interval-based condition checking
  - Persists across page reloads
  - Line 1: `components/widgets/AlertWidget.tsx`

### 4. **Market Overview**
- **Icon**: BarChart3
- **Description**: Major market indices tracker
- **Indices Tracked**:
  - SPY (S&P 500)
  - QQQ (NASDAQ)
  - DIA (Dow Jones)
  - IWM (Russell 2000)
  - VIX (Volatility Index)
- **Features**:
  - Real-time price updates
  - Change % indicators
  - Trend arrows
- **Use Case**: Monitor overall market health

### 5. **Market News**
- **Icon**: Newspaper
- **Description**: Latest market news with sentiment analysis
- **Features**:
  - 8 latest news articles
  - Source attribution
  - Timestamp (relative time)
  - Sentiment tags (positive/negative/neutral)
  - Clickable headlines (external links)
- **Use Case**: Stay informed on market-moving events

### 6. **Watchlist**
- **Icon**: Star
- **Description**: Custom symbol tracker
- **Features**:
  - Add/remove symbols dynamically
  - Symbol validation
  - Real-time price tracking
  - Individual remove buttons (hover to reveal)
  - Empty state with instructions
- **Use Case**: Track your favorite stocks

## Widget Features

### Common Features
All widgets include:
- **Rename**: Click the pencil icon (hover over title)
- **Refresh**: Manual refresh button
- **Remove**: Delete widget from dashboard
- **Drag & Drop**: Reposition widgets
- **Resize**: Adjust widget size
- **Real-time Updates**: Live market data

### Ultra-Compact Design
- Minimal margins (2px)
- Small fonts (10px-12px)
- Tight spacing
- Efficient use of space
- Similar to ThinkorSwim/Webull aesthetics

## Market Data

### Simulator
- **30+ stocks** with realistic data
- **Brownian motion** price updates
- **2-second refresh** interval
- Volume and market cap calculations

### Available Symbols
AAPL, TSLA, NVDA, MSFT, GOOGL, AMZN, META, AMD, NFLX, COIN, PLTR, RIVN, LCID, NIO, SOFI, GME, AMC, HOOD, RBLX, SNAP, UBER, LYFT, ABNB, DKNG, PENN, SPCE, BB, NOK, WKHS, CLOV, and more...

## Getting Started

### Adding Widgets
1. Click **"Add Widget"** button in sidebar
2. Select widget type from dialog
3. Widget appears in next available position
4. Drag to reposition, resize as needed

### Using the Chart Widget
1. Add a "Price Chart" widget
2. Enter a symbol in the search box (e.g., "TSLA")
3. Press Enter or click the search button
4. Chart updates with the new symbol
5. Resize the widget - chart automatically adjusts
6. Watch real-time price updates every 2 seconds

### Using the Alert Widget
1. Add an "Alerts" widget
2. Click "Add Strategy" button
3. Configure:
   - Enter a symbol (e.g., "AAPL")
   - Choose condition type
   - Set threshold value
   - Give it a name
4. Click "Create Strategy"
5. Watch the alert feed for triggered conditions

### Managing Layout
- **Save Layout**: Click "Layout Manager" → "Save Layout"
- **Load Layout**: Click "Layout Manager" → Select saved layout
- **Organize Widgets**: Click "Widget Organizer" to see all widgets

### Theme
Toggle between Light/Dark/System themes via sidebar

## Technical Details

### Widget Registration
All widgets are registered in `/lib/widgets/index.ts`:
```typescript
widgetRegistry.register('widget-type', {
  type: 'widget-type',
  component: WidgetComponent,
  defaultConfig: { ... }
});
```

### Adding New Widgets
1. Create component in `/components/widgets/`
2. Register in `/lib/widgets/index.ts`
3. Add to `AddWidgetDialog.tsx`
4. Add defaults to `app/page.tsx`

### Chart Widget Implementation
- **Library**: `lightweight-charts` v5.0.9
- **Series Type**: `LineSeries` (v5 API)
- **Resize Strategy**: `ResizeObserver` for container dimensions
- **Data Format**: `{ time: number, value: number }[]`
- **Update Mechanism**: Interval polling (2 seconds)

### Alert Widget Implementation
- **Storage**: Widget settings in Zustand store
- **Condition Checking**: `setInterval` every 2 seconds
- **Price History**: Maintains last 50 prices for high/low detection
- **Alert Persistence**: Alerts stored in widget state

### Storage
- Layouts saved to localStorage
- Widget configurations persisted
- Zustand for state management
- Chart settings saved per widget

## Development Notes

### Chart Widget Evolution
The Chart Widget went through several iterations:
1. Initial: Attempted candlestick series (API mismatch)
2. Second: Attempted area series (API mismatch)
3. Final: Line series with v5 API (`chart.addSeries(LineSeries, options)`)

Key learnings:
- **v5 API Change**: Must use `chart.addSeries(SeriesType, options)` instead of `chart.addLineSeries(options)`
- **ResizeObserver**: Required for proper widget resizing (window resize events don't fire for grid layout changes)
- **Flexbox Layout**: Necessary for proper height distribution with dynamic content

### Git Worktrees
This project was developed using Git worktrees for parallel feature development:
- `market-movers` - main branch
- `market-movers-chart` - Chart Widget feature
- `market-movers-alerts` - Alert Widget feature

## Future Enhancements
- Real API integration (FMP/Alpha Vantage)
- Candlestick chart option
- Technical indicators (SMA, EMA, RSI, MACD)
- News filtering by symbol
- Alert notifications (browser/sound)
- Keyboard shortcuts for adding widgets
- Dark pool data integration
- Options flow widget
- Heat maps
- Sector performance widget
- More chart types (area, bar)
- Drawing tools on charts
- Chart annotations and trend lines
