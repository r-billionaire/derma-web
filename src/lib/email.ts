import { Resend } from 'resend';
import { clinicInfo } from '@/content';
import { CLINIC_TIME_ZONE } from '@/lib/clinic-time';
import { theme } from '@/content/theme';

// Resend throws from its own constructor when the key is missing, so it must be
// built lazily - constructing it at module scope took the whole booking action
// down with a module-evaluation error the moment RESEND_API_KEY was absent.
let client: Resend | null = null;
let warnedAboutMissingKey = false;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (!warnedAboutMissingKey) {
      warnedAboutMissingKey = true;
      console.warn(
        '[email] RESEND_API_KEY is not set - booking confirmation emails are being skipped. ' +
          'Bookings still succeed and are recorded in the database.'
      );
    }
    return null;
  }

  if (!client) client = new Resend(apiKey);
  return client;
}

// Booking times are stored as instants; patients need the time at the clinic.
// PLACEHOLDER: belongs alongside the other clinic facts in /content once the
// real hours/timezone are confirmed.
const CLINIC_TIMEZONE = CLINIC_TIME_ZONE;

const senderDomain = clinicInfo.email.split('@')[1];
// Display names containing "." or "(" must be quoted per RFC 5322.
const FROM = `"${clinicInfo.name.replace(/["\\]/g, '')}" <bookings@${senderDomain}>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type EmailResult =
  | { sent: true }
  | { sent: false; reason: 'not-configured' }
  | { sent: false; reason: 'send-failed'; error: unknown };

/**
 * Best-effort booking confirmation. Never throws: a booking must not fail
 * because email is unconfigured or Resend is down.
 */
export async function sendBookingConfirmation(
  patientEmail: string,
  patientName: string,
  serviceName: string,
  startTime: Date,
  providerName: string
): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) return { sent: false, reason: 'not-configured' };

  const when = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: CLINIC_TIMEZONE,
  }).format(startTime);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [patientEmail],
      subject: `Appointment Confirmed - ${clinicInfo.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style={`color: ${theme.colors.accentPrimary};`}>Appointment Confirmed</h1>
          <p>Hello ${escapeHtml(patientName)},</p>
          <p>Your appointment for <strong>${escapeHtml(serviceName)}</strong> with <strong>${escapeHtml(providerName)}</strong> has been scheduled.</p>
          <div style={`background: ${theme.colors.background}; padding: 15px; border-radius: 4px; margin: 20px 0;`}>
            <p><strong>Date &amp; Time:</strong> ${escapeHtml(when)}</p>
            <p><strong>Location:</strong> ${escapeHtml(clinicInfo.address)}</p>
          </div>
          <p>Need to reschedule? Call us at ${escapeHtml(clinicInfo.phone)}.</p>
          <p>Best regards,<br />${escapeHtml(clinicInfo.name)}</p>
        </div>
      `,
    });

    if (error) {
      console.error('[email] Resend rejected the confirmation:', error);
      return { sent: false, reason: 'send-failed', error };
    }

    return { sent: true };
  } catch (error) {
    console.error('[email] Failed to send confirmation:', error);
    return { sent: false, reason: 'send-failed', error };
  }
}
