'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { providers, services } from '@/content';
import { calculateAvailableSlots, Slot } from '@/lib/booking';
import {
  clinicToday,
  formatClinicDate,
  formatClinicTime,
  clinicZoneLabel,
} from '@/lib/clinic-time';
import Link from 'next/link';
import { bookAppointmentAction } from '@/app/actions/booking';

type BookingStep = 'provider' | 'service' | 'slot' | 'patient' | 'confirm' | 'success';

const STEP_LABELS: { step: BookingStep; label: string }[] = [
  { step: 'provider', label: 'Provider' },
  { step: 'service', label: 'Service' },
  { step: 'slot', label: 'Time' },
  { step: 'patient', label: 'Details' },
  { step: 'confirm', label: 'Confirm' },
];

export default function BookingFlow() {
  const [step, setStep] = useState<BookingStep>('provider');
  const [bookingData, setBookingData] = useState({
    providerId: '',
    serviceId: '',
    slot: null as Slot | null,
    patient: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  // A calendar day at the clinic (`yyyy-MM-dd`), which is what <input type="date">
  // produces natively - not an instant, which would drift by a day for visitors
  // far enough from Denver.
  const [selectedDay, setSelectedDay] = useState(clinicToday());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const nextStep = () => {
    if (step === 'provider') setStep('service');
    else if (step === 'service') setStep('slot');
    else if (step === 'slot') setStep('patient');
    else if (step === 'patient') setStep('confirm');
  };

  const prevStep = () => {
    if (step === 'service') setStep('provider');
    else if (step === 'slot') setStep('service');
    else if (step === 'patient') setStep('slot');
    else if (step === 'confirm') setStep('patient');
  };

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSlotsError(null);
    try {
      const service = services.find((s) => s.id === bookingData.serviceId);
      const duration = service?.durationMinutes || 30;
      const slots = await calculateAvailableSlots(bookingData.providerId, duration, selectedDay);
      setAvailableSlots(slots);
    } catch (e) {
      console.error(e);
      setAvailableSlots([]);
      // Distinguish a real failure from a genuinely empty day - they used to look identical.
      setSlotsError('We could not load available times. Please try again in a moment.');
    } finally {
      setLoadingSlots(false);
    }
  }, [bookingData.providerId, bookingData.serviceId, selectedDay]);

  useEffect(() => {
    if (step === 'slot' && bookingData.providerId && bookingData.serviceId) {
      fetchSlots();
    }
  }, [step, bookingData.providerId, bookingData.serviceId, selectedDay, fetchSlots]);

  async function handleConfirm() {
    setIsSubmitting(true);
    setBookingError(null);
    try {
      if (!bookingData.slot) {
        setBookingError('No time slot selected. Please go back and choose a time.');
        return;
      }

      const result = await bookAppointmentAction(
        bookingData.providerId,
        bookingData.serviceId,
        bookingData.slot,
        bookingData.patient
      );

      if (!result.ok) {
        setBookingError(result.error);
        return;
      }

      setEmailSent(result.emailSent);
      setStep('success');
    } catch (e) {
      console.error(e);
      setBookingError('Something went wrong while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const providerName = providers.find((p) => p.id === bookingData.providerId)?.name ?? '';
  const serviceName = services.find((s) => s.id === bookingData.serviceId)?.name ?? '';
  const summary: { label: string; value: string }[] = [
    { label: 'Provider', value: providerName },
    { label: 'Service', value: serviceName },
    { label: 'Date', value: bookingData.slot ? formatClinicDate(bookingData.slot.start) : '' },
    {
      label: 'Time',
      value: bookingData.slot
        ? `${formatClinicTime(bookingData.slot.start)} ${clinicZoneLabel(bookingData.slot.start)}`
        : '',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif text-foreground">
          {step === 'success' ? 'Appointment Confirmed' : 'Book Appointment'}
        </h1>
        {step !== 'success' && (
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-mono text-neutral">
            {STEP_LABELS.map((s, i) => (
              <React.Fragment key={s.step}>
                {i > 0 && <span aria-hidden="true">→</span>}
                <span className={step === s.step ? 'text-accent-primary font-bold' : ''}>
                  {s.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-neutral/20 p-8 rounded-sm min-h-[400px] flex flex-col">
        {step === 'provider' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif mb-6">Select a Provider</h2>
            <div className="grid grid-cols-1 gap-4">
              {providers.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setBookingData({ ...bookingData, providerId: p.id });
                    nextStep();
                  }}
                  className={`p-4 text-left border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm ${
                    bookingData.providerId === p.id ? 'border-accent-primary bg-accent-primary/5' : 'border-neutral/20 hover:border-accent-primary'
                  }`}
                >
                  <div className="font-serif text-lg">{p.name}</div>
                  <div className="text-xs font-mono text-neutral">{p.specialties.join(', ')}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'service' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 gap-4">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setBookingData({ ...bookingData, serviceId: s.id });
                    nextStep();
                  }}
                  className={`p-4 text-left border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm ${
                    bookingData.serviceId === s.id ? 'border-accent-primary bg-accent-primary/5' : 'border-neutral/20 hover:border-accent-primary'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-serif text-lg">{s.name}</div>
                    <span className="text-xs font-mono text-neutral">{s.durationMinutes}m</span>
                  </div>
                  <div className="text-sm text-foreground/70">{s.description}</div>
                </button>
              ))}
            </div>
            <button onClick={prevStep} className="text-sm text-neutral hover:text-foreground transition-colors">← Back</button>
          </div>
        )}

        {step === 'slot' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Select a Time</h2>
              <input
                type="date"
                aria-label="Appointment date"
                className="font-mono text-xs p-2 border border-neutral/20 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                value={selectedDay}
                min={clinicToday()}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
            </div>
            {slotsError && (
              <div
                role="alert"
                className="border-l-2 border-accent-secondary bg-neutral/5 px-4 py-3 space-y-1"
              >
                <p className="text-xs font-mono uppercase tracking-wide text-neutral">Couldn&apos;t load times</p>
                <p className="text-sm text-foreground">{slotsError}</p>
                <button
                  onClick={fetchSlots}
                  className="text-sm text-accent-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  Try again
                </button>
              </div>
            )}
            {loadingSlots ? (
              <div className="text-center py-12 text-neutral">Loading available slots...</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setBookingData({ ...bookingData, slot });
                        nextStep();
                      }}
                      className="p-3 text-center border border-neutral/20 hover:border-accent-primary text-sm font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm"
                    >
                      {formatClinicTime(slot.start)}
                    </button>
                  ))
                ) : (
                  !slotsError && (
                    <div className="col-span-full text-center py-12 text-foreground/60">No slots available for this date.</div>
                  )
                )}
              </div>
            )}
            <button onClick={prevStep} className="text-sm text-neutral hover:text-foreground transition-colors">← Back</button>
          </div>
        )}

        {step === 'patient' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif mb-6">Patient Information</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral" htmlFor="patient-name">Full Name</label>
                <input
                  id="patient-name"
                  type="text"
                  className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20"
                  value={bookingData.patient.name}
                  onChange={e => setBookingData({ ...bookingData, patient: { ...bookingData.patient, name: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral" htmlFor="patient-email">Email</label>
                <input
                  id="patient-email"
                  type="email"
                  className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20"
                  value={bookingData.patient.email}
                  onChange={e => setBookingData({ ...bookingData, patient: { ...bookingData.patient, email: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral" htmlFor="patient-phone">Phone</label>
                <input
                  id="patient-phone"
                  type="tel"
                  className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20"
                  value={bookingData.patient.phone}
                  onChange={e => setBookingData({ ...bookingData, patient: { ...bookingData.patient, phone: e.target.value } })}
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-6">
              <button onClick={prevStep} className="text-sm text-neutral hover:text-foreground transition-colors">← Back</button>
              <button
                disabled={!bookingData.patient.name || !bookingData.patient.email || !bookingData.patient.phone}
                onClick={nextStep}
                className="bg-accent-primary text-background px-6 py-2 rounded-sm font-sans font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif mb-6 text-center">Confirm Appointment</h2>
            <div className="bg-neutral/5 p-6 text-left space-y-3 font-sans text-sm">
              {summary.map(row => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-neutral">{row.label}:</span>
                  <span className="font-medium text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {bookingError && (
              <div
                role="alert"
                className="border-l-2 border-accent-secondary bg-neutral/5 px-4 py-3 space-y-1"
              >
                <p className="text-xs font-mono uppercase tracking-wide text-neutral">Booking not completed</p>
                <p className="text-sm text-foreground">{bookingError}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-6">
              <button onClick={prevStep} className="text-sm text-neutral hover:text-foreground transition-colors">← Back</button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="bg-accent-primary text-background px-6 py-2 rounded-sm font-sans font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-8" role="status" aria-live="polite">
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-wide text-accent-primary">Booked</p>
              <h2 className="text-2xl font-serif">
                Thank you, {bookingData.patient.name.split(' ')[0]}.
              </h2>
              <hr className="border-0 border-t border-accent-secondary" />
            </div>

            <div className="bg-neutral/5 p-6 text-left space-y-3 font-sans text-sm">
              {summary.map(row => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-neutral">{row.label}:</span>
                  <span className="font-medium text-right">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4">
                <span className="text-neutral">Email:</span>
                <span className="font-mono text-xs text-right break-all">{bookingData.patient.email}</span>
              </div>
            </div>

            <p className="text-sm text-foreground/70">
              {emailSent
                ? `A confirmation with these details has been sent to ${bookingData.patient.email}.`
                : 'Your appointment is booked. Please keep these details for your records.'}
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="text-sm text-accent-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                Return home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
