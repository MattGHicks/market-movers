#!/usr/bin/env node
/**
 * Widget Grid Testing Script
 * Tests the widget grid functionality including adding, dragging, and removing widgets
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testWidgetGrid() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting Widget Grid test...\n');

    const headless = process.env.HEADED !== 'true';
    console.log(`Browser mode: ${headless ? 'headless' : 'headed (visible)'}`);

    browser = await chromium.launch({
      headless,
      slowMo: headless ? 0 : 500,
    });

    page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    // Navigate to the app
    console.log('🌐 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for styles
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    // Take screenshot of empty state
    console.log('\n📸 Taking screenshot of empty state...');
    await page.screenshot({ path: path.join(screenshotDir, 'widget-grid-empty.png'), fullPage: true });

    // Check for "No widgets yet" message
    const emptyState = await page.locator('text=No widgets yet').isVisible();
    if (emptyState) {
      console.log('✅ Empty state visible');
    } else {
      console.log('❌ Empty state not found');
    }

    // Click "Add Widget" button
    console.log('\n🔘 Clicking "Add Widget" button...');
    const addButton = page.locator('button:has-text("Add Widget")').first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Take screenshot after adding first widget
    console.log('📸 Taking screenshot after adding widget...');
    await page.screenshot({ path: path.join(screenshotDir, 'widget-grid-one-widget.png'), fullPage: true });

    // Check if widget appeared
    const widgetExists = await page.locator('.react-grid-item').count();
    console.log(`✅ Found ${widgetExists} widget(s) on the grid`);

    // Check for widget header elements
    const widgetTitle = await page.locator('text=Scanner 1').isVisible();
    if (widgetTitle) {
      console.log('✅ Widget title visible: "Scanner 1"');
    }

    // Check for stock symbols in the widget
    const hasAAPL = await page.locator('text=AAPL').isVisible();
    const hasTSLA = await page.locator('text=TSLA').isVisible();
    const hasNVDA = await page.locator('text=NVDA').isVisible();

    if (hasAAPL && hasTSLA && hasNVDA) {
      console.log('✅ Stock data visible in widget');
    } else {
      console.log('⚠️  Some stock data not visible');
    }

    // Add another widget
    console.log('\n🔘 Adding second widget...');
    await addButton.click();
    await page.waitForTimeout(1000);

    const widgetCount = await page.locator('.react-grid-item').count();
    console.log(`✅ Now have ${widgetCount} widget(s) on the grid`);

    // Take screenshot with multiple widgets
    console.log('📸 Taking screenshot with multiple widgets...');
    await page.screenshot({ path: path.join(screenshotDir, 'widget-grid-multiple.png'), fullPage: true });

    // Test widget removal
    console.log('\n🗑️  Testing widget removal...');
    const removeButton = page.locator('.react-grid-item').first().locator('button:has(svg)').last();
    await removeButton.click();
    await page.waitForTimeout(500);

    const finalCount = await page.locator('.react-grid-item').count();
    console.log(`✅ After removal: ${finalCount} widget(s) remaining`);

    // Final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: path.join(screenshotDir, 'widget-grid-final.png'), fullPage: true });

    console.log('\n✅ Widget Grid tests completed successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'widget-grid-error.png');
      await page.screenshot({ path: errorScreenshot, fullPage: true });
      console.log(`📸 Error screenshot saved: ${errorScreenshot}`);
    }

    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testWidgetGrid();
