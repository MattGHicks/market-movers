# Playwright MCP Setup Guide

**Date:** 2025-10-20
**Status:** Configured
**Version:** v0.3.0+

## Overview

This guide documents the setup process for Playwright MCP (Model Context Protocol) integration with Market Movers. Playwright MCP enables automated browser testing, screenshot capture, and visual regression testing for the workspace system.

## What is MCP?

Model Context Protocol (MCP) allows Claude Code to integrate with external tools and services. The Playwright MCP server provides browser automation capabilities directly within the Claude Code environment.

## Prerequisites

- Node.js 18+ installed
- Market Movers project cloned and running
- Claude Code CLI installed

## Installation Steps

### 1. Install Playwright Dependencies

Install the Playwright MCP server and Playwright locally in your project:

```bash
npm install --save-dev @executeautomation/playwright-mcp-server playwright
```

**Why local installation?**
- Ensures browser version compatibility between MCP server and Playwright
- Avoids version mismatches that occur with global installations
- Project-specific configuration

### 2. Install Playwright Browsers

After installing the packages, install the required browsers:

```bash
npx playwright install
```

This will install:
- Chromium (primary browser for testing)
- Firefox
- WebKit

### 3. Create MCP Configuration File

Create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["node_modules/@executeautomation/playwright-mcp-server/dist/index.js"]
    }
  }
}
```

**Configuration breakdown:**
- `mcpServers`: Object containing all MCP server configurations
- `playwright`: Server name (can be referenced in Claude Code)
- `command`: Node.js runtime
- `args`: Path to local MCP server installation

### 4. Enable Project MCP Servers

Update your Claude Code settings file at `~/.claude/settings.json`:

```json
{
  "enableAllProjectMcpServers": true
}
```

This enables Claude Code to read `.mcp.json` files from project directories.

### 5. Restart Claude Code

**CRITICAL STEP:** You must restart the Claude Code session for MCP servers to load.

```bash
# Exit current session
exit

# Restart Claude Code in project directory
cd /path/to/market-movers
claude
```

## Verification

After restarting, verify Playwright MCP is available by checking for these tools in Claude Code:

- `mcp__playwright__playwright_navigate` - Navigate to URLs
- `mcp__playwright__playwright_screenshot` - Capture screenshots
- `mcp__playwright__playwright_click` - Click elements
- `mcp__playwright__playwright_fill` - Fill form inputs
- `mcp__playwright__playwright_evaluate` - Execute JavaScript

## Common Issues & Solutions

### Issue 1: Browser Version Mismatch

**Error:**
```
Failed to initialize browser: Executable doesn't exist at chromium-1179
Looks like Playwright needs: npx playwright install
```

**Cause:** MCP server expects different browser version than installed globally

**Solution:**
1. Remove global Playwright browsers (optional)
2. Install Playwright **locally** in project: `npm install --save-dev playwright`
3. Run `npx playwright install` from project directory
4. Update `.mcp.json` to use local installation (as shown above)

### Issue 2: Settings Validation Failed

**Error:**
```
Settings validation failed: Unrecognized field: mcpServers
```

**Cause:** Attempting to add `mcpServers` directly to `~/.claude/settings.json`

**Solution:**
- Create `.mcp.json` in project root (NOT in settings.json)
- Only add `enableAllProjectMcpServers: true` to settings.json

### Issue 3: MCP Tools Not Available

**Symptoms:** Cannot find `mcp__playwright__*` tools in Claude Code

**Checklist:**
1. ✅ Verified `.mcp.json` exists in project root
2. ✅ Confirmed `enableAllProjectMcpServers: true` in settings.json
3. ✅ Installed dependencies: `npm list @executeautomation/playwright-mcp-server`
4. ✅ Installed browsers: `npx playwright install`
5. ✅ **Restarted Claude Code session**

Most commonly, this is solved by restarting Claude Code.

### Issue 4: Permission Errors

**Error:** Cannot execute MCP server script

**Solution:**
```bash
# Ensure node_modules has correct permissions
chmod -R 755 node_modules/@executeautomation

# Verify Node.js can execute the script
node node_modules/@executeautomation/playwright-mcp-server/dist/index.js --help
```

## Usage Examples

### Capture Screenshot of Main Interface

```typescript
// Navigate to running app
await mcp__playwright__playwright_navigate({
  url: "http://localhost:3000",
  browserType: "chromium",
  headless: false
});

