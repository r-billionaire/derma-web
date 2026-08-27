/**
 * Clinic-local time helpers.
 *
 * `availability` stores bare wall-clock times (`07:00:00`-`17:00:00`) with no
 * timezone. Those are the clinic's opening hours in the clinic's own timezone -
 * they are NOT relative to whoever happens to be looking at the site.
 *
 * Everything here converts between a calendar day + clinic wall-clock time and
 * an absolute instant, so the browser and the server agree on which instant a
 * slot refers to. Without this, a visitor in UTC+05:30 books "08:00" and the
 * database records 02:30Z - half past eight the previous evening in Denver -
 * while the screen still reads 08:00, so nothing looks wrong.
 *
 * Uses only `Intl`, so it works identically in the browser and in Node and
 * needs no timezone dependency.
 */

// PLACEHOLDER: belongs alongside the other clinic facts in /content once the
// clinic's real hours and timezone are confirmed.
export const CLINIC_TIME_ZONE = 'America/Denver';

/**
 * The UTC offset in effect at the clinic on a given calendar day, as `-06:00`.
 *
 * Probed at 12:00 UTC: that instant is inside the same calendar day everywhere
 * in the Americas, and far from the ~02:00 local DST changeover, so the offset
 * returned is the one that applies to normal clinic hours on that day.
 */
function clinicUtcOffset(dayISO: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CLINIC_TIME_ZONE,
    timeZoneName: 'longOffset',
  }).formatToParts(new Date(`${dayISO}T12:00:00Z`));

  const label = parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
  const match = label.match(/GMT([+-]\d{2}:\d{2})/);
  return match ? match[1] : '+00:00';
}

/** The instant at which clinic-local `HH:mm:ss` falls on `dayISO`. */
export function clinicInstant(dayISO: string, wallClock: string): Date {
  return new Date(`${dayISO}T${wallClock}${clinicUtcOffset(dayISO)}`);
}

/** The calendar day (`yyyy-MM-dd`) an instant falls on at the clinic. */
export function clinicDay(instant: Date): string {
  // en-CA formats as yyyy-MM-dd.
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TIME_ZONE }).format(instant);
}

/** Today's calendar day at the clinic, which may differ from the visitor's. */
export function clinicToday(): string {
  return clinicDay(new Date());
}

/**
 * Day of week (0 = Sunday) of a calendar day, matching `availability.day_of_week`.
 * Read off the date as written rather than via local time, which would shift it.
 */
export function clinicWeekday(dayISO: string): number {
  return new Date(`${dayISO}T12:00:00Z`).getUTCDay();
}

/** `7:00 AM` at the clinic. */
export function formatClinicTime(instant: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: CLINIC_TIME_ZONE,
  }).format(instant);
}

/** `Thursday, September 3, 2026` at the clinic. */
export function formatClinicDate(instant: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: CLINIC_TIME_ZONE,
  }).format(instant);
}

/** Short zone label for the instant, e.g. `MDT` - so remote visitors aren't misled. */
export function clinicZoneLabel(instant: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CLINIC_TIME_ZONE,
    timeZoneName: 'short',
  }).formatToParts(instant);
  return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
}
