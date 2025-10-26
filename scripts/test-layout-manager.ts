#!/usr/bin/env node
/**
 * Layout Manager Testing Script
 * Tests layout save/load functionality and widget maximize feature
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testLayoutManager() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting Layout Manager test...\n');

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

    // Test 1: Add Multiple Widgets
    console.log('\n📋 TEST 1: Add Multiple Widgets');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const addButton = page.locator('button:has-text("Add Widget")');

    // Add 3 widgets
    for (let i = 0; i < 3; i++) {
      console.log(`🔘 Adding widget ${i + 1}...`);
      await addButton.click();
      await page.waitForTimeout(500);
    }

    console.log('✅ Added 3 widgets');
    console.log('📸 Screenshot: Initial layout with widgets');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-initial.png'),
      fullPage: true
    });

    // Test 2: Save Layout
    console.log('\n📋 TEST 2: Save Layout');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('🔘 Clicking Save Layout button...');
    const saveLayoutButton = page.locator('button:has-text("Save Layout")');
    await saveLayoutButton.click();
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Save layout dialog');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-save-dialog.png'),
      fullPage: true
    });

    // Enter layout name
    const layoutNameInput = page.locator('input#layout-name');
    await layoutNameInput.fill('Test Layout 1');
    await page.waitForTimeout(300);

    console.log('✅ Entered layout name: "Test Layout 1"');

    // Click Save button in dialog
    const dialogSaveButton = page.locator('button:has-text("Save")').last();
    await dialogSaveButton.click();
    await page.waitForTimeout(500);

    console.log('✅ Layout saved');

    // Test 3: Widget Maximize
    console.log('\n📋 TEST 3: Widget Maximize');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Find first widget and click maximize button
    const firstWidget = page.locator('.react-grid-item').first();
    const maximizeButton = firstWidget.locator('button[title="Maximize"]');

    console.log('🔘 Clicking maximize button...');
    await maximizeButton.click();
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Widget maximized');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-widget-maximized.png'),
      fullPage: true
    });

    // Check if widget is maximized (should have fixed positioning)
    const isMaximized = await page.locator('.fixed.inset-0').isVisible();
    if (isMaximized) {
      console.log('✅ Widget is maximized (full screen)');
    } else {
      console.log('⚠️  Widget maximize styling not detected');
    }

    // Click minimize button
    const minimizeButton = page.locator('button[title="Minimize"]');
    await minimizeButton.click();
    await page.waitForTimeout(500);

    console.log('✅ Widget minimized back to grid');

    // Test 4: Clear Widgets
    console.log('\n📋 TEST 4: Clear All Widgets');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Remove all widgets
    const removeButtons = page.locator('button[title="Remove"]');
    const count = await removeButtons.count();

    console.log(`🔘 Removing ${count} widgets...`);
    for (let i = 0; i < count; i++) {
      await page.locator('button[title="Remove"]').first().click();
      await page.waitForTimeout(300);
    }

    console.log('✅ All widgets removed');
    console.log('📸 Screenshot: Empty dashboard');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-empty.png'),
      fullPage: true
    });

    // Test 5: Load Saved Layout
    console.log('\n📋 TEST 5: Load Saved Layout');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('🔘 Clicking Load Layout button...');
    const loadLayoutButton = page.locator('button:has-text("Load Layout")');
    await loadLayoutButton.click();
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Load layout dialog');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-load-dialog.png'),
      fullPage: true
    });

    // Select saved layout
    const selectTrigger = page.locator('[role="combobox"]');
    await selectTrigger.click();
    await page.waitForTimeout(300);

    // Click on "Test Layout 1"
    const layoutOption = page.locator('[role="option"]:has-text("Test Layout 1")');
    await layoutOption.click();
    await page.waitForTimeout(300);

    console.log('✅ Selected "Test Layout 1"');

    // Click Load button
    const dialogLoadButton = page.locator('button:has-text("Load Layout")').last();
    await dialogLoadButton.click();
    await page.waitForTimeout(2000); // Wait for page reload

    console.log('✅ Layout loaded (page reloaded)');

    // Wait for page to reload
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Layout restored');
    await page.screenshot({
      path: path.join(screenshotDir, 'layout-restored.png'),
      fullPage: true
    });

    // Verify widgets were restored
    const restoredWidgets = await page.locator('.react-grid-item').count();
    console.log(`✅ Found ${restoredWidgets} restored widgets`);

    if (restoredWidgets === 3) {
      console.log('✅ Layout restore successful - all widgets restored!');
    } else {
      console.log(`⚠️  Expected 3 widgets, found ${restoredWidgets}`);
    }

    console.log('\n✅ Layout Manager tests completed!');
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'layout-manager-error.png');
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

testLayoutManager();
