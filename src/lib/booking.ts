import { supabase } from './supabase';
import { addMinutes, format, parse, isAfter, startOfDay, endOfDay } from 'date-fns';

export interface Slot {
  start: Date;
  end: Date;
}

export async function calculateAvailableSlots(
  providerId: string,
  durationMinutes: number,
  date: Date
): Promise<Slot[]> {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // 1. Get recurring availability for this provider on this day
  const { data: availability, error: availError } = await supabase
    .from('availability')
    .select('start_time, end_time')
    .eq('provider_id', providerId)
    .eq('day_of_week', dayOfWeek)
    .single();

  if (availError || !availability) return [];

  // Convert HH:mm:ss to Date objects for the specific date
  const windowStart = parse(availability.start_time, 'HH:mm:ss', dayStart);
  const windowEnd = parse(availability.end_time, 'HH:mm:ss', dayStart);

  // 2. Get existing appointments for this provider on this date
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('provider_id', providerId)
    .gte('start_time', dayStart.toISOString())
    .lte('start_time', dayEnd.toISOString());

  if (apptError) return [];

  // 3. Generate all possible slots in the window
  const slots: Slot[] = [];
  let current = windowStart;

  while (addMinutes(current, durationMinutes) <= windowEnd) {
    const slotEnd = addMinutes(current, durationMinutes);

    // Check if this slot overlaps with any existing appointment
    const isOverlapping = appointments.some((appt) => {
      const apptStart = new Date(appt.start_time);
      const apptEnd = new Date(appt.end_time);
      return current < apptEnd && slotEnd > apptStart;
    });

    if (!isOverlapping) {
      slots.push({ start: current, end: slotEnd });
    }

    current = addMinutes(current, durationMinutes);
  }

  // 4. Apply minimum-notice buffer (no booking within the next 2 hours)
  const now = new Date();
  const bufferEnd = addMinutes(now, 120);

  return slots.filter((slot) => isAfter(slot.start, bufferEnd));
}
