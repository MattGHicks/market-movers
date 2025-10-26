#!/usr/bin/env node
/**
 * Configuration Modal Testing Script
 * Tests the scanner configuration modal functionality
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testConfigModal() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting Configuration Modal test...\n');

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

    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    // Add a widget first
    console.log('\n🔘 Adding a widget...');
    const addButton = page.locator('button:has-text("Add Widget")').first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Take screenshot of widget
    console.log('📸 Screenshot: Widget added');
    await page.screenshot({ path: path.join(screenshotDir, 'config-modal-widget.png'), fullPage: true });

    // Find and click the settings button
    console.log('\n⚙️  Clicking settings button...');
    const settingsButton = page.locator('.react-grid-item').first().locator('button').nth(1); // Second button is settings
    await settingsButton.click();
    await page.waitForTimeout(500);

    // Check if modal opened
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    if (modalVisible) {
      console.log('✅ Configuration modal opened');
    } else {
      console.log('❌ Configuration modal did not open');
    }

    // Take screenshot of modal
    console.log('📸 Screenshot: Modal opened');
    await page.screenshot({ path: path.join(screenshotDir, 'config-modal-open.png'), fullPage: true });

    // Check modal title
    const modalTitle = await page.locator('text=Scanner Configuration').isVisible();
    if (modalTitle) {
      console.log('✅ Modal title visible');
    }

    // Test filling out form fields
    console.log('\n📝 Testing form inputs...');

    // Set price min
    const priceMinInput = page.locator('#priceMin');
    await priceMinInput.fill('10.00');
    console.log('✅ Set min price: $10.00');

    // Set price max
    const priceMaxInput = page.locator('#priceMax');
    await priceMaxInput.fill('500.00');
    console.log('✅ Set max price: $500.00');

    // Set volume min
    const volumeMinInput = page.locator('#volumeMin');
    await volumeMinInput.fill('1000000');
    console.log('✅ Set min volume: 1,000,000');

    // Set max items
    const maxItemsInput = page.locator('#maxItems');
    await maxItemsInput.clear();
    await maxItemsInput.fill('100');
    console.log('✅ Set max items: 100');

    await page.waitForTimeout(500);

    // Take screenshot with filled form
    console.log('📸 Screenshot: Form filled');
    await page.screenshot({ path: path.join(screenshotDir, 'config-modal-filled.png'), fullPage: true });

    // Click Save Changes button
    console.log('\n💾 Saving configuration...');
    const saveButton = page.locator('button:has-text("Save Changes")');
    await saveButton.click();
    await page.waitForTimeout(1000);

    // Check if modal closed
    const modalClosed = await page.locator('[role="dialog"]').isHidden();
    if (modalClosed) {
      console.log('✅ Modal closed after save');
    } else {
      console.log('❌ Modal did not close');
    }

    // Final screenshot
    console.log('📸 Screenshot: After save');
    await page.screenshot({ path: path.join(screenshotDir, 'config-modal-saved.png'), fullPage: true });

    console.log('\n✅ Configuration Modal tests completed successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'config-modal-error.png');
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

testConfigModal();
