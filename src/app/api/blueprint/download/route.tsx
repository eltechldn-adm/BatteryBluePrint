import { NextRequest, NextResponse } from 'next/server';
import { getDownloadToken, markDownloadTokenAsUsed } from '@/lib/db/blueprint-tokens';
import { generateBlueprintPdf } from '@/lib/pdf/generate-blueprint-pdf';
import { logger } from '@/lib/logger';
import { storeEvent } from '@/lib/kv/redis';



export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenString = searchParams.get('token');

        if (!tokenString) {
            return new NextResponse('Missing token parameter', { status: 400 });
        }

        // Validate download token
        const token = await getDownloadToken(tokenString);

        if (!token) {
            // Redirect to expired page
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';
            return NextResponse.redirect(`${siteUrl}/blueprint/expired`);
        }

        // Mark as used (optional - we allow multiple downloads)
        await markDownloadTokenAsUsed(tokenString);

        // Generate PDF from stored payload
        const results = token.payload?.results ?? {};
        const recommendations = token.payload?.recommendations ?? {};

        // Log analytics event
        await storeEvent({
            type: 'blueprint_download',
            timestamp: new Date().toISOString(),
            meta: {
                location: results.location?.address || 'unknown',
                systemSize: results.systemSize || 0
            }
        });

        const pdfBytes = await generateBlueprintPdf(results, recommendations);

        const fileName = `BatteryBlueprint-${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(new Blob([pdfBytes as any]), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'no-store',
            },
        });

    } catch (error) {
        logger.error('Error generating PDF', error);
        return new NextResponse('Failed to generate PDF', { status: 500 });
    }
}
