import { NextResponse } from 'next/server';
import { getMostActive } from '@/lib/api/fmp-client';

export async function GET() {
  try {
    const active = await getMostActive();

    return NextResponse.json({
      active,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching most active:', error);

    return NextResponse.json(
      { error: 'Failed to fetch most active stocks' },
      { status: 500 }
    );
  }
}
