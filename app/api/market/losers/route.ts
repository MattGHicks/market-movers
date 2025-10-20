import { NextResponse } from 'next/server';
import { getTopLosers } from '@/lib/api/fmp-client';

export async function GET() {
  try {
    const losers = await getTopLosers();

    return NextResponse.json({
      losers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching top losers:', error);

    return NextResponse.json(
      { error: 'Failed to fetch top losers' },
      { status: 500 }
    );
  }
}
