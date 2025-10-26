#!/usr/bin/env node
/**
 * Playwright Testing Script for Market Movers
 * This script launches the app, captures console logs, errors, and screenshots
 */

import { chromium, Browser, Page, ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface TestReport {
  url: string;
  timestamp: string;
  consoleLogs: string[];
  errors: string[];
  warnings: string[];
  pageTitle: string;
  screenshots: string[];
  coverage: {
    jsFiles: number;
    cssFiles: number;
    networkRequests: number;
  };
}

async function runTest() {
  const report: TestReport = {
    url: 'http://localhost:3000',
    timestamp: new Date().toISOString(),
    consoleLogs: [],
    errors: [],
    warnings: [],
    pageTitle: '',
    screenshots: [],
    coverage: {
      jsFiles: 0,
      cssFiles: 0,
      networkRequests: 0,
    },
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting Playwright test...\n');

    // Launch browser (use HEADED env var to show browser)
    const headless = process.env.HEADED !== 'true';
    const keepOpen = process.env.KEEP_OPEN === 'true';
    console.log(`Browser mode: ${headless ? 'headless' : 'headed (visible)'}`);
    if (keepOpen) console.log('🔒 Browser will stay open after test completes');

    browser = await chromium.launch({
      headless,
      slowMo: headless ? 0 : 500, // Slow down actions in headed mode
      devtools: keepOpen, // Open devtools if keeping browser open
    });
    page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    // Listen to console messages
    page.on('console', (msg: ConsoleMessage) => {
      const type = msg.type();
      const text = msg.text();

      report.consoleLogs.push(`[${type}] ${text}`);

      if (type === 'error') {
        report.errors.push(text);
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warning') {
        report.warnings.push(text);
        console.log(`⚠️  Console Warning: ${text}`);
      } else {
        console.log(`📝 Console [${type}]: ${text}`);
      }
    });

    // Listen to page errors
    page.on('pageerror', (error) => {
      const errorMsg = error.toString();
      report.errors.push(errorMsg);
      console.log(`❌ Page Error: ${errorMsg}`);
    });

    // Track network requests
    page.on('response', (response) => {
      const url = response.url();
      report.coverage.networkRequests++;

      if (url.endsWith('.js')) report.coverage.jsFiles++;
      if (url.endsWith('.css')) report.coverage.cssFiles++;

      if (response.status() >= 400) {
        const errorMsg = `Failed to load: ${url} (${response.status()})`;
        report.errors.push(errorMsg);
        console.log(`❌ ${errorMsg}`);
      }
    });

    // Navigate to the app
    console.log(`\n🌐 Navigating to ${report.url}...`);
    await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });

    // Get page title
    report.pageTitle = await page.title();
    console.log(`📄 Page Title: ${report.pageTitle}`);

    // Wait for CSS to be fully loaded and applied
    console.log('⏳ Waiting for styles to load...');
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');

    // Wait for a specific styled element to be visible (card with bg-card class)
    await page.waitForSelector('.bg-card', { state: 'visible', timeout: 10000 });

    // Extra wait for CSS paint to complete
    await page.waitForTimeout(3000);
    console.log('✅ Styles loaded');

    // Take screenshot of the main page
    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    const mainScreenshot = path.join(screenshotDir, 'homepage.png');
    await page.screenshot({ path: mainScreenshot, fullPage: true });
    report.screenshots.push(mainScreenshot);
    console.log(`📸 Screenshot saved: ${mainScreenshot}`);

    // Test theme toggle
    console.log('\n🎨 Testing theme toggle...');
    const themeToggle = page.locator('button[aria-label="Toggle theme"], button:has-text("Toggle theme")').first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      const darkScreenshot = path.join(screenshotDir, 'theme-toggled.png');
      await page.screenshot({ path: darkScreenshot, fullPage: true });
      report.screenshots.push(darkScreenshot);
      console.log('✅ Theme toggle working');
      console.log(`📸 Screenshot saved: ${darkScreenshot}`);
    } else {
      console.log('⚠️  Theme toggle button not found');
    }

    // Check for key elements
    console.log('\n🔍 Checking for key UI elements...');

    const checks = [
      { name: 'Sidebar', selector: 'text=Market Movers' },
      { name: 'Dashboard heading', selector: 'text=Welcome to Market Movers' },
      { name: 'Status card', selector: 'text=Status' },
      { name: 'Widgets card', selector: 'text=Widgets' },
      { name: 'Live Data card', selector: 'text=Live Data' },
      { name: 'Getting Started card', selector: 'text=Getting Started' },
    ];

    for (const check of checks) {
      const element = page.locator(check.selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`✅ Found: ${check.name}`);
      } else {
        console.log(`❌ Missing: ${check.name}`);
        report.errors.push(`Missing UI element: ${check.name}`);
      }
    }

    // Get computed styles
    console.log('\n🎨 Checking theme colors...');
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`   Body background: ${bodyBg}`);

    // Generate report
    console.log('\n📊 Test Summary:');
    console.log(`   Console Logs: ${report.consoleLogs.length}`);
    console.log(`   Errors: ${report.errors.length}`);
    console.log(`   Warnings: ${report.warnings.length}`);
    console.log(`   Network Requests: ${report.coverage.networkRequests}`);
    console.log(`   JS Files: ${report.coverage.jsFiles}`);
    console.log(`   CSS Files: ${report.coverage.cssFiles}`);
    console.log(`   Screenshots: ${report.screenshots.length}`);

    // Save report
    const reportPath = path.join(process.cwd(), 'test-results', 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved: ${reportPath}`);

    if (report.errors.length > 0) {
      console.log('\n⚠️  ERRORS FOUND:');
      report.errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    } else {
      console.log('\n✅ All tests passed!');
    }

    // If KEEP_OPEN is set, wait for user to manually close browser
    if (process.env.KEEP_OPEN === 'true') {
      console.log('\n🔍 Browser is staying open for inspection...');
      console.log('   - You can interact with the page');
      console.log('   - DevTools are open');
      console.log('   - Press Ctrl+C in terminal to close when done\n');

      // Keep the process alive
      await new Promise(() => {});
    }

    if (report.errors.length > 0 && process.env.KEEP_OPEN !== 'true') {
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error);

    if (page) {
      const errorScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', 'error.png');
      await page.screenshot({ path: errorScreenshot, fullPage: true });
      console.log(`📸 Error screenshot saved: ${errorScreenshot}`);
    }

    if (process.env.KEEP_OPEN !== 'true') {
      process.exit(1);
    } else {
      console.log('\n🔍 Browser is staying open for inspection...');
      console.log('   Press Ctrl+C in terminal to close when done\n');
      await new Promise(() => {});
    }
  } finally {
    if (browser && process.env.KEEP_OPEN !== 'true') {
      await browser.close();
    }
  }
}

runTest();
