import { ClinicInfo, Service, Provider, Testimonial } from './types';

export const clinicInfo: ClinicInfo = {
  // PLACEHOLDER: Clinic name and contact info
  name: 'ClearSkin Dermatology',
  address: '123 Medical Plaza, Suite 400, City, ST 12345',
  phone: '555-0123',
  email: 'contact@clearskinderm.example',
  hours: [
    { label: 'Monday', value: '7:00 AM - 5:00 PM' },
    { label: 'Tuesday', value: '7:00 AM - 5:00 PM' },
    { label: 'Wednesday', value: '7:00 AM - 5:00 PM' },
    { label: 'Thursday', value: '7:00 AM - 5:00 PM' },
    { label: 'Friday', value: '7:00 AM - 5:00 PM' },
    { label: 'Saturday', value: 'Closed' },
    { label: 'Sunday', value: 'Closed' },
  ],
};

export const services: Service[] = [
  {
    id: 's1',
    name: 'Skin Cancer Screening',
    slug: 'skin-cancer-screening',
    description: 'Comprehensive full-body skin exam to detect early signs of skin cancer.',
    durationMinutes: 30,
    category: 'medical',
  },
  {
    id: 's2',
    name: 'Mohs Surgery',
    slug: 'mohs-surgery',
    description: 'Precise surgical technique for treating basal cell and squamous cell carcinomas.',
    durationMinutes: 120,
    category: 'medical',
  },
  {
    id: 's3',
    name: 'Chemical Peel',
    slug: 'chemical-peel',
    description: 'Exfoliating treatment to improve skin texture, tone, and clarity.',
    durationMinutes: 45,
    category: 'cosmetic',
  },
  {
    id: 's4',
    name: 'Acne Treatment',
    slug: 'acne-treatment',
    description: 'Customized medical plan to manage and treat various forms of acne.',
    durationMinutes: 30,
    category: 'medical',
  },
];

export const providers: Provider[] = [
  {
    id: 'p1',
    name: 'Dr. Jane Smith', // PLACEHOLDER: Provider name
    slug: 'dr-jane-smith',
    bio: 'Board-certified dermatologist specializing in medical and surgical dermatology with 15 years of experience.', // PLACEHOLDER: Bio
    photoUrl: '/photos/providers/jane-smith.jpg', // PLACEHOLDER: Photo URL
    specialties: ['Skin Cancer Screening', 'Mohs Surgery'],
  },
  {
    id: 'p2',
    name: 'Dr. Michael Chen', // PLACEHOLDER: Provider name
    slug: 'dr-michael-chen',
    bio: 'Expert in cosmetic dermatology and laser treatments, focusing on healthy, glowing skin for all ages.', // PLACEHOLDER: Bio
    photoUrl: '/photos/providers/michael-chen.jpg', // PLACEHOLDER: Photo URL
    specialties: ['Chemical Peels', 'Acne Treatment'],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    patientName: 'Sarah J.', // PLACEHOLDER: Generic identity
    quote: 'The team here is professional and caring. My skin has never looked better.',
    rating: 5,
  },
  {
    id: 't2',
    patientName: 'Mark T.', // PLACEHOLDER: Generic identity
    quote: 'Efficient, thorough, and welcoming. Highly recommend for anyone needing a skin check.',
    rating: 5,
  },
];
