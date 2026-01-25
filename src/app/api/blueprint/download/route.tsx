import { NextRequest, NextResponse } from 'next/server';
import { getDownloadToken, markDownloadTokenAsUsed } from '@/lib/kv/redis';
import React from 'react';

export const runtime = 'edge';

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
        const { results, recommendations } = token.payload;

        // Import React PDF renderer at runtime
        const { default: ReactPDF } = await import('@react-pdf/renderer');
        const { BlueprintDocument } = await import('@/components/pdf/BlueprintDocument');

        // Generate PDF blob
        const blob = await ReactPDF.pdf(
            <BlueprintDocument results={results} recommendations={recommendations} />
        ).toBlob();

        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `BatteryBlueprint-${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return new NextResponse('Failed to generate PDF', { status: 500 });
    }
}
