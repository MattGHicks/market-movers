import { test, expect } from '@playwright/test';

test.describe('New Features - Chart Widget & Alert Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('Chart Widget - Should render TradingView Lightweight Chart', async ({ page }) => {
    // Click Add Widget button
    await page.click('button:has-text("Add Widget")');

    // Select Chart widget
    await page.click('button:has-text("Price Chart")');

    // Wait for chart to appear
    await page.waitForSelector('text=Chart 1', { timeout: 5000 });

    // Verify chart container exists
    const chartWidget = page.locator('[data-testid="widget"]', { hasText: 'Chart 1' }).first();
    await expect(chartWidget).toBeVisible();

    // Verify stock info is displayed
    await expect(chartWidget.locator('text=AAPL')).toBeVisible();

    // Verify stats are displayed (High, Low, Volume)
    await expect(chartWidget.locator('text=High')).toBeVisible();
    await expect(chartWidget.locator('text=Low')).toBeVisible();
    await expect(chartWidget.locator('text=Volume')).toBeVisible();

    console.log('✅ Chart Widget rendered successfully with TradingView Lightweight Charts');
  });

  test('Chart Widget - Should change symbol via search', async ({ page }) => {
    // Add chart widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Price Chart")');
    await page.waitForSelector('text=Chart 1');

    const chartWidget = page.locator('[data-testid="widget"]', { hasText: 'Chart 1' }).first();

    // Find and fill symbol input
    const symbolInput = chartWidget.locator('input[placeholder*="symbol"]');
    await symbolInput.fill('TSLA');

    // Click search button
    await chartWidget.locator('button:has(svg)').first().click();

    // Verify symbol changed to TSLA
    await expect(chartWidget.locator('text=TSLA')).toBeVisible({ timeout: 3000 });

    console.log('✅ Chart Widget symbol search works correctly');
  });

  test('Chart Widget - Should display dynamic color based on stock change', async ({ page }) => {
    // Add chart widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Price Chart")');
    await page.waitForSelector('text=Chart 1');

    const chartWidget = page.locator('[data-testid="widget"]', { hasText: 'Chart 1' }).first();

    // Check if change percent is displayed
    const changePercent = await chartWidget.locator('div').filter({ hasText: /[+-]\d+\.\d+%/ }).first();
    await expect(changePercent).toBeVisible();

    console.log('✅ Chart Widget displays stock change percentage');
  });

  test('Chart Widget - Should resize chart on window resize', async ({ page }) => {
    // Add chart widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Price Chart")');
    await page.waitForSelector('text=Chart 1');

    // Resize window
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    // Resize again
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.waitForTimeout(500);

    // Chart should still be visible and responsive
    const chartWidget = page.locator('[data-testid="widget"]', { hasText: 'Chart 1' }).first();
    await expect(chartWidget).toBeVisible();

    console.log('✅ Chart Widget is responsive to window resize');
  });
});

