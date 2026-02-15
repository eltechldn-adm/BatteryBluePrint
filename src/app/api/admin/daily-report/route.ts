
import { NextRequest, NextResponse } from 'next/server';
import { getDailySummary } from '@/lib/analytics/metrics';
import { sendDailyReport } from '@/lib/email/sendReport';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Security Check
        const authHeader = request.headers.get('authorization');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (authHeader !== `Bearer ${adminPassword}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check for dryRun param
        const url = new URL(request.url);
        const dryRun = url.searchParams.get('dryRun') === '1';

        // Generate Report
        const metrics = await getDailySummary();

        // Send Email (or simulate)
        const result = await sendDailyReport(metrics, dryRun);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to send email', details: result.error, metrics },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            dryRun,
            message: dryRun ? 'Dry run successful' : 'Daily report sent successfully',
            preview: result.preview,
            metrics
        });

    } catch (error) {
        console.error('Error generating daily report:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
