# Market Movers

A real-time stock market momentum scanner built with Next.js and powered by FinancialModelingPrep Premium API. Track market momentum, identify winning stocks, and receive real-time alerts through a modern, responsive dashboard.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Real-Time Market Data** - Live updates every 30 seconds
- **Top Gainers & Losers** - Track stocks with the biggest price movements
- **Most Active Stocks** - Identify high-volume trading opportunities
- **Modern Dashboard** - Clean, responsive UI built with Tailwind CSS
- **Type-Safe** - Full TypeScript support throughout the application
- **Smart Caching** - Optimized data fetching with React Query

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS
- **Data Fetching:** @tanstack/react-query
- **Charts:** Recharts (ready for integration)

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Data Source:** FinancialModelingPrep API (Premium)
- **API Layer:** Type-safe client with error handling

### Infrastructure
- **Version Control:** Git
- **Package Manager:** npm
- **Environment:** .env.local for API configuration

## Getting Started

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

## Project Structure

```
market-movers/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── market/        # Market data endpoints
│   ├── layout.tsx         # Root layout with QueryProvider
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── StockCard.tsx      # Individual stock display card
│   ├── MarketMoversTable.tsx  # Stock data table
│   └── LoadingSpinner.tsx # Loading state component
├── lib/                   # Utilities and API clients
│   ├── api/
│   │   └── fmp-client.ts  # FMP API integration
│   ├── utils.ts           # Utility functions
│   └── cn.ts              # Class name utilities
├── hooks/                 # Custom React hooks
│   └── useMarketData.ts   # Data fetching hooks
├── context/               # React Context providers
│   └── QueryProvider.tsx  # React Query setup
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
├── docs/                  # Documentation
│   └── claude/            # Development documentation
│       ├── setup/         # Setup guides
│       ├── features/      # Feature documentation
│       ├── agents/        # MCP agent docs
│       └── templates/     # Doc templates
└── public/                # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## API Endpoints

### Internal API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/market/gainers` | GET | Top gaining stocks |
| `/api/market/losers` | GET | Top losing stocks |
| `/api/market/actives` | GET | Most active stocks |

### Response Format

```typescript
{
  "gainers": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 150.25,
      "change": 5.50,
      "changePercent": 3.80,
      "volume": 75000000,
      "marketCap": 2500000000000
    }
  ],
  "timestamp": "2025-10-20T14:30:00.000Z"
}
```

## Documentation

Comprehensive documentation is available in the `/docs/claude` directory:

- **[Setup Guide](/docs/claude/setup/)** - Installation and configuration
- **[Feature Docs](/docs/claude/features/)** - Feature implementation details
- **[Templates](/docs/claude/templates/)** - Documentation templates

Key documents:
- [01_project_setup.md](/docs/claude/setup/01_project_setup.md) - Initial setup
- [02_environment_variables.md](/docs/claude/setup/02_environment_variables.md) - API configuration
- [03_api_connection_test.md](/docs/claude/setup/03_api_connection_test.md) - API verification

## Roadmap

### Current (v0.1)
- ✅ Real-time market data dashboard
- ✅ Top gainers, losers, and most active stocks
- ✅ Auto-refreshing data (30s intervals)
- ✅ Responsive UI with Tailwind CSS

### Coming Soon (v0.2)
- [ ] Custom stock filters (price, volume, sector)
- [ ] Real-time alerts and notifications
- [ ] Advanced charting with Recharts
- [ ] Stock search functionality
- [ ] Sector performance view

### Future (v0.3+)
- [ ] AI pattern recognition (MCP agents)
- [ ] News sentiment integration
- [ ] Backtesting and replay mode
- [ ] User accounts and saved scans
- [ ] WebSocket real-time streaming

## Inspiration

Market Movers is inspired by professional trading tools:
- [Trade Ideas](https://www.trade-ideas.com/)
- [DayTradeDash](https://www.warriortrading.com/day-trade-dash/)

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_FMP_API_KEY` | Yes | FinancialModelingPrep API key | - |
| `NEXT_PUBLIC_APP_ENV` | No | Application environment | development |
| `NEXT_PUBLIC_REFRESH_INTERVAL` | No | Data refresh interval (ms) | 30000 |

## Troubleshooting

### No data showing
- Verify API key in `.env.local`
- Check browser console for errors
- Ensure development server is running

### API rate limiting
- Reduce `NEXT_PUBLIC_REFRESH_INTERVAL`
- Check FMP subscription tier
- Monitor API usage on FMP dashboard

### Build errors
- Delete `.next` folder and rebuild
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- **FinancialModelingPrep** for providing comprehensive market data API
- **Vercel** for Next.js and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **TanStack Query** for powerful data synchronization

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with Claude Code** | v0.1.0 | Last updated: 2025-10-20
