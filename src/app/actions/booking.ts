'use server';

import { supabase } from '@/lib/supabase';
import { sendBookingConfirmation } from '@/lib/email';
import { Slot } from '@/lib/booking';

export async function bookAppointmentAction(
  providerId: string,
  serviceId: string,
  slot: Slot,
  patient: { name: string; email: string; phone: string }
) {
  // 1. Insert into database
  const { data, error: dbError } = await supabase
    .from('appointments')
    .insert({
      provider_id: providerId,
      service_id: serviceId,
      patient_name: patient.name,
      patient_email: patient.email,
      patient_phone: patient.phone,
      start_time: slot.start.toISOString(),
      end_time: slot.end.toISOString(),
    })
    .select()
    .single();

  if (dbError) throw dbError;

  // 2. Send confirmation email
  const provider = await supabase.from('providers').select('name').eq('id', providerId).single();
  const service = await supabase.from('services').select('name').eq('id', serviceId).single();

  await sendBookingConfirmation(
    patient.email,
    patient.name,
    service.data?.name || 'Dermatology Service',
    slot.start,
    provider.data?.name || 'Our Specialist'
  );

  return data;
}
