import { Resend } from 'resend';
import { getConfirmEmailHTML, getConfirmEmailText } from './templates/confirm-email';
import { getBlueprintEmailHTML, getBlueprintEmailText } from './templates/blueprint-ready';

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Confirmation Email
export interface SendConfirmEmailParams {
  to: string;
  confirmUrl: string;
  firstName?: string;
}

export async function sendConfirmEmail({
  to,
  confirmUrl,
  firstName,
}: SendConfirmEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = process.env.EMAIL_FROM || 'BatteryBlueprint <hello@batteryblueprint.com>';

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: 'Confirm your email to get your BatteryBlueprint PDF',
      html: getConfirmEmailHTML({ confirmUrl, firstName }),
      text: getConfirmEmailText({ confirmUrl, firstName }),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Blueprint Ready Email
export interface SendBlueprintEmailParams {
  to: string;
  downloadUrl: string;
  recipientName?: string;
}

export async function sendBlueprintEmail({
  to,
  downloadUrl,
  recipientName,
}: SendBlueprintEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = process.env.EMAIL_FROM || 'BatteryBlueprint <hello@batteryblueprint.com>';

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: 'Your BatteryBlueprint PDF is ready',
      html: getBlueprintEmailHTML(downloadUrl, recipientName),
      text: getBlueprintEmailText(downloadUrl, recipientName),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
