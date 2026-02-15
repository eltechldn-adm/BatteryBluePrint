import nodemailer from 'nodemailer';
import { DailyReportSummary } from '@/lib/analytics/metrics';

export interface EmailResult {
    success: boolean;
    preview?: string;
    error?: string;
}

export async function sendDailyReport(metrics: DailyReportSummary, dryRun: boolean = false): Promise<EmailResult> {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, REPORT_EMAIL_TO } = process.env;

    // Validate configuration
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !REPORT_EMAIL_TO) {
        console.error('Missing SMTP configuration');
        return { success: false, error: 'Missing SMTP configuration in environment variables' };
    }

    const htmlContent = `
        <div style="font-family: sans-serif; color: #333;">
            <h2>BatteryBlueprint Daily Report</h2>
            <p><strong>Date:</strong> ${new Date(metrics.timestamp).toLocaleString()}</p>
            <p><strong>Period:</strong> ${metrics.period}</p>
            
            <hr />
            
            <h3>Key Metrics (Last 24h)</h3>
            <ul>
                <li><strong>Leads Captured:</strong> ${metrics.metrics.totalLeads24h}</li>
                <li><strong>Total Events:</strong> ${metrics.metrics.totalEvents24h}</li>
                <li><strong>Calculator Submissions:</strong> ${metrics.metrics.calculatorSubmissions24h}</li>
                <li><strong>Blueprint Downloads:</strong> ${metrics.metrics.blueprintDownloads24h}</li>
            </ul>
            
            <h3>Top Event Types</h3>
            <ul>
                ${metrics.topEventTypes.map(t => `<li>${t.type}: ${t.count}</li>`).join('')}
            </ul>
        </div>
    `;

    // Dry Run Mode
    if (dryRun) {
        return {
            success: true,
            preview: htmlContent
        };
    }

    // Send Real Email
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"BatteryBlueprint Bot" <${SMTP_USER}>`,
            to: REPORT_EMAIL_TO,
            subject: `Daily Report: ${metrics.metrics.totalLeads24h} Leads, ${metrics.metrics.totalEvents24h} Events`,
            html: htmlContent,
        });
        console.log('Daily report email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Failed to send daily report email:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown SMTP error' };
    }
}
