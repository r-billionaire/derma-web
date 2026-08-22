import { supabase } from '@/lib/supabase';
import { Slot } from '@/lib/booking';

export async function createAppointment(
  providerId: string,
  serviceId: string,
  slot: Slot,
  patient: { name: string; email: string; phone: string }
) {
  const { data, error } = await supabase
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

  if (error) throw error;
  return data;
}
