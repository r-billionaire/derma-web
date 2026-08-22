import { calculateAvailableSlots } from '@/lib/booking';
import { format } from 'date-fns';

export default async function TestBookingPage() {
  const providerId = '78894815-bbaa-4844-91b2-66c61d51e000';
  const duration = 30;
  const testDate = new Date();

  const slots = await calculateAvailableSlots(providerId, duration, testDate);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Booking Logic Test</h1>
      <div className="space-y-2">
        <p>Provider ID: {providerId}</p>
        <p>Duration: {duration} mins</p>
        <p>Date: {format(testDate, 'PPPP')}</p>
        <p>Available Slots: {slots.length}</p>
      </div>
      <ul className="space-y-1 font-mono text-sm">
        {slots.map((slot, i) => (
          <li key={i}>
            {format(slot.start, 'HH:mm')} - {format(slot.end, 'HH:mm')}
          </li>
        ))}
      </ul>
    </div>
  );
}
