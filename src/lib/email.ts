import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(
  patientEmail: string,
  patientName: string,
  serviceName: string,
  startTime: Date,
  providerName: string
) {
  try {
    await resend.emails.send({
      from: 'Clinic <bookings@clearskinderm.example>',
      to: [patientEmail],
      subject: 'Appointment Confirmed - ClearSkin Dermatology',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #2F4B3C;">Appointment Confirmed</h1>
          <p>Hello ${patientName},</p>
          <p>Your appointment for <strong>${serviceName}</strong> with <strong>${providerName}</strong> has been scheduled.</p>
          <div style="background: #F7F5F2; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>
          </div>
          <p>We look forward to seeing you soon.</p>
          <p>Best regards,<br />ClearSkin Dermatology</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error };
  }
}
