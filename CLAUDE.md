# MARKET MOVERS - REAL-TIME STOCK SCANNER PROJECT

## 🎯 Project Overview
Market Movers is a real-time stock scanner dashboard optimized for day trading. Built with Next.js 15, TypeScript, and modern React patterns, it features a modular widget architecture that scales from a single scanner to multiple custom dashboards.

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** (App Router) - React framework with server components
- **TypeScript 5.6+** - Type safety throughout
- **React 19** - Latest React features
- **Tailwind CSS 3** - Utility-first styling

### UI & Components
- **shadcn/ui** - Copy-paste component library (no npm bloat)
- **lucide-react** - Icon library
- **react-grid-layout** - Drag-and-drop widget grid (with CSS layer isolation)
- **next-themes** - Dark mode support

### State Management
- **TanStack Query** - Server state, WebSocket data, caching
- **Zustand** - Client state (UI, filters, widget configurations)

### Real-Time Data
- **next-ws** - WebSocket support in Next.js
- **Financial Modeling Prep** - Initial data provider (can migrate to Polygon.io)
- **Mock Data Generator** - Built-in testing without API

### Future Additions
- **Supabase** - PostgreSQL database with real-time features
- **Clerk** - Authentication service
- **Upstash Redis** - Caching layer

## 📁 Project Structure

```
market-movers/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Dashboard home page
│   ├── globals.css               # ⭐ CSS with layers for grid layout
│   └── api/                      # API routes
│       ├── ws/                   # WebSocket endpoint (future)
│       ├── widgets/              # Widget CRUD (future)
│       └── layouts/              # Layout persistence (future)
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx           # ✅ Navigation sidebar
│   │   ├── Topbar.tsx            # ✅ Top bar with theme toggle
│   │   ├── DashboardLayout.tsx   # ✅ Main layout wrapper
│   │   └── WidgetGrid.tsx        # ✅ react-grid-layout wrapper
│   │
│   ├── widgets/
│   │   ├── base/
│   │   │   └── BaseWidget.tsx    # ✅ Reusable widget container
│   │   │
│   │   ├── top-list-scanner/     # 🚧 Next: Main scanner widget
│   │   │   ├── TopListScanner.tsx
│   │   │   ├── ScannerTable.tsx
│   │   │   ├── ScannerConfig.tsx
│   │   │   └── CLAUDE.md         # Widget-specific instructions
│   │   │
│   │   └── [future-widgets]/
│   │
│   ├── ui/                       # ✅ shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── [others]
│   │
│   └── providers/
│       ├── theme-provider.tsx    # ✅ Dark mode provider
│       └── query-provider.tsx    # ✅ TanStack Query setup
│
├── lib/
│   ├── api/
│   │   └── mock-data.ts          # ✅ Mock stock data generator
│   │
│   ├── stores/
│   │   └── widget-store.ts       # ✅ Zustand widget state
│   │
│   ├── widgets/
│   │   ├── registry.ts           # ✅ Widget factory pattern
│   │   └── templates.ts          # 🚧 Default templates
│   │
│   ├── websocket/                # 🚧 WebSocket client/server
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   │
│   └── utils/
│       └── cn.ts                 # ✅ Tailwind class merger
│
├── hooks/                        # 🚧 Custom React hooks
│   ├── useWebSocket.ts
│   ├── useStockData.ts
│   └── useVirtualScroll.ts
│
├── types/
│   ├── stock.types.ts            # ✅ Stock data types
│   └── widget.types.ts           # ✅ Widget configuration types
│
├── .claude/                      # Claude Code configuration
│   ├── commands/                 # 🚧 Custom slash commands
│   └── agents/                   # 🚧 Sub-agent definitions
│
├── package.json                  # ✅ Dependencies installed
├── tsconfig.json                 # ✅ TypeScript configuration
├── tailwind.config.ts            # ✅ Tailwind with dark mode
├── next.config.js                # ✅ WebSocket webpack config
└── components.json               # ✅ shadcn/ui configuration
```

## 🎨 Design Patterns

### Widget Architecture
All widgets follow the same pattern:
1. **Configuration Schema** - Zod validation for settings
2. **Component** - React component receiving config prop
3. **Registration** - Register in widget registry
4. **Template** - Default configuration for quick setup

### State Management Strategy
- **Server State** (TanStack Query): Stock data, WebSocket messages
- **Client State** (Zustand): Widget layouts, UI state, user preferences
- **Local Storage**: Layout persistence until database is added

### CSS Layer Isolation (CRITICAL)
To prevent Tailwind conflicts with react-grid-layout, we use CSS layers:

```css
@layer base { @tailwind base; }
@layer vendor {
  @import 'react-grid-layout/css/styles.css';
  @import 'react-resizable/css/styles.css';
}
@layer components { @tailwind components; }
@layer utilities { @tailwind utilities; }
```

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev              # Runs on http://localhost:3000

# Build for production
npm run build

# Linting
npm run lint

# Testing with Playwright (CORE TOOL)
npm run test:quick      # Quick test with screenshots & console logs
npm test                # Full test suite
npm run test:ui         # Interactive test mode
npm run test:headed     # Watch tests in browser

