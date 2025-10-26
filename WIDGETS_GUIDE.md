# Market Movers - Widget Guide

## Overview
Market Movers now includes **5 fully functional widgets** for comprehensive market analysis and tracking.

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

### 2. **Price Chart**
- **Icon**: LineChart
- **Description**: Real-time price chart with symbol search
- **Features**:
  - Line chart with area fill
  - Symbol search and switching
  - High/Low/Volume stats
  - Simulated 5-minute intervals (20 data points)
  - Color-coded (green for gains, red for losses)
- **Use Case**: Track individual stock price movement

### 3. **Market Overview**
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

### 4. **Market News**
- **Icon**: Newspaper
- **Description**: Latest market news with sentiment analysis
- **Features**:
  - 8 latest news articles
  - Source attribution
  - Timestamp (relative time)
  - Sentiment tags (positive/negative/neutral)
  - Clickable headlines (external links)
- **Use Case**: Stay informed on market-moving events

### 5. **Watchlist**
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

### Storage
- Layouts saved to localStorage
- Widget configurations persisted
- Zustand for state management

## Future Enhancements
- Real API integration
- More chart types (candlestick, indicators)
- News filtering by symbol
- Alerts and notifications
- Keyboard shortcuts
- Dark pool data
- Options flow
- Heat maps
- Sector performance
