# Market Movers 📈

A modern, real-time stock scanner dashboard built for day traders. Features a drag-and-drop widget system, real-time data streaming, TradingView charts, and configurable scanner criteria with alerts.

## ✨ Features

- 🎯 **Real-time Stock Scanner** - Track multiple stocks with configurable filters
- 📊 **TradingView Charts** - Professional price charts with dynamic resizing
- 🔔 **Alert System** - Create strategies and get real-time alerts
- 🎨 **Drag & Drop Widgets** - Customize your dashboard layout
- 🌙 **Dark Mode** - Built-in theme switching
- ⚡ **High Performance** - Virtual scrolling for large datasets
- 🔄 **Live Updates** - Real-time data simulation (2-second intervals)
- 💾 **Layout Persistence** - Save and restore your workspace
- 📱 **Responsive** - Works on desktop and tablet devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MattGHicks/market-movers.git
cd market-movers

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Charts**: TradingView Lightweight Charts v5
- **Grid**: react-grid-layout
- **Testing**: Playwright

## 📊 Available Widgets

### 1. **Top List Scanner**
Customizable scanner with advanced filters for finding gainers, losers, and volume leaders.

### 2. **Price Chart** (New!)
TradingView Lightweight Charts with:
- Real-time price updates
- Dynamic width & height resizing
- Symbol search
- Color-coded gains/losses
- High/Low/Volume stats

### 3. **Alert Widget** (New!)
Strategy builder with real-time monitoring:
- 6 condition types (price, change%, volume, new highs/lows)
- Alert feed with timestamps
- Multiple strategies per widget

### 4. **Market Overview**
Track major indices: SPY, QQQ, DIA, IWM, VIX

### 5. **Market News**
Latest market news with sentiment analysis

### 6. **Watchlist**
Custom symbol tracker with add/remove functionality

## 📖 Documentation

- [Widget Guide](./WIDGETS_GUIDE.md) - Detailed widget documentation
- [Development Summary](./DEVELOPMENT_SUMMARY.md) - Architecture and progress
- [CLAUDE.md](./CLAUDE.md) - AI-assisted development notes

## 🎯 Current Status

**Phase**: Core Features Complete ✅

Recent additions:
- ✅ TradingView Lightweight Charts integration
- ✅ Alert/Strategy widget with real-time monitoring
- ✅ Dynamic chart resizing (width & height)
- ✅ Symbol search and switching
- ✅ Git worktrees for parallel development

## 🔧 Development

### Project Structure

```
market-movers/
├── app/              # Next.js pages and API routes
├── components/       # React components
│   ├── dashboard/    # Layout components
│   ├── widgets/      # Widget components (6 total)
│   └── ui/           # shadcn/ui components
├── lib/              # Utilities and business logic
│   ├── services/     # Market data simulator
│   ├── stores/       # Zustand stores
│   └── widgets/      # Widget registry
├── contexts/         # React contexts
├── types/            # TypeScript type definitions
└── tests/            # Playwright tests
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run Playwright tests
```

### Adding a Widget

1. Create component in `components/widgets/[WidgetName].tsx`
2. Register in `lib/widgets/index.ts`
3. Add to `AddWidgetDialog.tsx`
4. Add defaults to `app/page.tsx`

See [WIDGETS_GUIDE.md](./WIDGETS_GUIDE.md) for detailed instructions.

## 🎭 Testing with Playwright

Run tests after making changes:

```bash
npm test             # Full test suite
npm run test:headed  # Headed mode
```

Tests cover:
- Chart widget functionality
- Alert widget strategies
- All widget features
- Layout management

## 🧪 Market Data Simulation

The project includes a built-in market data simulator with 30+ stocks:

```typescript
import { marketDataSimulator } from '@/lib/services/market-data-simulator';

marketDataSimulator.start(2000); // Updates every 2 seconds
const stock = marketDataSimulator.getStock('AAPL');
```

## 🗺️ Roadmap

- [x] Project foundation
- [x] Dashboard layout
- [x] Widget system
- [x] Top List Scanner widget
- [x] Market Overview widget
- [x] News widget
- [x] Watchlist widget
- [x] TradingView chart widget
- [x] Alert/Strategy widget
- [ ] Real-time data integration (API)
- [ ] WebSocket implementation
- [ ] Authentication (Clerk)
- [ ] Database (Supabase)
- [ ] Candlestick charts
- [ ] Technical indicators
- [ ] Backtesting

## 🤝 Git Workflow

This project uses **Git worktrees** for parallel feature development:

```bash
# Create a new feature worktree
git worktree add ../market-movers-feature feature/new-feature

# Work in the worktree
cd ../market-movers-feature
npm run dev  # Runs on different port

# Merge when ready
git checkout main
git merge feature/new-feature
```

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

---

Built with ❤️ using Next.js, TypeScript, and Claude Code
