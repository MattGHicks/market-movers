# Market Movers Pro

A professional real-time stock trading platform inspired by Trade-Ideas, built with Next.js and powered by FinancialModelingPrep Premium API. Features a customizable multi-window workspace system with professional-grade UI and interactive tables.

![Version](https://img.shields.io/badge/version-0.4.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Professional UI System (v0.4.0-v0.4.1)
- **Dark/Light Themes** - Professional color schemes with instant toggle
- **High-Density Tables** - Compact 28px rows, see 30-40 stocks at once
- **3-Level Color Intensity** - Instantly spot large moves (>10%, 5-10%, 2-5%)
- **Tabular Number Formatting** - Perfect column alignment with monospace fonts
- **Sticky Headers** - Column headers stay visible during scroll
- **Theme Persistence** - Remember your preference across sessions

### Interactive Tables (v0.4.1)
- **Click-to-Sort** - Three-state sorting: ascending → descending → clear
- **Column Resizing** - Drag column borders to adjust widths
- **Configurable Refresh** - Choose from 5s, 10s, 30s, or 1m intervals
- **Freeze/Resume** - Pause auto-refresh to analyze current data
- **Manual Refresh** - Instant update button
- **Flash Animations** - Cells light up when data changes (green/red/blue)

### Workspace System (v0.3.0 - v0.4.2)
- **Multi-Window Interface** - Create unlimited draggable, resizable windows
- **Edge-Based Resizing** - Drag any edge or corner to resize windows (NEW v0.4.2)
- **Auto-Fit Viewport** - Windows automatically resize to fill screen when stacked (NEW v0.4.2)
- **Default 5-Window Layout** - Pre-configured workspace ready on first load (NEW v0.4.2)
- **Scanner Windows** - Customizable stock scanners for Gainers, Losers, Most Active
- **News Integration** - Real-time market news feed with flame indicators (NEW v0.4.2)
- **Alert System** - Dedicated alerts window with live notifications
- **Workspace Management** - Save and load custom workspace layouts
- **Fully Responsive** - Grid system adapts to window resize

### Scanner Features
- **Custom Columns** - Show/hide any data column (Symbol, Price, Change %, Volume, etc.)
- **Sortable Columns** - Click any header to sort data
- **Resizable Columns** - Drag borders to adjust column widths
- **Color-Coded Data** - Intensity-based colors for gains and losses
- **Real-Time Updates** - Configurable auto-refresh (5s to manual)
- **Flexible Filtering** - Filter by volume, price range, % change

### Data & Alerts
- **Live Market Data** - Real-time stock quotes and market movers
- **News Flame Indicators** - Visual indicators for recent news (🔥 red <1hr, 🔥 blue 1-24hr) (NEW v0.4.2)
- **Alert Notifications** - Toast notifications for significant price movements
- **Configurable Thresholds** - Set custom alert sensitivity
- **News Feed** - Latest market news with search functionality
- **Visual Feedback** - Flash animations on price/volume changes

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + CSS Custom Properties
- **Data Fetching:** @tanstack/react-query
- **Window System:** react-grid-layout, @dnd-kit
- **State Management:** React Context API
- **Animations:** CSS Keyframes

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Data Source:** FinancialModelingPrep API (Premium)
- **API Layer:** Type-safe client with error handling
- **Caching:** React Query with configurable intervals

### Infrastructure
- **Version Control:** Git
- **Package Manager:** npm
- **MCP Integration:** Playwright MCP for testing
- **Environment:** .env.local for API configuration

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- FinancialModelingPrep API key ([Get one here](https://site.financialmodelingprep.com/developer/docs))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd market-movers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API key:
   ```env
   NEXT_PUBLIC_FMP_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Default Workspace (NEW v0.4.2)

On first load, you'll see a professional 5-window layout:
- **Top Row (50% height):** Gainers, Losers, Most Active scanners
- **Bottom Row (50% height):** Market News and Alerts windows

This layout fills your entire viewport automatically and is ready to use immediately.

### Theme Toggle

- Click the **sun/moon icon** in the top-right corner
- Toggle between dark mode (default) and light mode
- Preference is saved automatically

### Working with Windows

**Resizing Windows (NEW v0.4.2):**
- Drag **bottom-right corner** to resize both width and height
- Drag **right edge** to resize width only
- Drag **bottom edge** to resize height only
- Hover over edges to see blue highlight and resize cursor

**Auto-Fit to Viewport (NEW v0.4.2):**
- When you add/remove windows, they automatically resize to fill available space
- No manual resizing needed - workspace always utilizes 100% of viewport

**Creating New Windows:**
1. Click **"New"** in the menu bar
2. Select a scanner type:
   - 📈 Top Gainers Scanner
   - 📉 Top Losers Scanner
   - 🔥 Most Active Scanner
3. Window appears - drag to position, resize as needed

### Interactive Tables

**Sorting:**
- Click any column header to sort ascending
- Click again for descending
- Click third time to clear sort

**Resizing:**
- Hover over column border (right edge of header)
- Drag to adjust width

**Refresh Control:**
- Use dropdown to select refresh interval (5s, 10s, 30s, 1m)
- Click **"⏸ Freeze"** to pause auto-refresh
- Click **"🔄 Refresh"** for manual update

### Customizing Columns

1. In any scanner window, click **"Columns"** button
2. Check/uncheck columns to show/hide
3. Changes apply instantly

### Managing Workspaces

1. Arrange windows to your preference
2. Click **"Workspaces"** → **"Save Current Workspace"**
3. Name your layout (e.g., "Day Trading Setup")
4. Load anytime from Workspaces menu

### News Features (NEW v0.4.2)

**News Window:**
- New → Market News
- Search for specific tickers or topics
- Click headlines to read full articles

**News Flame Indicators:**
- 🔥 **Red flame** - News less than 1 hour old (breaking news)
- 🔥 **Blue flame** - News 1-24 hours old (recent news)
- No flame - News older than 24 hours or no recent news
- Flames appear to the right of ticker symbols in scanners

**Alerts Window:**
- New → Alerts Window

## 📁 Project Structure

```
market-movers/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── market/        # Market data endpoints
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main workspace
│   └── globals.css        # Global styles + theme variables
├── components/            # React components
│   ├── windows/           # Window components
│   │   ├── ScannerWindow.tsx
│   │   ├── NewsWindow.tsx
│   │   └── AlertsWindow.tsx
│   ├── WindowFrame.tsx    # Window wrapper
│   ├── WorkspaceGrid.tsx  # Grid layout manager
│   ├── MenuBar.tsx        # Top menu
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── ...
├── context/               # React Context providers
│   ├── ThemeContext.tsx   # Theme state (NEW v0.4.0)
│   ├── WindowContext.tsx  # Window state
│   ├── FilterContext.tsx  # Filter state
│   ├── AlertContext.tsx   # Alert state
│   └── QueryProvider.tsx  # React Query
├── hooks/                 # Custom React hooks
│   ├── useMarketData.ts   # Data fetching
│   ├── useTableSort.ts    # Column sorting (NEW v0.4.1)
│   ├── useColumnResize.ts # Column resizing (NEW v0.4.1)
│   ├── useDataFlash.ts    # Flash animations (NEW v0.4.1)
│   └── useAlertDetection.ts
├── lib/                   # Utilities and API clients
│   ├── api/
│   │   └── fmp-client.ts  # FMP API integration
│   ├── colorCoding.ts     # Intensity-based colors (NEW v0.4.0)
│   ├── utils.ts           # Utility functions
│   ├── filterStocks.ts    # Filter logic
│   └── cn.ts              # Class name utilities
├── types/                 # TypeScript definitions
│   ├── index.ts           # Stock types
│   └── windows.ts         # Window types
├── docs/                  # Documentation
│   └── claude/            # Development documentation
│       ├── design/        # UI/UX design docs (NEW v0.4.0)
│       ├── setup/         # Setup guides
│       ├── features/      # Feature documentation
│       ├── reports/       # Release reports
│       └── templates/     # Doc templates
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_FMP_API_KEY` | Yes | FinancialModelingPrep API key | - |
| `NEXT_PUBLIC_APP_ENV` | No | Application environment | development |

### Theme Customization

Theme colors are defined in `app/globals.css` using CSS custom properties. Modify the `:root[data-theme="dark"]` and `:root[data-theme="light"]` sections to customize colors.

### Refresh Intervals

Configure per-scanner refresh rates:
- **5 seconds** - Real-time traders (high API usage)
- **10 seconds** - Active monitoring
- **30 seconds** - Default, balanced
- **1 minute** - Casual monitoring
- **Manual** - No auto-refresh

### MCP Integration

The project includes Playwright MCP for testing and automation. See `.mcp.json` and `docs/claude/setup/04_playwright_mcp_setup.md` for configuration.

## 🗺 Roadmap

### Current (v0.4.2) ✅
- ✅ Multi-window workspace system
- ✅ Draggable/resizable windows
- ✅ **Edge-based window resizing (corner + edges)**
- ✅ **Auto-fit viewport (intelligent stacking)**
- ✅ **Default 5-window layout**
- ✅ Multiple scanner types
- ✅ Customizable columns
- ✅ **News flame indicators (red/blue)**
- ✅ Real-time news integration
- ✅ Alert notifications
- ✅ Workspace save/load
- ✅ Dark/Light themes
- ✅ High-density tables (28px rows)
- ✅ Click-to-sort columns
- ✅ Column resizing
- ✅ Configurable refresh rates
- ✅ Freeze/resume auto-refresh
- ✅ Flash animations on updates

### Next (v0.4.3) 🎯
- [ ] Symbol search within scanner
- [ ] CSV export functionality
- [ ] Row count displays
- [ ] Last updated timestamps
- [ ] Keyboard shortcuts (Ctrl+F, etc.)

### Upcoming (v0.5.0)
- [ ] Heat map visualization window
- [ ] Chart windows with TradingView integration
- [ ] Extended hours data (pre-market/after-hours)
- [ ] Advanced filtering UI
- [ ] Stock watchlists
- [ ] Window snap zones (drag to edge = fullscreen)

### Future
- [ ] Strategy builder
- [ ] Backtesting mode
- [ ] Column presets (Momentum, Fundamentals, Technical)
- [ ] User accounts and cloud sync
- [ ] Mobile optimization
- [ ] AI pattern recognition (MCP agents)

## 📚 Documentation

Comprehensive documentation is available in `/docs/claude`:

- **[Setup Guides](/docs/claude/setup/)** - Installation and configuration
- **[Features](/docs/claude/features/)** - Feature implementation details
- **[Design Docs](/docs/claude/design/)** - UI/UX improvement plans
- **[Reports](/docs/claude/reports/)** - Release notes and progress
- **[Templates](/docs/claude/templates/)** - Documentation templates

## 🎨 Inspiration

Market Movers Pro is inspired by professional trading platforms:
- [Trade Ideas](https://www.trade-ideas.com/) - Industry-leading scanner
- [Benzinga Pro](https://www.benzinga.com/pro) - Real-time news and data
- [ThinkorSwim](https://www.thinkorswim.com/) - Advanced trading platform
- [Finviz Elite](https://finviz.com/) - Heat maps and screeners
- [DayTradeDash](https://www.warriortrading.com/day-trade-dash/) - Day trading tools

## 🐛 Troubleshooting

### No data showing
- Verify API key in `.env.local`
- Check browser console for errors
- Ensure development server is running
- Check FMP API status and subscription

### API rate limiting
- Increase refresh interval (30s or 1m)
- Use Freeze button when not actively monitoring
- Check FMP subscription tier and limits
- Monitor API usage on FMP dashboard

### Theme not applying
- Check that `data-theme` attribute is set on `<html>` tag
- Clear browser cache and reload
- Verify CSS custom properties are loaded

### Windows not dragging or resizing
- Check that title bar has correct class: `.window-header`
- Verify react-grid-layout is installed
- Ensure `resizeHandles` prop is set in WorkspaceGrid.tsx
- Clear browser cache

### Sorting not working
- Check browser console for errors
- Verify `useTableSort` hook is imported
- Ensure columns have `sortable` property

### Build errors
- Delete `.next` folder and rebuild
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- **FinancialModelingPrep** for comprehensive market data API
- **Vercel** for Next.js and deployment platform
- **Tailwind CSS** for utility-first CSS framework
- **TanStack Query** for powerful data synchronization
- **react-grid-layout** for drag & drop window system
- **@dnd-kit** for modern drag and drop utilities

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with Claude Code** | v0.4.2 | Last updated: 2025-10-20
