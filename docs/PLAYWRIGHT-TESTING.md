# Playwright Testing Guide for Market Movers

## Overview

This project uses **Playwright** as a core testing and development tool. Playwright allows us to:

- ✅ Test the application in a real browser
- 📸 Capture screenshots for visual verification
- 🐛 Monitor console logs and errors
- 🎯 Validate UI elements and functionality
- 📊 Generate detailed test reports

## Why Playwright is Core to This Project

Playwright is not just a testing tool - it's a **development companion**:

1. **Real-Time Validation** - Test changes immediately after implementation
2. **Visual Feedback** - Screenshots show exactly what the UI looks like
3. **Error Detection** - Catch console errors and warnings early
4. **Performance Monitoring** - Track network requests and load times
5. **Documentation** - Screenshots serve as visual documentation

## Installation

Playwright is already installed! The setup includes:

```bash
npm install --save-dev playwright @playwright/test tsx
npx playwright install chromium
```

## Running Tests

### Quick Test (Recommended for Development)
```bash
npm run test:quick
```

This runs our custom test script that:
- Opens the app in headless browser
- Captures console logs and errors
- Takes screenshots
- Tests key functionality (theme toggle, UI elements)
- Generates a detailed JSON report

### Full Playwright Test Suite
```bash
npm test
```

Runs the full E2E test suite with Playwright Test Runner.

### UI Mode (Interactive)
```bash
npm run test:ui
```

Opens Playwright's interactive UI for debugging and developing tests.

### Headed Mode (See Browser)
```bash
npm run test:headed
```

Runs tests with the browser visible (useful for debugging).

## Test Output

After running `npm run test:quick`, you'll find:

### 1. Screenshots (`test-results/screenshots/`)
- `homepage.png` - Initial dark mode view
- `theme-toggled.png` - After toggling to light mode
- `error.png` - Captured automatically on test failures

### 2. Test Report (`test-results/test-report.json`)
Contains:
```json
{
  "url": "http://localhost:3000",
  "timestamp": "2025-10-26T...",
  "consoleLogs": [...],      // All console messages
  "errors": [],              // Console errors
  "warnings": [],            // Console warnings
  "pageTitle": "...",
  "screenshots": [...],      // Paths to screenshots
  "coverage": {
    "jsFiles": 4,            // Number of JS files loaded
    "cssFiles": 0,           // Number of CSS files loaded
    "networkRequests": 9     // Total network requests
  }
}
```

## Latest Test Results

**Last Run**: 2025-10-26

✅ **All Tests Passed!**

- **Console Logs**: 1 (React DevTools message only)
- **Errors**: 0 ❌
- **Warnings**: 0 ⚠️
- **Network Requests**: 9
- **JS Files Loaded**: 4
- **Page Title**: "Market Movers - Real-Time Stock Scanner"

### UI Elements Verified
- ✅ Sidebar with "Market Movers" branding
- ✅ Dashboard heading "Welcome to Market Movers"
- ✅ Status card
- ✅ Widgets card
- ✅ Live Data card
- ✅ Getting Started card
- ✅ Theme toggle functionality

## Writing New Tests

### Example: Testing a New Widget

```typescript
// tests/e2e/widget-test.spec.ts
import { test, expect } from '@playwright/test';

test('Top List Scanner widget displays correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Click Add Widget button
  await page.click('text=Add Widget');

  // Select Top List Scanner
  await page.click('text=Top List Scanner');

  // Verify widget appears
  await expect(page.locator('.widget-container')).toBeVisible();

  // Take screenshot
  await page.screenshot({
    path: 'test-results/screenshots/widget-added.png'
  });
});
```

## Custom Test Script

Our custom script (`scripts/test-with-playwright.ts`) is designed for rapid development feedback:

### Features
- 🔍 **Automatic Element Detection** - Finds key UI elements
- 📝 **Console Monitoring** - Captures all console output
- 🎨 **Theme Testing** - Tests dark/light mode switching
- 📸 **Visual Documentation** - Screenshots at each step
- 📊 **JSON Report** - Machine-readable test results

### Usage in Development

When building new features:

1. **Before**: Run `npm run test:quick` to establish baseline
2. **During**: Make code changes
3. **After**: Run `npm run test:quick` again
4. **Compare**: Check screenshots and console logs for changes

## Integration with Claude Code

Playwright is designed to work seamlessly with Claude Code development:

### When Claude Code Should Run Tests

- ✅ After implementing new UI components
- ✅ After fixing bugs
- ✅ Before marking features as complete
- ✅ When user reports visual issues
- ✅ After significant state management changes

### Example Workflow

```markdown
1. User: "Add a new scanner widget"
2. Claude: Implements widget code
3. Claude: Runs `npm run test:quick`
4. Claude: Reviews screenshots and console logs
5. Claude: Reports findings to user with visual proof
6. Claude: Fixes any issues found
7. Claude: Runs tests again to verify
```

## Continuous Integration

The Playwright config is CI-ready:

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Troubleshooting

### Test Fails to Start Server
```bash
# Make sure port 3000 is free
lsof -ti:3000 | xargs kill -9

# Then run tests
npm run test:quick
```

### Screenshots Not Capturing
```bash
# Check if Chromium is installed
npx playwright install chromium
```

### Tests Pass But Screenshots Look Wrong
- Check `test-results/screenshots/` directory
- Open images to visually inspect
- Compare with browser at http://localhost:3000

## Best Practices

### 1. Always Run Tests After Major Changes
```bash
npm run test:quick
```

### 2. Review Screenshots Visually
Don't just rely on pass/fail - look at the images!

### 3. Check Console Logs
Even passing tests might have warnings worth addressing.

### 4. Use Headed Mode for Debugging
```bash
npm run test:headed
```
Watch the browser to see exactly what's happening.

### 5. Keep Test Scripts Updated
As you add features, update `scripts/test-with-playwright.ts` to test them.

## Next Steps

### Planned Test Coverage

- [ ] Widget drag and drop testing
- [ ] Real-time data update verification
- [ ] Scanner configuration form testing
- [ ] WebSocket connection testing
- [ ] Layout persistence testing
- [ ] Error boundary testing
- [ ] Performance benchmarking

### Advanced Features to Add

1. **Visual Regression Testing** - Compare screenshots over time
2. **Performance Metrics** - Track load times and memory usage
3. **Accessibility Testing** - Automated a11y checks
4. **Mobile Testing** - Test responsive layouts
5. **API Mocking** - Test with mock data sources

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Test Generator](https://playwright.dev/docs/codegen)

---

**Remember**: Playwright is your development companion. Run tests often, review screenshots, and let it catch issues before they reach production! 🎭✨
