export interface ConfirmEmailParams {
    confirmUrl: string;
    firstName?: string;
}

export function getConfirmEmailHTML({ confirmUrl, firstName }: ConfirmEmailParams): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hi there';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; color: #3D3226;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FAF8F5 0%, #F5E6D3 100%); padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #E35336;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #3D3226;">
                BatteryBlueprint
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6B5B4D;">
                Confirm Your Email
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3D3226;">
                ${greeting},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3D3226;">
                You requested a custom battery sizing PDF from BatteryBlueprint. To receive your personalized blueprint, please confirm your email address.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #3D3226;">
                Click the button below to confirm:
              </p>

              <!-- Confirm Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 16px 40px; background-color: #E35336; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 4px rgba(227, 83, 54, 0.2);">
                      Confirm Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #6B5B4D; padding: 16px; background-color: #FEF3EF; border-left: 3px solid #E35336; border-radius: 4px;">
                <strong>Why confirm?</strong> Email confirmation helps us ensure your PDF reaches you and prevents spam. We respect your inbox — you'll only hear from us when you request it.
              </p>

              <p style="margin: 0 0 15px; font-size: 14px; line-height: 1.6; color: #6B5B4D;">
                This link will expire in 24 hours.
              </p>

              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #9A8A7A;">
                <em>Didn't request this? You can safely ignore this email.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #FAF8F5; border-top: 1px solid #E5D5C1;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 15px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/calculator" 
                       style="color: #6B5B4D; text-decoration: none; font-size: 13px; margin: 0 12px;">Calculator</a>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/guide" 
                       style="color: #6B5B4D; text-decoration: none; font-size: 13px; margin: 0 12px;">Guide</a>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/privacy" 
                       style="color: #6B5B4D; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; font-size: 13px; color: #9A8A7A;">
                    <p style="margin: 0 0 8px;">
                      Questions? Email us at 
                      <a href="mailto:support@batteryblueprint.com" style="color: #E35336; text-decoration: none;">support@batteryblueprint.com</a>
                    </p>
                    <p style="margin: 0; font-size: 12px;">
                      © 2026 BatteryBlueprint. For planning purposes only.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getConfirmEmailText({ confirmUrl, firstName }: ConfirmEmailParams): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hi there';

    return `
${greeting},

You requested a custom battery sizing PDF from BatteryBlueprint. To receive your personalized blueprint, please confirm your email address.

Confirm your email here:
${confirmUrl}

WHY CONFIRM? Email confirmation helps us ensure your PDF reaches you and prevents spam. We respect your inbox — you'll only hear from us when you request it.

This link will expire in 24 hours.

Didn't request this? You can safely ignore this email.

---
Questions? Email us at support@batteryblueprint.com
Calculator: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/calculator
Guide: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/guide
Privacy: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com'}/privacy

© 2026 BatteryBlueprint. For planning purposes only.
  `.trim();
}
