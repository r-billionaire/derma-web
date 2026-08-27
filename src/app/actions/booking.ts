'use server';

import { supabase } from '@/lib/supabase';
import { sendBookingConfirmation } from '@/lib/email';
import { Slot, calculateAvailableSlots } from '@/lib/booking';
import { clinicDay } from '@/lib/clinic-time';

export type BookingResult =
  | { ok: true; emailSent: boolean }
  | { ok: false; error: string };

/** Documented rule: nothing bookable inside the next 2 hours. */
const MIN_NOTICE_MINUTES = 120;

export async function bookAppointmentAction(
  providerId: string,
  serviceId: string,
  slot: Slot,
  patient: { name: string; email: string; phone: string }
): Promise<BookingResult> {
  // A server action is a public endpoint - re-check the inputs here, not just in
  // the form. Only name/email/phone/time are accepted; no health details (PHI).
  const name = patient.name?.trim() ?? '';
  const email = patient.email?.trim() ?? '';
  const phone = patient.phone?.trim() ?? '';
  const start = new Date(slot?.start);
  const end = new Date(slot?.end);

  if (!name) return { ok: false, error: 'Please enter your name.' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!phone) return { ok: false, error: 'Please enter a phone number.' };
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { ok: false, error: 'That appointment time is not valid. Please pick a slot again.' };
  }
  if (start.getTime() - Date.now() < MIN_NOTICE_MINUTES * 60_000) {
    return {
      ok: false,
      error: 'Appointments need at least 2 hours notice. Please choose a later time.',
    };
  }

  // A server action is a public endpoint, so the requested time is re-derived
  // from the provider's real availability rather than trusted. Clinic hours are
  // interpreted in the clinic's timezone, so this agrees with what the browser
  // offered - it would reject every legitimate booking if the two disagreed.
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('name, duration_minutes')
    .eq('id', serviceId)
    .maybeSingle();

  if (serviceError) {
    console.error('[booking] service lookup failed:', serviceError);
    return { ok: false, error: 'We could not save your appointment. Please try again.' };
  }
  if (!service) return { ok: false, error: 'That service is no longer offered.' };

  let offered: Slot[];
  try {
    offered = await calculateAvailableSlots(providerId, service.duration_minutes, clinicDay(start));
  } catch (error) {
    console.error('[booking] availability re-check failed:', error);
    return { ok: false, error: 'We could not confirm that time. Please try again in a moment.' };
  }

  // Match on the instant, and take the end time from our own calculation so a
  // crafted request cannot stretch an appointment or land outside working hours.
  const match = offered.find((slot) => slot.start.getTime() === start.getTime());
  if (!match) {
    return {
      ok: false,
      error: 'That time is no longer available. Please choose another slot.',
    };
  }

  // No `.select()` after the insert: that asks PostgREST for the created row,
  // which needs a SELECT policy, and `appointments` deliberately has none. The
  // client already has every detail it needs to render the confirmation.
  const { error: dbError } = await supabase.from('appointments').insert({
    provider_id: providerId,
    service_id: serviceId,
    patient_name: name,
    patient_email: email,
    patient_phone: phone,
    start_time: match.start.toISOString(),
    end_time: match.end.toISOString(),
  });

  if (dbError) {
    // 23505 = the UNIQUE (provider_id, start_time) guard: someone took the slot
    // between it being listed and confirmed.
    if (dbError.code === '23505') {
      return {
        ok: false,
        error: 'Sorry, that time was just booked by someone else. Please choose another slot.',
      };
    }
    console.error('[booking] insert failed:', dbError);
    return { ok: false, error: 'We could not save your appointment. Please try again.' };
  }

  const { data: provider } = await supabase
    .from('providers')
    .select('name')
    .eq('id', providerId)
    .maybeSingle();

  // Best-effort: the appointment is already saved, so email never fails the booking.
  const emailResult = await sendBookingConfirmation(
    email,
    name,
    service.name || 'Dermatology Service',
    match.start,
    provider?.name || 'Our Specialist'
  );

  return { ok: true, emailSent: emailResult.sent };
}
