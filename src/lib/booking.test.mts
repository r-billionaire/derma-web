// Run: node src/lib/booking.test.mts
//
// Exercises the real anon-key path against the live database, so it proves the
// RLS posture as well as the slot maths:
//   - availability/providers/services are publicly readable
//   - a booked appointment removes exactly its own slot
//   - `select * from appointments` returns nothing to the anon key
//   - get_booked_slots hands back times only, never patient columns
//   - the UNIQUE (provider_id, start_time) constraint rejects a double-book
//
// It inserts one appointment and cannot remove it again - anon has no DELETE
// policy - so it prints the row to clean up with a privileged connection.
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// booking.ts uses extensionless relative imports because the bundler resolves
// them. Teach plain Node the same trick so the real module can be tested as-is.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && !/\.[mc]?[jt]sx?$/.test(specifier)) {
      for (const ext of ['.ts', '.mts', '.tsx']) {
        const candidate = new URL(specifier + ext, context.parentURL);
        if (existsSync(fileURLToPath(candidate))) {
          return { url: candidate.href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

process.loadEnvFile('.env.local');

const { calculateAvailableSlots } = await import('./booking.ts');
const { supabase } = await import('./supabase.ts');
const { clinicToday, clinicWeekday, CLINIC_TIME_ZONE } = await import('./clinic-time.ts');

const PROVIDER_ID = '78894815-bbaa-4844-91b2-66c61d51e000'; // Dr. Jane Smith
const SERVICE_ID = 'e4ef6ce8-2665-4a4d-90f1-46098dd5208f'; // Skin Cancer Screening, 30m
const DURATION = 30;

/** Shift a `yyyy-MM-dd` calendar day, via UTC noon so no local offset applies. */
function addDays(dayISO: string, days: number): string {
  const d = new Date(`${dayISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Clinic-local `HH:mm` of an instant, for comparing against availability rows. */
function clinicHHMM(instant: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(instant);
}

// A weekday at the clinic, comfortably past the 2-hour minimum-notice buffer.
let testDay = addDays(clinicToday(), 7);
while (clinicWeekday(testDay) === 0 || clinicWeekday(testDay) === 6) {
  testDay = addDays(testDay, 1);
}

// 1. Public reference data is still readable with RLS on.
const { data: windows, error: availError } = await supabase
  .from('availability')
  .select('start_time, end_time')
  .eq('provider_id', PROVIDER_ID)
  .eq('day_of_week', clinicWeekday(testDay));
assert.equal(availError, null, `availability should be publicly readable: ${availError?.message}`);
assert.ok(windows && windows.length > 0, 'expected recurring availability for this weekday');

// 2. Baseline slots.
const before = await calculateAvailableSlots(PROVIDER_ID, DURATION, testDay);
assert.ok(before.length > 2, `expected several open slots, got ${before.length}`);

// 2b. Regression guard for the timezone bug: every slot must fall inside the
//     clinic's own opening hours. These used to be built in the *viewer's*
//     timezone, so on a UTC+05:30 machine an "08:00" slot was stored as 02:30Z -
//     20:30 the previous evening in Denver - while the screen still read 08:00.
for (const slot of before) {
  const at = clinicHHMM(slot.start);
  const insideSomeWindow = windows.some(
    (w) => at >= w.start_time.slice(0, 5) && at < w.end_time.slice(0, 5),
  );
  assert.ok(
    insideSomeWindow,
    `slot at ${at} clinic-local falls outside opening hours ` +
      windows.map((w) => `${w.start_time}-${w.end_time}`).join(', '),
  );
}

const target = before[2];

// 3. Book it exactly the way the server action does - no `.select()`, because
//    appointments has no SELECT policy and asking for the row back would fail.
const { error: insertError } = await supabase.from('appointments').insert({
  provider_id: PROVIDER_ID,
  service_id: SERVICE_ID,
  patient_name: 'RLS Test Patient',
  patient_email: 'rls-test@example.invalid',
  patient_phone: '+1 555 0100',
  start_time: target.start.toISOString(),
  end_time: target.end.toISOString(),
});
assert.equal(insertError, null, `anon insert must succeed under RLS: ${insertError?.message}`);

// 4. The anon key must not be able to read patient data back.
const { data: leaked } = await supabase.from('appointments').select('*');
assert.deepEqual(leaked ?? [], [], 'anon must not be able to read appointments');

// 5. get_booked_slots exposes the booked time and nothing else.
const { data: booked, error: rpcError } = await supabase.rpc('get_booked_slots', {
  p_provider_id: PROVIDER_ID,
  p_day: testDay,
});
assert.equal(rpcError, null, `get_booked_slots must be callable by anon: ${rpcError?.message}`);
assert.ok(booked.length >= 1, 'get_booked_slots should report the appointment just made');
for (const row of booked) {
  assert.deepEqual(
    Object.keys(row).sort(),
    ['end_time', 'start_time'],
    `get_booked_slots leaked columns: ${Object.keys(row).join(', ')}`,
  );
}

// 6. That slot - and only that slot - is now gone.
const after = await calculateAvailableSlots(PROVIDER_ID, DURATION, testDay);
assert.equal(after.length, before.length - 1, 'exactly one slot should have been consumed');
assert.ok(
  !after.some((s) => s.start.getTime() === target.start.getTime()),
  'the booked slot must no longer be offered',
);
assert.ok(
  after.some((s) => s.start.getTime() === before[1].start.getTime()),
  'neighbouring slots must stay available',
);

// 7. The database constraint, not application code, is the double-booking guard.
const { error: dupeError } = await supabase.from('appointments').insert({
  provider_id: PROVIDER_ID,
  service_id: SERVICE_ID,
  patient_name: 'Double Booker',
  patient_email: 'dupe@example.invalid',
  patient_phone: '+1 555 0101',
  start_time: target.start.toISOString(),
  end_time: target.end.toISOString(),
});
assert.equal(dupeError?.code, '23505', `expected a unique violation, got ${dupeError?.code}`);

// 8. Minimum-notice buffer: nothing inside the next 2 hours is ever offered.
const today = await calculateAvailableSlots(PROVIDER_ID, DURATION, clinicToday());
const cutoff = Date.now() + 120 * 60_000;
assert.ok(
  today.every((s) => s.start.getTime() > cutoff),
  'a slot inside the 2-hour minimum-notice buffer was offered',
);

console.log('booking: all assertions passed');
console.log(`CLEANUP REQUIRED: delete appointment at ${target.start.toISOString()}`);
