import { NextRequest, NextResponse } from 'next/server';

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!FMP_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch detailed quote data from FMP
    const response = await fetch(
      `${BASE_URL}/quote/${symbol.toUpperCase()}?apikey=${FMP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found for symbol' },
        { status: 404 }
      );
    }

    // Return the first quote (FMP returns an array)
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}
