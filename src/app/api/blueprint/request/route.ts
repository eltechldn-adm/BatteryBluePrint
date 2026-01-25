import { NextRequest, NextResponse } from 'next/server';
import { createConfirmToken } from '@/lib/kv/redis';
import { sendConfirmEmail } from '@/lib/email/resend';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/limiter';

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const clientIp = getClientIp(request);

        // Check rate limit: 5 requests per hour
        const rateLimit = checkRateLimit(clientIp, 5, 60 * 60 * 1000);

        if (!rateLimit.allowed) {
            const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
            return NextResponse.json(
                {
                    error: 'Too many requests',
                    message: `Please wait ${resetIn} minutes before requesting another PDF.`,
                    resetAt: rateLimit.resetAt,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email, name, results, recommendations } = body;

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Validate payload
        if (!results || !recommendations) {
            return NextResponse.json(
                { error: 'Invalid payload: results and recommendations required' },
                { status: 400 }
            );
        }

        // Create confirm token
        const { token } = await createConfirmToken(email, { results, recommendations });

        // Build confirm URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';
        const confirmUrl = `${siteUrl}/api/blueprint/confirm?token=${token}`;

        // Send confirmation email
        const emailResult = await sendConfirmEmail({
            to: email,
            confirmUrl,
            firstName: name,
        });

        if (!emailResult.success) {
            console.error('Failed to send confirmation email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send confirmation email. Please try again.' },
                { status: 500 }
            );
        }

        // Also save to leads for tracking (non-blocking)
        fetch(`${siteUrl}/api/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                firstName: name || undefined,
                calculatorInputs: {
                    dailyLoad: results.breakdown?.loadBase,
                    autonomyDays: results.breakdown?.autonomyMult,
                    winterMode: results.breakdown?.winterMult > 1,
                },
                resultsSummary: {
                    batteryUsableNeeded: results.batteryUsableNeeded_kWh,
                    batteryNameplateNeeded: results.batteryNameplateNeeded_kWh,
                },
                recommendations: {
                    premium: recommendations.premium?.[0]?.battery.model || 'None',
                    midRange: recommendations.midRange?.[0]?.battery.model || 'None',
                    diy: recommendations.diy?.[0]?.battery.model || 'None',
                },
            }),
        }).catch(console.error);

        return NextResponse.json({
            success: true,
            message: 'Check your inbox to confirm your email.',
        });

    } catch (error) {
        console.error('Error processing blueprint request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
