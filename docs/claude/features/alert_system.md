# Feature: Alert & Notification System

**Date Started:** 2025-10-20
**Status:** Complete
**Owner:** Claude Code

## Overview
Real-time alert system that monitors stock price movements and notifies users when stocks exceed the configured alert threshold. Alerts appear as toast notifications in the top-right corner with automatic dismissal.

## Technical Details

### Components Created
- `context/AlertContext.tsx` - Global alert state management
- `components/AlertNotifications.tsx` - Visual alert display component
- `hooks/useAlertDetection.ts` - Logic for detecting significant price movements

### Alert Types
1. **Success (Green)** - Stock price increasing significantly
2. **Warning (Yellow)** - Stock price decreasing significantly
3. **Info (Blue)** - Informational messages
4. **Error (Red)** - System errors or API issues

### State Management
- React Context API for global alert queue
- Auto-dismiss after 10 seconds
- Manual dismiss via close button
- Supports multiple simultaneous alerts

## Data Flow
1. Market data updates every 30 seconds via React Query
2. `useAlertDetection` hook compares new data with previous values
3. When change exceeds `alertThreshold`, new alert is triggered
4. Alert added to global queue via `addAlert()`
5. `AlertNotifications` component renders all active alerts
6. Auto-removal after 10 seconds or manual dismiss

## MCP or Agent Integration
N/A - Pure client-side feature. Future integration points:
- MCP agent could analyze patterns and suggest alert thresholds
- Historical alert data could train ML models
- Alert aggregation for pattern recognition

## Key Features

### Auto-Detection
```typescript
// Monitors stock data and triggers alerts automatically
useAlertDetection(gainersData?.gainers, 'gainers');
useAlertDetection(losersData?.losers, 'losers');
useAlertDetection(activesData?.active, 'actives');
```

### Manual Alerts
```typescript
// Can be triggered from anywhere in the app
addAlert({
  type: 'success',
  title: 'AAPL Alert',
  message: 'Apple Inc. moved up significantly',
  stock: appleStock
});
```

### Alert Configuration
- **Alert Threshold**: Set in Settings page (default 5%)
- **Auto-Dismiss Time**: 10 seconds (hardcoded, could be configurable)
- **Max Alerts**: No limit (could add queue size limit)

## UI Features
- **Toast Notifications**: Non-intrusive top-right position
- **Slide-in Animation**: Smooth entrance from right
- **Color-Coded**: Visual distinction by alert type
- **Stock Info**: Shows symbol and percentage change
- **Dismissible**: X button to close manually
- **Stacked**: Multiple alerts stack vertically

## Testing & Validation

### Manual Testing Steps
1. ✅ Set alert threshold to 1% in Settings
2. ✅ Wait for market data refresh (30s)
3. ✅ Verify alerts appear for stocks exceeding 1% change
4. ✅ Test manual dismiss functionality
5. ✅ Verify auto-dismiss after 10 seconds
6. ✅ Test multiple simultaneous alerts
7. ✅ Verify different alert types render correctly

### Alert Detection Logic
- Compares current `changePercent` with previous value
- Triggers when absolute difference ≥ threshold
- Tracks each symbol independently
- Prevents duplicate alerts for same movement

## CSS & Animations

### Slide-in Animation
```css
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Responsive Design
- Fixed position on desktop
- Mobile-optimized (full width on small screens - future)
- Z-index 50 to appear above all content

## Future Improvements
- **Browser Notifications**: Request permission for system notifications
- **Sound Alerts**: Optional audio notification
- **Email/SMS Alerts**: Send alerts via external services
- **Alert History**: Log of all triggered alerts
- **Custom Alert Rules**: Beyond just price change percentage
  - Volume spikes
  - Price crosses moving average
  - News-driven alerts
- **Alert Filters**: Only alert for specific symbols or sectors
- **Priority Levels**: Critical vs informational alerts
- **Do Not Disturb**: Pause alerts during specific times
- **Alert Analytics**: Which stocks alert most frequently

## Performance Notes
- Lightweight context provider (< 1KB impact)
- CSS animations use GPU acceleration
- Auto-cleanup prevents memory leaks
- Minimal re-renders via React Context optimization

## Integration Points
- **AlertContext**: Wraps app in layout.tsx
- **AlertNotifications**: Rendered in layout (global)
- **useAlertDetection**: Called in dashboard page
- **Settings**: Configure alert threshold

## Browser Permissions
Currently doesn't require any browser permissions. Future features may need:
- Notification API permission (for system notifications)
- Audio playback (for sound alerts)

## Files Modified
- `app/layout.tsx` - Added AlertProvider and AlertNotifications
- `app/page.tsx` - Integrated useAlertDetection hooks
- `app/globals.css` - Added slide-in animation

## Related Documentation
- [Settings Page](./settings_page.md)
- [Filtering System](./filtering_system.md)
