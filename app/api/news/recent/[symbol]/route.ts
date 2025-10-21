import { NextRequest, NextResponse } from 'next/server';

interface NewsItem {
  publishedDate: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await context.params;
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

    const url = `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=5&apikey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json({ hasRecentNews: false, hasDayOldNews: false });
    }

    const news: NewsItem[] = await response.json();

    // Check if any news item is within the last hour (red flame)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const hasRecentNews = news.some(item => {
      const newsTime = new Date(item.publishedDate).getTime();
      return newsTime > oneHourAgo;
    });

    // Check if any news item is within the last 24 hours but older than 1 hour (blue flame)
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const hasDayOldNews = news.some(item => {
      const newsTime = new Date(item.publishedDate).getTime();
      return newsTime > twentyFourHoursAgo && newsTime <= oneHourAgo;
    });

    return NextResponse.json({ hasRecentNews, hasDayOldNews });
  } catch (error) {
    console.error('Error checking recent news:', error);
    return NextResponse.json({ hasRecentNews: false, hasDayOldNews: false });
  }
}