// Take screenshot
await mcp__playwright__playwright_screenshot({
  name: "market-movers-workspace",
  fullPage: true,
  savePng: true
});
```

### Test Window Dragging

```typescript
// Navigate to app
await mcp__playwright__playwright_navigate({
  url: "http://localhost:3000"
});

// Get page HTML to find selectors
const html = await mcp__playwright__playwright_get_visible_html({});

// Click and drag window
await mcp__playwright__playwright_drag({
  sourceSelector: ".window-header",
  targetSelector: ".workspace-grid"
});

// Capture result
await mcp__playwright__playwright_screenshot({
  name: "dragged-window",
  savePng: true
});
```

### Validate News Feed Loading

```typescript
// Navigate to app
await mcp__playwright__playwright_navigate({
  url: "http://localhost:3000"
});

// Create news window (assuming menu interaction)
await mcp__playwright__playwright_click({
  selector: "button:contains('New')"
});

await mcp__playwright__playwright_click({
  selector: "button:contains('Market News')"
});

// Wait and verify news loads
await new Promise(resolve => setTimeout(resolve, 2000));

const text = await mcp__playwright__playwright_get_visible_text({});
console.log("News items loaded:", text.includes("news"));
```

## Integration with Development Workflow

### Visual Regression Testing

Use Playwright MCP to capture screenshots of:
- Default workspace layout
- Multiple scanner windows
- Minimized/maximized windows
- Responsive layouts at different sizes
- Alert notifications
- News feed display

### Automated Testing

Create test scenarios for:
- Window creation and closing
- Drag and drop positioning
- Column customization
- Filter application
- Workspace save/load
- News refresh functionality

### Documentation

Capture screenshots for:
- README.md feature showcases
- User guides and tutorials
- Bug reports and issue tracking
- Progress reports and demos

## Files Modified

**Created:**
- `.mcp.json` - MCP server configuration
- `~/.claude/settings.json` - Updated with enableAllProjectMcpServers

**Updated package.json:**
```json
{
  "devDependencies": {
    "@executeautomation/playwright-mcp-server": "latest",
    "playwright": "latest"
  }
}
```

## Architecture

```
Claude Code CLI
  ↓
Reads .mcp.json
  ↓
Launches MCP Server (node_modules/@executeautomation/...)
  ↓
MCP Server Controls Playwright
  ↓
Playwright Launches Browser (Chromium/Firefox/WebKit)
  ↓
Browser Executes Commands (navigate, click, screenshot, etc.)
  ↓
Results Return to Claude Code
```

## Security Considerations

- MCP servers run locally with your user permissions
- Playwright browsers execute with full access to localhost
- Screenshots may contain sensitive API data - review before sharing
- Do not commit screenshots with API keys or tokens

## Performance Notes

- Browser launches add ~2-3 seconds to test execution
- Headless mode is faster but can't visually debug
- Screenshots are saved to Downloads folder by default
- Full-page screenshots of large workspaces may take 3-5 seconds

## Next Steps

Once Playwright MCP is working:
1. Capture screenshots of all window types
2. Document visual states in feature docs
3. Create automated test suite for workspace system
4. Set up CI/CD visual regression tests (future)

## Troubleshooting Checklist

Before requesting help, verify:

- [ ] Node.js version 18+: `node --version`
- [ ] Project dependencies installed: `npm install`
- [ ] Playwright installed locally: `npm list playwright`
- [ ] Browsers installed: `ls -la ~/Library/Caches/ms-playwright` (macOS)
- [ ] `.mcp.json` in project root: `cat .mcp.json`
- [ ] Settings updated: `cat ~/.claude/settings.json`
- [ ] Claude Code restarted after configuration changes
- [ ] Dev server running: `http://localhost:3000` accessible

## Related Documentation

- [Project Setup](./01_project_setup.md)
- [Environment Variables](./02_environment_variables.md)
- [Workspace System Features](/docs/claude/features/workspace_system.md)
- [Playwright Official Docs](https://playwright.dev/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)

## Changelog

**2025-10-20:** Initial setup
- Installed @executeautomation/playwright-mcp-server
- Configured .mcp.json with local installation
- Resolved browser version mismatch
- Documented troubleshooting steps
- Awaiting Claude Code restart for activation

---

**Status:** Configuration complete, awaiting session restart for tool availability
