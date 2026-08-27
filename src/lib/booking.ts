import { supabase } from './supabase';
import { addMinutes, isAfter } from 'date-fns';
import { clinicInstant, clinicWeekday } from './clinic-time';

export interface Slot {
  start: Date;
  end: Date;
}

/** Minimum-notice buffer: nothing bookable inside the next 2 hours. */
const MIN_NOTICE_MINUTES = 120;

interface BookedSlot {
  start_time: string;
  end_time: string;
}

/**
 * Bookable slots = the provider's recurring availability for that weekday,
 * minus already-booked appointments, minus the 2-hour minimum-notice buffer,
 * sliced by the service duration.
 *
 * `dayISO` is a calendar day (`yyyy-MM-dd`) at the clinic - deliberately a day
 * rather than a `Date`, because "the 3rd of September at the clinic" is not an
 * instant and treating it as one is how slots end up on the wrong day. Clinic
 * hours are interpreted in the clinic's timezone, so this returns the same
 * instants whether it runs in the browser or on the server.
 *
 * Throws on a database error rather than returning `[]`, so a failure is not
 * silently indistinguishable from "fully booked".
 */
export async function calculateAvailableSlots(
  providerId: string,
  durationMinutes: number,
  dayISO: string
): Promise<Slot[]> {
  // A provider may have zero rows for a weekday (closed) or several (e.g. a
  // split morning/afternoon shift). Honour all of them - `.single()` used to
  // throw in both cases.
  const { data: windows, error: availError } = await supabase
    .from('availability')
    .select('start_time, end_time')
    .eq('provider_id', providerId)
    .eq('day_of_week', clinicWeekday(dayISO))
    .order('start_time');

  if (availError) throw availError;
  if (!windows || windows.length === 0) return []; // closed that day

  // `appointments` has no public SELECT policy (it holds patient contact
  // details and the anon key ships in the browser bundle). Selecting the table
  // would return zero rows and make every slot look free, so booked times come
  // from a SECURITY DEFINER function that exposes times only.
  const { data: booked, error: bookedError } = await supabase.rpc('get_booked_slots', {
    p_provider_id: providerId,
    p_day: dayISO,
  });

  if (bookedError) throw bookedError;

  const busy = ((booked ?? []) as BookedSlot[]).map((b) => ({
    start: new Date(b.start_time),
    end: new Date(b.end_time),
  }));

  const noticeCutoff = addMinutes(new Date(), MIN_NOTICE_MINUTES);
  const slots: Slot[] = [];

  for (const window of windows) {
    const windowEnd = clinicInstant(dayISO, window.end_time);
    let start = clinicInstant(dayISO, window.start_time);

    while (addMinutes(start, durationMinutes) <= windowEnd) {
      const end = addMinutes(start, durationMinutes);
      const overlapsBooking = busy.some((b) => start < b.end && end > b.start);

      if (!overlapsBooking && isAfter(start, noticeCutoff)) {
        slots.push({ start, end });
      }

      start = end;
    }
  }

  return slots;
}
