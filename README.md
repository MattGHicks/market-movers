# Market Movers 📈

A modern, real-time stock scanner dashboard built for day traders. Features a drag-and-drop widget system, real-time data streaming, and configurable scanner criteria.

## ✨ Features

- 🎯 **Real-time Stock Scanner** - Track multiple stocks with configurable filters
- 🎨 **Drag & Drop Widgets** - Customize your dashboard layout
- 🌙 **Dark Mode** - Built-in theme switching
- ⚡ **High Performance** - Virtual scrolling for large datasets
- 🔄 **Live Updates** - WebSocket-based real-time data
- 💾 **Layout Persistence** - Save and restore your workspace
- 📱 **Responsive** - Works on desktop and tablet devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository (if from git)
git clone <your-repo-url>
cd market-movers

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` (or `http://localhost:3001` if 3000 is busy)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query + Zustand
- **Real-time**: WebSocket (next-ws)
- **Data**: Financial Modeling Prep API / Mock Data

## 📖 Documentation

For detailed development documentation, see [CLAUDE.md](./CLAUDE.md)

## 🎯 Current Status

**Phase**: Foundation Complete ✅

The core architecture is in place:
- ✅ Dashboard layout with sidebar and topbar
- ✅ Widget grid system (drag, drop, resize)
- ✅ Base widget component
- ✅ Mock data generator for testing
- ✅ Dark mode support
- ✅ State management (Zustand + TanStack Query)

**Next**: Building the Top List Scanner widget

## 🔧 Development

### Project Structure

```
market-movers/
├── app/              # Next.js pages and API routes
├── components/       # React components
│   ├── dashboard/    # Layout components
│   ├── widgets/      # Widget components
│   └── ui/           # shadcn/ui components
├── lib/              # Utilities and business logic
│   ├── api/          # API clients and mock data
│   ├── stores/       # Zustand stores
│   └── widgets/      # Widget registry
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing (IMPORTANT!)
npm run test:quick   # Quick Playwright test + screenshots
npm test             # Full test suite
npm run test:ui      # Interactive test mode
```

### Adding a Widget

1. Create component in `components/widgets/[name]/`
2. Define types in `types/widget.types.ts`
3. Register in `lib/widgets/registry.ts`
4. Create default template

See [CLAUDE.md](./CLAUDE.md) for detailed instructions.

## 🎭 Testing with Playwright

**Playwright is a core part of this project!** Run tests after making changes:

```bash
npm run test:quick
```

This captures:
- 📸 Screenshots (dark & light mode)
- 🐛 Console logs and errors
- 📊 Detailed test report

**Check results:**
- `test-results/screenshots/` - Visual proof
- `test-results/test-report.json` - Detailed report

See [docs/PLAYWRIGHT-TESTING.md](./docs/PLAYWRIGHT-TESTING.md) for full guide.

## 🧪 Testing Without API

The project includes a built-in mock data generator:

```typescript
import { MockDataGenerator } from '@/lib/api/mock-data';

const generator = new MockDataGenerator();
generator.start(1000); // Updates every second
generator.subscribe((quotes) => {
  console.log(quotes);
});
```

## 🔐 Environment Variables

Create a `.env.local` file:

```bash
# Optional: Specify port
PORT=3000

# Future: API keys will go here
# NEXT_PUBLIC_FMP_API_KEY=your_key
```

## 🗺️ Roadmap

- [x] Project foundation
- [x] Dashboard layout
- [x] Widget system
- [ ] Top List Scanner widget
- [ ] Real-time data integration
- [ ] WebSocket implementation
- [ ] Scanner configuration
- [ ] Layout persistence
- [ ] Authentication (Clerk)
- [ ] Database (Supabase)
- [ ] Additional widgets (Chart, Order Book)
- [ ] Alert system
- [ ] Backtesting

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

---

Built with ❤️ using Next.js and Claude Code
