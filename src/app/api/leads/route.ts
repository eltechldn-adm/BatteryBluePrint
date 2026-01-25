import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    // Store lead
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

async function storeLead(lead: Lead) {
  const dataDir = join(process.cwd(), '.data');
  const leadsFile = join(dataDir, 'leads.jsonl');

  // Create .data directory if it doesn't exist
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }

  // Append lead as JSON line
  const leadLine = JSON.stringify(lead) + '\n';
  
  if (existsSync(leadsFile)) {
    const existing = await readFile(leadsFile, 'utf-8');
    await writeFile(leadsFile, existing + leadLine);
  } else {
    await writeFile(leadsFile, leadLine);
  }
}

async function getLeads(): Promise<Lead[]> {
  const dataDir = join(process.cwd(), '.data');
  const leadsFile = join(dataDir, 'leads.jsonl');

  if (!existsSync(leadsFile)) {
    return [];
  }

  const content = await readFile(leadsFile, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.length > 0);
  
  return lines
    .map(line => {
      try {
        return JSON.parse(line) as Lead;
      } catch {
        return null;
      }
    })
    .filter((lead): lead is Lead => lead !== null)
    .reverse(); // Most recent first
}
