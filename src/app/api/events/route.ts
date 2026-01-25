import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Event]', eventData);
    }

    // Store in local file for development/demo
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

async function storeEvent(eventData: unknown) {
  try {
    const dataDir = join(process.cwd(), '.data');
    const eventsFile = join(dataDir, 'events.jsonl');

    // Create .data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Append event as JSON line
    const eventLine = JSON.stringify(eventData) + '\n';
    
    if (existsSync(eventsFile)) {
      const existing = await readFile(eventsFile, 'utf-8');
      await writeFile(eventsFile, existing + eventLine);
    } else {
      await writeFile(eventsFile, eventLine);
    }
  } catch (error) {
    console.error('Failed to store event to file:', error);
    // Don't throw - fail silently to not break the app
  }
}
