# News Flame Indicators Feature

## Overview
Implemented flame symbol indicators in scanner windows to show when tickers have recent news, with color-coded flames based on news age.

## Implementation Date
October 20, 2025

## Features

### 1. News Age API Endpoint
**File**: `app/api/news/recent/[symbol]/route.ts`

Checks the Financial Modeling Prep API for news published for a specific ticker and returns:
- `hasRecentNews`: News published within the last hour (red flame 🔥)
- `hasDayOldNews`: News published 1-24 hours ago (blue flame 🔥)

**Caching**: 60-second revalidation to reduce API calls

### 2. Scanner Window Integration
**File**: `components/windows/ScannerWindow.tsx`

**Features**:
- Automatically checks news status for all visible tickers
- Displays flame symbols in the SYMBOL column
- Re-checks every 2 minutes
- Two separate state sets:
  - `tickersWithRecentNews` - Red flame
  - `tickersWithDayOldNews` - Blue flame

**Visual Implementation**:
```typescript
{isSymbolColumn && hasRecentNews &&
  <span className="mr-1" style={{ filter: 'hue-rotate(0deg)' }}>🔥</span>}
{isSymbolColumn && !hasRecentNews && hasDayOldNews &&
  <span className="mr-1" style={{ filter: 'hue-rotate(200deg)' }}>🔥</span>}
```

### 3. News Window Enhancement
**File**: `components/windows/NewsWindow.tsx`

**Added Features**:
- Search input to filter news by ticker symbol
- "Search" button to apply filter
- "Clear" button to reset to all market news
- Enter key support for quick searching
- Real-time filtering with 1-minute refresh

**UI Components**:
- Ticker search input (uppercase auto-conversion)
- Search/Clear buttons with hover states
- Status indicator showing current filter

### 4. Workspace Scrolling Prevention
**File**: `components/WorkspaceGrid.tsx`

Changed from `overflow-auto` to `overflow-hidden` to prevent scrolling and ensure all windows fit within the viewport.

## Color Coding

| News Age | Flame Color | Implementation |
|----------|-------------|----------------|
| < 1 hour | Red 🔥 | Original emoji (hue-rotate: 0deg) |
| 1-24 hours | Blue 🔥 | Hue-rotated emoji (hue-rotate: 200deg) |
| > 24 hours | None | No flame displayed |

## Performance Optimizations

1. **API Caching**: 60-second revalidation on news endpoint
2. **Batch Requests**: All ticker news checks run in parallel with `Promise.all()`
3. **Re-check Interval**: 2 minutes to balance freshness vs API calls
4. **State Management**: Separate Sets for O(1) lookup performance

## User Workflow

### Viewing News Indicators
1. Open any scanner window (Gainers, Losers, Most Active)
2. Flame symbols appear automatically next to ticker symbols
3. Red flame = Very recent news (< 1 hour)
4. Blue flame = Recent news (1-24 hours)

### Filtering News by Ticker
1. Create a News window from the "New" menu
2. Type a ticker symbol in the search box
3. Press Enter or click "Search"
4. View all news for that specific ticker
5. Click "Clear" to return to general market news

## API Endpoint Details

### GET `/api/news/recent/[symbol]`

**Parameters**:
- `symbol` (path): Stock ticker symbol

**Response**:
```json
{
  "hasRecentNews": boolean,  // < 1 hour
  "hasDayOldNews": boolean   // 1-24 hours
}
```

**Error Handling**:
Returns `false` for both fields if:
- API call fails
- Ticker not found
- Network errors

## Files Modified

1. `app/api/news/recent/[symbol]/route.ts` - NEW
2. `components/windows/ScannerWindow.tsx` - MODIFIED
3. `components/windows/NewsWindow.tsx` - MODIFIED
4. `components/WorkspaceGrid.tsx` - MODIFIED (overflow-hidden)

## Future Enhancements

Potential improvements:
1. Click ticker to auto-filter News window
2. Tooltip showing news headline on hover
3. Configurable time thresholds
4. Different flame symbols for different news categories
5. Click flame to open news in separate window

## Testing

Tested scenarios:
- Multiple tickers with varying news ages
- API failures and timeout handling
- News window search functionality
- State updates across re-renders
- Performance with 20+ simultaneous ticker checks

## Notes

- Flame symbols use CSS `hue-rotate` filter for color changes
- News API limited to 5 most recent items per ticker for performance
- Scanner auto-refresh rate independent of news check interval
- News window refetches every 60 seconds
