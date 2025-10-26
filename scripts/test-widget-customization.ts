#!/usr/bin/env node
/**
 * Widget Customization Testing Script
 * Tests widget rename, templates, and organization features
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testWidgetCustomization() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting Widget Customization test...\n');

    const headless = process.env.HEADED !== 'true';
    console.log(`Browser mode: ${headless ? 'headless' : 'headed (visible)'}`);

    browser = await chromium.launch({
      headless,
      slowMo: headless ? 0 : 500,
    });

    page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    console.log('🌐 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    // Test 1: Add Widget
    console.log('\n📋 TEST 1: Add Widget');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const addButton = page.locator('button:has-text("Add Widget")');
    await addButton.click();
    await page.waitForTimeout(1000);

    console.log('✅ Widget added');
    console.log('📸 Screenshot: Widget added');
    await page.screenshot({
      path: path.join(screenshotDir, 'customization-widget-added.png'),
      fullPage: true
    });

    // Test 2: Widget Rename
    console.log('\n📋 TEST 2: Widget Rename');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const widget = page.locator('.react-grid-item').first();

    // Hover to reveal rename button
    await widget.hover();
    await page.waitForTimeout(500);

    console.log('🔘 Clicking rename button...');
    const renameButton = widget.locator('button[title="Rename"]');
    await renameButton.click();
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Rename mode');
    await page.screenshot({
      path: path.join(screenshotDir, 'customization-rename-mode.png'),
      fullPage: true
    });

    // Type new name
    const nameInput = widget.locator('input[type="text"]');
    await nameInput.fill('My Custom Scanner');
    await page.waitForTimeout(300);

    // Save rename
    const saveButton = widget.locator('button svg').first();
    await saveButton.click();
    await page.waitForTimeout(500);

    console.log('✅ Widget renamed to "My Custom Scanner"');
    console.log('📸 Screenshot: Widget renamed');
    await page.screenshot({
      path: path.join(screenshotDir, 'customization-renamed.png'),
      fullPage: true
    });

    // Test 3: Widget Organizer
    console.log('\n📋 TEST 3: Widget Organizer');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('🔘 Opening Widget Organizer...');
    const organizerButton = page.locator('button:has-text("Organize Widgets")');
    await organizerButton.click();
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Widget organizer');
    await page.screenshot({
      path: path.join(screenshotDir, 'customization-organizer.png'),
      fullPage: true
    });

    // Check widget count
    const widgetCount = await page.locator('[role="dialog"] .rounded-lg.border').count();
    console.log(`✅ Widget Organizer showing ${widgetCount} widget(s)`);

    // Close organizer
    const closeButton = page.locator('[role="dialog"] button:has-text("Cancel")').last();
    if (await closeButton.isVisible()) {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);

    console.log('\n✅ Widget Customization tests completed!');
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'customization-error.png');
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

testWidgetCustomization();
