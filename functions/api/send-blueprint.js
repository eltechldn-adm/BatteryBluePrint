/**
 * Cloudflare Pages Function: /api/send-blueprint
 * Receives a base64-encoded PDF and emails it via Resend.
 * This runs at the Cloudflare edge — NOT inside the Next.js static export.
 * 
 * Environment variables required (set in Cloudflare Pages dashboard):
 *   RESEND_API_KEY   — from https://resend.com
 *   EMAIL_FROM       — verified sender, e.g. "BatteryBlueprint <hello@batteryblueprint.com>"
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const { email, name, pdfBase64, sizingData } = body;

    // Validate
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing PDF data.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const resendApiKey = env.RESEND_API_KEY;
    const emailFrom = env.EMAIL_FROM || 'BatteryBlueprint <hello@batteryblueprint.com>';

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const greeting = name ? `Hi ${name.split(' ')[0]}` : 'Hi there';
    const sd = sizingData || {};

    // Build email HTML
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your BatteryBlueprint PDF</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#FAF8F5;color:#3D3226;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#FAF8F5 0%,#F5E6D3 100%);padding:40px 40px 28px;text-align:center;border-bottom:3px solid #E35336;">
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#3D3226;">BatteryBlueprint</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#6B5B4D;">Engineering-Grade Solar Battery Sizing</p>
          </td>
        </tr>

        <!-- Results Summary -->
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-radius:8px;overflow:hidden;background:#FEF3EF;">
              <tr>
                <td style="padding:16px 20px;text-align:center;border-right:1px solid #FDDDD7;">
                  <div style="font-size:11px;font-weight:700;color:#E35336;letter-spacing:0.05em;text-transform:uppercase;">Load Target</div>
                  <div style="font-size:22px;font-weight:700;color:#3D3226;margin-top:4px;">${sd.loadTarget || '—'} kWh</div>
                </td>
                <td style="padding:16px 20px;text-align:center;background:#E35336;border-right:1px solid #FDDDD7;">
                  <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:0.05em;text-transform:uppercase;">Battery Usable</div>
                  <div style="font-size:22px;font-weight:700;color:#ffffff;margin-top:4px;">${sd.batteryUsable || '—'} kWh</div>
                </td>
                <td style="padding:16px 20px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;color:#E35336;letter-spacing:0.05em;text-transform:uppercase;">Nameplate Needed</div>
                  <div style="font-size:22px;font-weight:700;color:#3D3226;margin-top:4px;">${sd.batteryNameplate || '—'} kWh</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:28px 40px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3D3226;">${greeting},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3D3226;">
              Your <strong>Battery Blueprint PDF</strong> is attached to this email. It includes:
            </p>
            <ul style="margin:0 0 24px;padding-left:0;list-style:none;">
              ${[
                'Your personalised sizing results &amp; calculation breakdown',
                'Battery comparison table (recommended models for your system)',
                'Installer checklist — 30 engineering-grade checks',
                'Questions to ask your installer (20 expert questions)',
              ].map(item => `<li style="padding:6px 0;font-size:14px;color:#3D3226;border-bottom:1px solid #F5E6D3;">
                <span style="color:#E35336;font-weight:700;margin-right:8px;">✓</span>${item}
              </li>`).join('')}
            </ul>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6B5B4D;padding:14px;background:#FEF3EF;border-left:3px solid #E35336;border-radius:4px;">
              <strong>Reminder:</strong> BatteryBlueprint is a planning tool, not professional engineering advice. Always work with a licensed installer for final system design and installation.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://batteryblueprint.com/calculator" style="display:inline-block;padding:14px 36px;background-color:#E35336;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">
                    Re-run the Calculator
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;background:#FAF8F5;border-top:1px solid #E5D5C1;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#9A8A7A;">
              Questions? <a href="mailto:support@batteryblueprint.com" style="color:#E35336;text-decoration:none;">support@batteryblueprint.com</a>
            </p>
            <p style="margin:0;font-size:11px;color:#B0A090;">© 2026 BatteryBlueprint. For planning purposes only.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

    // Send via Resend API
    const resendPayload = {
      from: emailFrom,
      to: [email],
      subject: 'Your Battery Sizing Blueprint — BatteryBlueprint',
      html: htmlBody,
      attachments: [
        {
          filename: `BatteryBlueprint-${new Date().toISOString().slice(0, 10)}.pdf`,
          content: pdfBase64,
        },
      ],
    };

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    });

    if (!resendRes.ok) {
      const resendBody = await resendRes.text();
      console.error('Resend error:', resendBody);
      return new Response(JSON.stringify({ error: 'Email delivery failed. Please try downloading directly.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('send-blueprint function error:', err);
    return new Response(JSON.stringify({ error: 'Internal error. Please try downloading the PDF directly.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
