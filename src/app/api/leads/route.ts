import { NextRequest, NextResponse } from 'next/server';
import { storeLead, getLeads } from '@/lib/kv/redis';

export const runtime = 'edge';

export interface Lead {
  id: string;
  email: string;
  firstName?: string;
  timestamp: string;
  calculatorInputs?: {
    dailyLoad: number;
    autonomyDays: number;
    winterMode: boolean;
  };
  resultsSummary?: {
    batteryUsableNeeded: number;
    batteryNameplateNeeded: number;
  };
  recommendations?: {
    premium?: string;
    midRange?: string;
    diy?: string;
  };
  selectedTier?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email: body.email,
      firstName: body.firstName,
      timestamp: new Date().toISOString(),
      calculatorInputs: body.calculatorInputs,
      resultsSummary: body.resultsSummary,
      recommendations: body.recommendations,
      selectedTier: body.selectedTier,
    };

    // Validate email
    if (!lead.email || !lead.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    await storeLead(lead);

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error('Error storing lead:', error);
    return NextResponse.json(
      { error: 'Failed to store lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin password
    const authHeader = request.headers.get('authorization');
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    if (authHeader !== `Bearer ${password}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const leads = await getLeads();
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
