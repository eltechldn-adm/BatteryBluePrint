import { NextRequest, NextResponse } from 'next/server';
import { storeEvent } from '@/lib/kv/redis';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    await storeEvent(eventData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error storing event:', error);
    return NextResponse.json(
      { error: 'Failed to store event' },
      { status: 500 }
    );
  }
}
