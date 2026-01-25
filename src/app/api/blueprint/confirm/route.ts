import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { getConfirmToken, markConfirmTokenAsConfirmed, createDownloadToken, updateEmailStatus } from '@/lib/kv/redis';
import { sendBlueprintEmail } from '@/lib/email/resend';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/blueprint/expired', request.url));
        }

        // Validate confirm token
        const confirmData = await getConfirmToken(token);

        if (!confirmData) {
            return NextResponse.redirect(new URL('/blueprint/expired', request.url));
        }

        // Check if already confirmed
        if (confirmData.confirmedAt) {
            // Already confirmed - redirect to confirmed page
            // Try to find existing download token or create new one
            const { token: downloadToken } = await createDownloadToken(
                confirmData.email,
                confirmData.payload
            );

            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';
            return NextResponse.redirect(
                new URL(`/blueprint/confirmed?token=${downloadToken}`, request.url)
            );
        }

        // Mark as confirmed
        await markConfirmTokenAsConfirmed(token);

        // Create download token
        const { token: downloadToken } = await createDownloadToken(
            confirmData.email,
            confirmData.payload
        );

        // Update email status
        await updateEmailStatus(confirmData.email, {
            confirmedAt: new Date().toISOString(),
        });

        // Build download URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';
        const downloadUrl = `${siteUrl}/api/blueprint/download?token=${downloadToken}`;

        // Send PDF ready email (non-blocking)
        sendBlueprintEmail({
            to: confirmData.email,
            downloadUrl,
        }).catch(error => {
            console.error('Failed to send blueprint email:', error);
        });

        // Redirect to confirmed page with download token
        return NextResponse.redirect(
            new URL(`/blueprint/confirmed?token=${downloadToken}`, request.url)
        );

    } catch (error) {
        console.error('Error confirming email:', error);
        return NextResponse.redirect(new URL('/blueprint/expired', request.url));
    }
}
