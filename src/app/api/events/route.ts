import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    // Log to console
    console.log('[Event]', eventData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error storing event:', error);
    return NextResponse.json(
      { error: 'Failed to store event' },
      { status: 500 }
    );
  }
}