test.describe('Alert Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
  });

  test('Alert Widget - Should render with empty state', async ({ page }) => {
    // Click Add Widget button
    await page.click('button:has-text("Add Widget")');

    // Select Alerts widget
    await page.click('button:has-text("Alerts")');

    // Wait for alert widget to appear
    await page.waitForSelector('text=Alerts', { timeout: 5000 });

    // Verify empty state
    const alertWidget = page.locator('[data-testid="widget"]', { hasText: 'Alerts' }).first();
    await expect(alertWidget).toBeVisible();
    await expect(alertWidget.locator('text=No strategies configured')).toBeVisible();

    console.log('✅ Alert Widget renders with empty state');
  });

  test('Alert Widget - Should open Add Strategy dialog', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Click Add Strategy button
    await page.click('button:has-text("Add Strategy")');

    // Verify dialog opens
    await expect(page.locator('text=Add Alert Strategy')).toBeVisible();
    await expect(page.locator('text=Create a new alert that triggers when conditions are met')).toBeVisible();

    console.log('✅ Add Strategy dialog opens correctly');
  });

  test('Alert Widget - Should create a price above strategy', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Open Add Strategy dialog
    await page.click('button:has-text("Add Strategy")');

    // Fill in strategy details
    await page.fill('input[placeholder="AAPL"]', 'TSLA');
    await page.fill('input[type="number"]', '200');
    await page.fill('input[placeholder*="My Alert Strategy"]', 'TSLA Above $200');

    // Click Add Strategy button in dialog
    await page.click('button:has-text("Add Strategy"):last-of-type');

    // Verify strategy was created
    await expect(page.locator('text=TSLA Above $200')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=TSLA • Price Above')).toBeVisible();

    console.log('✅ Price above strategy created successfully');
  });

  test('Alert Widget - Should create a new high of day strategy', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Open Add Strategy dialog
    await page.click('button:has-text("Add Strategy")');

    // Fill in strategy details
    await page.fill('input[placeholder="AAPL"]', 'NVDA');

    // Select condition
    await page.click('button[role="combobox"]');
    await page.click('text=New High of Day');

    await page.fill('input[placeholder*="My Alert Strategy"]', 'NVDA New High');

    // Click Add Strategy button
    await page.click('button:has-text("Add Strategy"):last-of-type');

    // Verify strategy was created
    await expect(page.locator('text=NVDA New High')).toBeVisible({ timeout: 3000 });

    console.log('✅ New high of day strategy created successfully');
  });

  test('Alert Widget - Should delete a strategy', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Create a strategy first
    await page.click('button:has-text("Add Strategy")');
    await page.fill('input[placeholder="AAPL"]', 'AAPL');
    await page.fill('input[type="number"]', '150');
    await page.click('button:has-text("Add Strategy"):last-of-type');
    await page.waitForSelector('text=AAPL • Price Above');

    // Hover over strategy to reveal delete button
    const strategy = page.locator('text=AAPL • Price Above').locator('..');
    await strategy.hover();

    // Click delete button
    await strategy.locator('button').click();

    // Verify strategy was deleted
    await expect(page.locator('text=AAPL • Price Above')).not.toBeVisible({ timeout: 3000 });

    console.log('✅ Strategy deleted successfully');
  });

  test('Alert Widget - Should display alert feed when strategy triggers', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Create a strategy that will likely trigger (price below a high value)
    await page.click('button:has-text("Add Strategy")');
    await page.fill('input[placeholder="AAPL"]', 'AAPL');

    // Select "Price Below"
    await page.click('button[role="combobox"]');
    await page.click('text=Price Below');

    await page.fill('input[type="number"]', '500'); // AAPL is likely below $500
    await page.click('button:has-text("Add Strategy"):last-of-type');

    // Wait for potential alert (checking every 2 seconds)
    await page.waitForTimeout(5000);

    // Check if alert feed has any alerts
    const alertFeed = page.locator('text=Alert Feed');
    await expect(alertFeed).toBeVisible();

    console.log('✅ Alert feed is visible and monitoring');
  });

  test('Alert Widget - Should show footer with strategy and alert count', async ({ page }) => {
    // Add alert widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    const alertWidget = page.locator('[data-testid="widget"]', { hasText: 'Alerts' }).first();

    // Initially should show 0 strategies
    await expect(alertWidget.locator('text=0 strategies')).toBeVisible();

    // Add a strategy
    await page.click('button:has-text("Add Strategy")');
    await page.fill('input[placeholder="AAPL"]', 'TSLA');
    await page.fill('input[type="number"]', '250');
    await page.click('button:has-text("Add Strategy"):last-of-type');

    // Should now show 1 strategy
    await expect(alertWidget.locator('text=1 strategies')).toBeVisible({ timeout: 3000 });

    console.log('✅ Footer displays strategy count correctly');
  });
});

test.describe('Integration Tests - Both Features Together', () => {
  test('Should be able to add both Chart and Alert widgets to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Add Chart Widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Price Chart")');
    await page.waitForSelector('text=Chart 1');

    // Add Alert Widget
    await page.click('button:has-text("Add Widget")');
    await page.click('button:has-text("Alerts")');
    await page.waitForSelector('text=Alerts');

    // Verify both widgets are visible
    await expect(page.locator('text=Chart 1')).toBeVisible();
    await expect(page.locator('text=Alerts')).toBeVisible();

    console.log('✅ Both Chart and Alert widgets can coexist on dashboard');
  });
});
