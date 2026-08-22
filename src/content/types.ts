export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    label: string;
    value: string;
  }[];
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  category: 'medical' | 'cosmetic';
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  quote: string;
  rating: number;
}
