// Run: node src/lib/clinic-time.test.mts
//
// Clinic hours are stored as bare wall-clock times, so the whole booking system
// depends on these conversions. The DST cases are the ones that break silently.
import assert from 'node:assert/strict';
import {
  clinicInstant,
  clinicDay,
  clinicWeekday,
  formatClinicTime,
} from './clinic-time.ts';

// 07:00 at the clinic is a different instant in winter (MST, -07:00) than in
// summer (MDT, -06:00). Hard-coding either one drifts by an hour for half the year.
assert.equal(clinicInstant('2026-01-15', '07:00:00').toISOString(), '2026-01-15T14:00:00.000Z');
assert.equal(clinicInstant('2026-09-03', '07:00:00').toISOString(), '2026-09-03T13:00:00.000Z');

// Both 2026 DST transition days must still round-trip to 07:00 local.
for (const day of ['2026-03-08', '2026-11-01']) {
  assert.equal(formatClinicTime(clinicInstant(day, '07:00:00')), '7:00 AM', `07:00 on ${day}`);
}

// A slot is on the clinic's calendar day, not the viewer's. 07:00 Denver is
// already the same date; late-evening clinic time must not roll over either.
assert.equal(clinicDay(clinicInstant('2026-09-03', '07:00:00')), '2026-09-03');
assert.equal(clinicDay(clinicInstant('2026-09-03', '16:30:00')), '2026-09-03');

// Weekday must come from the date as written - reading it via the viewer's local
// time shifts it by a day for anyone far enough east or west.
assert.equal(clinicWeekday('2026-09-03'), 4); // Thursday
assert.equal(clinicWeekday('2026-08-30'), 0); // Sunday

// Every clinic-local wall clock time must survive the round trip unchanged.
for (const time of ['07:00:00', '09:30:00', '12:00:00', '16:45:00']) {
  const day = '2026-09-03';
  const back = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Denver',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(clinicInstant(day, time));
  assert.equal(back, time, `round trip ${time}`);
}

console.log('clinic-time: all assertions passed');
