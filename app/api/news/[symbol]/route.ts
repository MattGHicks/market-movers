import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    const url = `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=20&apikey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.statusText}`);
    }

    const news = await response.json();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
