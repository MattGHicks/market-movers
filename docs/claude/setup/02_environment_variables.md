# Setup Step: Environment Variables Configuration

**Date:** 2025-10-20
**Author:** Claude Code
**Purpose:** Configure FinancialModelingPrep API access and application settings

## Steps Completed

1. **Created Environment Files**
   - `.env.local` - Local development environment (not committed to git)
   - `.env.example` - Template for required environment variables

2. **Configured API Access**
   - Set up NEXT_PUBLIC_FMP_API_KEY placeholder
   - Configured refresh interval settings
   - Added WebSocket configuration for future real-time features

## Configuration Notes

### Environment Variables

#### Required Variables
- **NEXT_PUBLIC_FMP_API_KEY**
  - Description: API key from FinancialModelingPrep
  - Required: Yes
  - Get your key: https://site.financialmodelingprep.com/developer/docs
  - Note: Premium subscription required for full access

#### Optional Variables
- **NEXT_PUBLIC_APP_ENV**
  - Description: Application environment
  - Default: development
  - Options: development, production

- **NEXT_PUBLIC_REFRESH_INTERVAL**
  - Description: Auto-refresh interval in milliseconds
  - Default: 30000 (30 seconds)
  - Recommendation: 30-60 seconds to avoid API rate limits

- **NEXT_PUBLIC_WS_URL** (Future use)
  - Description: WebSocket URL for real-time data feeds
  - Default: wss://websockets.financialmodelingprep.com
  - Status: Not yet implemented

## Verification

### Step 1: Obtain API Key
1. Visit https://site.financialmodelingprep.com/
2. Sign up or log in to your account
3. Navigate to the API section
4. Copy your API key

### Step 2: Configure .env.local
```bash
# Open .env.local and replace 'your_api_key_here' with your actual key
NEXT_PUBLIC_FMP_API_KEY=abc123your_real_api_key_here
```

### Step 3: Test API Connection
After configuring your API key:
1. Restart the development server (`npm run dev`)
2. Open http://localhost:3000
3. Dashboard should load market data
4. Check browser console for any API errors

### Expected API Endpoints
The application will make requests to:
- `/api/market/gainers` - Top gaining stocks
- `/api/market/losers` - Top losing stocks
- `/api/market/actives` - Most active stocks by volume

### Troubleshooting

**Error: "FMP API key not found"**
- Check that `.env.local` exists in project root
- Verify the variable name is exactly: `NEXT_PUBLIC_FMP_API_KEY`
- Restart the development server after changes

**Error: "Failed to fetch market data"**
- Verify API key is valid and active
- Check API subscription status (free tier has limits)
- Review browser network tab for specific error codes

**Rate Limiting**
- Free tier: ~250 requests/day
- Premium tier: Higher limits based on plan
- Adjust `NEXT_PUBLIC_REFRESH_INTERVAL` if hitting limits

## Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit API keys
- ✅ `.env.example` provides template without sensitive data
- ⚠️ `NEXT_PUBLIC_*` variables are exposed to browser - acceptable for FMP API key
- 🔒 For production, consider backend proxy to hide API key

## Next Steps

1. Test API connection with your key
2. Monitor console for successful data fetches
3. Proceed to API connection verification (see `03_api_connection_test.md`)
