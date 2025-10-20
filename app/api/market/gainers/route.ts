import { NextResponse } from 'next/server';
import { getTopGainers } from '@/lib/api/fmp-client';

export async function GET() {
  try {
    const gainers = await getTopGainers();

    return NextResponse.json({
      gainers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching top gainers:', error);

    return NextResponse.json(
      { error: 'Failed to fetch top gainers' },
      { status: 500 }
    );
  }
}