# Add shadcn/ui component
npx shadcn@latest add [component-name]
```

## 📝 Code Style Guidelines

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Use `interface` for objects, `type` for unions/intersections
- Zod schemas for runtime validation

### React
- Functional components with hooks only
- Arrow functions for component definitions
- Use `'use client'` directive for client components
- Absolute imports via `@/` alias

### Styling
- Tailwind utility classes
- Component variants using `cn()` helper
- Dark mode via `dark:` prefix
- No inline styles except dynamic values

### File Naming
- Components: PascalCase (e.g., `TopListScanner.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useWebSocket.ts`)
- Utils: kebab-case (e.g., `mock-data.ts`)
- Types: kebab-case with `.types.ts` suffix

## 🎯 Current Status

### ✅ Completed (Foundation)
1. Next.js 15 project initialized with TypeScript & Tailwind
2. Core dependencies installed and configured
3. CSS layers configured for react-grid-layout compatibility
4. Project structure created following blueprint
5. shadcn/ui components set up (card, table, badge, dialog, etc.)
6. Dashboard shell built (Sidebar, Topbar, main content)
7. WidgetGrid implemented with react-grid-layout
8. BaseWidget component structure created
9. Zustand store for widget state management
10. Mock stock data generator for testing
11. Dark mode support with theme toggle
12. **Playwright testing fully integrated** ✨
    - Automated UI testing
    - Screenshot capture
    - Console log monitoring
    - Test reports with visual proof

### 🚧 Next Steps (Phase 2: Core Functionality)
1. **Top List Scanner Widget** - Main scanner with configurable filters
   - ScannerTable component with virtual scrolling
   - ScannerConfig modal with react-hook-form
   - Real-time data integration

2. **WebSocket Integration**
   - Create `/api/ws/route.ts` endpoint
   - Build `useWebSocket` hook with auto-reconnection
   - Implement 100ms batching for updates

3. **Widget CRUD**
   - Add widget button functionality
   - Widget configuration modal
   - Remove/duplicate widgets

4. **Data Integration**
   - Connect to Financial Modeling Prep API
   - Implement caching layer
   - Error handling and retry logic

### 🔮 Future Phases
- **Phase 3**: Layout persistence (localStorage → Supabase)
- **Phase 4**: Authentication (Clerk integration)
- **Phase 5**: Additional widgets (Chart, Order Book)
- **Phase 6**: Alert system and notifications
- **Phase 7**: Backtesting integration

## 🐛 Known Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: Next.js automatically uses port 3001. Update `.env.local` if you want a specific port.

### Issue: Tailwind classes not working in grid layout
**Solution**: CSS layers are already configured. Ensure you're not importing grid layout styles directly.

### Issue: Hydration errors with theme
**Solution**: `suppressHydrationWarning` is added to `<html>` tag in root layout.

## 📚 Key Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- [Financial Modeling Prep API](https://financialmodelingprep.com/developer/docs)

## 💡 Development Tips

### Testing with Playwright (CRITICAL WORKFLOW) 🎭

**Always run Playwright tests after making changes!**

```bash
npm run test:quick
```

This will:
- ✅ Test the app in a real browser
- 📸 Capture screenshots for visual verification
- 🐛 Monitor console logs and errors
- 📊 Generate detailed report

**Check results:**
- Screenshots: `test-results/screenshots/`
- Report: `test-results/test-report.json`

See `docs/PLAYWRIGHT-TESTING.md` for full guide.

### Adding a New Widget
1. Create widget component in `components/widgets/[name]/`
2. Define TypeScript types and Zod schema in `types/widget.types.ts`
3. Register widget in `lib/widgets/registry.ts`
4. Create default template in `lib/widgets/templates.ts`
5. **Run `npm run test:quick` to verify!** ✨
6. Add widget-specific `CLAUDE.md` for future reference

### Testing Without API
Use the `MockDataGenerator` class:
```typescript
import { MockDataGenerator } from '@/lib/api/mock-data';

const generator = new MockDataGenerator();
generator.start(1000); // Update every second
generator.subscribe((quotes) => {
  console.log('Updated quotes:', quotes);
});
```

### Debugging State
- Zustand DevTools: Open Redux DevTools in browser
- React Query DevTools: Shows at bottom of page in dev mode
- Console: All widget registry errors are logged
- **Playwright Screenshots: Visual proof of bugs** 📸

## 🤝 Claude Code Integration

This project is optimized for development with Claude Code:

### Custom Commands (Future)
- `/project:create-widget [name]` - Scaffold new widget
- `/project:deploy` - Deploy to Railway
- `/project:test-widget [name]` - Run widget tests

### Sub-Agents (Future)
- `frontend-developer` - UI components and styling
- `data-integration` - WebSocket and API integration
- `performance-engineer` - Optimization and profiling
- `test-automator` - Testing and coverage

## 🔐 Environment Variables

Create `.env.local`:
```bash
# Optional: Specify port
PORT=3000

# Future: API Keys
NEXT_PUBLIC_FMP_API_KEY=your_key_here
NEXT_PUBLIC_POLYGON_API_KEY=your_key_here

# Future: Database
DATABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Future: Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

## 📞 Getting Help

1. Check this CLAUDE.md for project context
2. Review widget-specific CLAUDE.md files
3. Check the blueprint document for architecture decisions
4. Use Claude Code's search to find similar patterns
5. Consult the official docs linked in resources

---

**Last Updated**: 2025-10-26
**Status**: Foundation Complete ✅
**Next Milestone**: Top List Scanner Widget 🚧
