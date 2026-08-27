import { ClinicInfo, Service, Provider, Testimonial } from './types';

export const clinicInfo: ClinicInfo = {
  name: 'Apex Dermatology Denver (U.S. Dermatology Partners)',
  address: '125 Rampart Way Ste 220, Denver, CO 80230, United States',
  phone: '+1 303-261-1525',
  email: 'contact@apexdermatology.example',
  hours: [
    { label: 'Monday', value: '7:00 AM - 5:00 PM' },
    { label: 'Tuesday', value: '7:00 AM - 5:00 PM' },
    { label: 'Wednesday', value: '7:00 AM - 5:00 PM' },
    { label: 'Thursday', value: '7:00 AM - 5:00 PM' },
    { label: 'Friday', value: '7:00 AM - 4:30 PM' },
    { label: 'Saturday', value: 'Closed' },
    { label: 'Sunday', value: 'Closed' },
  ],
};

export const services: Service[] = [
  {
    id: 'e4ef6ce8-2665-4a4d-90f1-46098dd5208f',
    name: 'Skin Cancer Screening',
    slug: 'skin-cancer-screening',
    description: 'Comprehensive full-body skin exam to detect early signs of skin cancer.',
    durationMinutes: 30,
    category: 'medical',
    // PLACEHOLDER: Unsplash stock, not client-owned. Replace with a real clinic photo.
    // Verified by eye: female clinician in a white coat in conversation with a seated
    // older patient in an exam room. Authentic consultation, not a posed studio shot.
    imageUrl:
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600&q=75&auto=format&fit=crop',
    imageAlt: 'A dermatologist in a white coat consulting with a seated patient in an exam room',
  },
  {
    id: '4a0487f1-204b-4b77-86fb-c9d009afd438',
    name: 'Mohs Surgery',
    slug: 'mohs-surgery',
    description: 'Precise surgical technique for treating basal cell and squamous cell carcinomas.',
    durationMinutes: 120,
    category: 'medical',
    // PLACEHOLDER: Unsplash stock, not client-owned. Replace with a real clinic photo.
    // Verified by eye: empty, immaculate operating room. Deliberately shows no patient,
    // no blood and no wound - this sits on a skin-cancer page.
    imageUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&q=75&auto=format&fit=crop',
    imageAlt: 'A clean, empty operating room with a surgical table beneath overhead surgical lights',
  },
  {
    id: '91b8b6ca-b383-4ad4-9c52-b7caac57359f',
    name: 'Chemical Peel',
    slug: 'chemical-peel',
    description: 'Exfoliating treatment to improve skin texture, tone, and clarity.',
    durationMinutes: 45,
    category: 'cosmetic',
    // PLACEHOLDER: Unsplash stock, not client-owned. Replace with a real clinic photo.
    // Verified by eye: practitioner applying a treatment mask with a brush. Cosmetic
    // without tipping into day-spa imagery.
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=75&auto=format&fit=crop',
    imageAlt:
      'A patient reclines with eyes closed while a clinician applies a facial treatment mask with a brush',
  },
  {
    id: '328557e4-2f6a-4469-9439-fcb583d7c3f2',
    name: 'Acne Treatment',
    slug: 'acne-treatment',
    description: 'Customized medical plan to manage and treat various forms of acne.',
    durationMinutes: 30,
    category: 'medical',
  },
];

export const providers: Provider[] = [
  {
    id: '78894815-bbaa-4844-91b2-66c61d51e000',
    name: 'Dr. Jane Smith', // PLACEHOLDER: Provider name
    slug: 'dr-jane-smith',
    bio: 'Board-certified dermatologist specializing in medical and surgical dermatology with 15 years of experience.', // PLACEHOLDER: Bio
    photoUrl: '/photos/providers/jane-smith.jpg', // PLACEHOLDER: Photo URL
    specialties: ['Skin Cancer Screening', 'Mohs Surgery'],
  },
  {
    id: '3aa64687-9e34-424f-8344-54ef849d194f',
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
