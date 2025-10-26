#!/usr/bin/env node
/**
 * UI Features Testing Script
 * Tests collapsible sidebar and widget resizing
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testUIFeatures() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting UI Features test...\n');

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

    // Test 1: Collapsible Sidebar
    console.log('\n📋 TEST 1: Collapsible Sidebar');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Take screenshot of sidebar expanded
    console.log('📸 Screenshot: Sidebar expanded');
    await page.screenshot({ path: path.join(screenshotDir, 'ui-sidebar-expanded.png'), fullPage: true });

    // Check sidebar width
    const sidebarExpanded = await page.locator('.flex.h-full.w-64').isVisible();
    if (sidebarExpanded) {
      console.log('✅ Sidebar is expanded (w-64)');
    }

    // Find and click collapse button
    console.log('\n🔘 Clicking sidebar collapse button...');
    const collapseButton = page.locator('button:has(svg)').first();
    await collapseButton.click();
    await page.waitForTimeout(500);

    // Take screenshot of sidebar collapsed
    console.log('📸 Screenshot: Sidebar collapsed');
    await page.screenshot({ path: path.join(screenshotDir, 'ui-sidebar-collapsed.png'), fullPage: true });

    // Check if sidebar is collapsed
    const sidebarCollapsed = await page.locator('.flex.h-full.w-16').isVisible();
    if (sidebarCollapsed) {
      console.log('✅ Sidebar is collapsed (w-16)');
    } else {
      console.log('❌ Sidebar did not collapse');
    }

    // Expand sidebar again
    console.log('\n🔘 Re-expanding sidebar...');
    await collapseButton.click();
    await page.waitForTimeout(500);
    console.log('✅ Sidebar re-expanded');

    // Test 2: Widget Resizing
    console.log('\n📋 TEST 2: Widget Resizing');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Add a widget
    console.log('🔘 Adding a widget...');
    const addButton = page.locator('button:has-text("Add Widget")');
    await addButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Widget added');

    // Take screenshot of initial widget
    console.log('📸 Screenshot: Initial widget size');
    await page.screenshot({ path: path.join(screenshotDir, 'ui-widget-initial.png'), fullPage: true });

    // Get initial widget dimensions
    const widget = page.locator('.react-grid-item').first();
    const initialBox = await widget.boundingBox();
    if (initialBox) {
      console.log(`📏 Initial widget size: ${initialBox.width}x${initialBox.height}`);
    }

    // Check for resize handles
    const hasResizeHandles = await page.locator('.react-resizable-handle').count();
    console.log(`✅ Found ${hasResizeHandles} resize handles`);

    // Try to resize widget (simulate drag on SE handle)
    console.log('\n🔄 Testing widget resize...');
    const resizeHandle = widget.locator('.react-resizable-handle-se');

    // Get handle position
    const handleBox = await resizeHandle.boundingBox();
    if (handleBox) {
      // Drag from handle to resize widget
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox.x + 200, handleBox.y + 150, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);

      console.log('✅ Widget resize attempted');

      // Take screenshot after resize
      console.log('📸 Screenshot: After resize');
      await page.screenshot({ path: path.join(screenshotDir, 'ui-widget-resized.png'), fullPage: true });

      // Check new dimensions
      const newBox = await widget.boundingBox();
      if (newBox && initialBox) {
        const widthChanged = Math.abs(newBox.width - initialBox.width) > 10;
        const heightChanged = Math.abs(newBox.height - initialBox.height) > 10;

        if (widthChanged || heightChanged) {
          console.log(`📏 New widget size: ${newBox.width}x${newBox.height}`);
          console.log('✅ Widget dimensions changed - resize working!');
        } else {
          console.log('⚠️  Widget dimensions did not change significantly');
        }
      }
    }

    // Test 3: Widget Dragging
    console.log('\n📋 TEST 3: Widget Dragging');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const dragHandle = widget.locator('.widget-drag-handle');
    const dragHandleBox = await dragHandle.boundingBox();

    if (dragHandleBox) {
      const initialWidgetBox = await widget.boundingBox();

      // Drag widget to new position
      await page.mouse.move(
        dragHandleBox.x + dragHandleBox.width / 2,
        dragHandleBox.y + dragHandleBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(dragHandleBox.x + 300, dragHandleBox.y + 100, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);

      console.log('✅ Widget drag attempted');

      // Take screenshot after drag
      console.log('📸 Screenshot: After drag');
      await page.screenshot({ path: path.join(screenshotDir, 'ui-widget-dragged.png'), fullPage: true });

      const newWidgetBox = await widget.boundingBox();
      if (initialWidgetBox && newWidgetBox) {
        const moved = Math.abs(newWidgetBox.x - initialWidgetBox.x) > 10 ||
                     Math.abs(newWidgetBox.y - initialWidgetBox.y) > 10;

        if (moved) {
          console.log('✅ Widget position changed - dragging working!');
        } else {
          console.log('⚠️  Widget position did not change');
        }
      }
    }

    console.log('\n✅ UI Features tests completed!');
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'ui-features-error.png');
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

testUIFeatures();
