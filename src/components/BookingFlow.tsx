'use client';

import React, { useState, useEffect } from 'react';
import { providers, services } from '@/content';
import { calculateAvailableSlots, Slot } from '@/lib/booking';
import { format, parse } from 'date-fns';
import Link from 'next/link';
import { bookAppointmentAction } from '@/app/actions/booking';

type BookingStep = 'provider' | 'service' | 'slot' | 'patient' | 'confirm';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (step === 'slot' && bookingData.providerId && bookingData.serviceId) {
      fetchSlots();
    }
  }, [step, bookingData.providerId, bookingData.serviceId, selectedDate]);

  async function fetchSlots() {
    setLoadingSlots(true);
    try {
      const service = services.find(s => s.id === bookingData.serviceId);
      const duration = service?.durationMinutes || 30;
      const slots = await calculateAvailableSlots(bookingData.providerId, duration, selectedDate);
      setAvailableSlots(slots);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleConfirm() {
    setIsSubmitting(true);
    try {
      if (!bookingData.slot) throw new Error('No slot selected');

      await bookAppointmentAction(
        bookingData.providerId,
        bookingData.serviceId,
        bookingData.slot,
        bookingData.patient
      );

      alert('Booking confirmed! You will receive an email shortly.');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif text-foreground">Book Appointment</h1>
        <div className="flex justify-center items-center gap-2 text-xs font-mono text-neutral">
          <span className={step === 'provider' ? 'text-accent-primary font-bold' : ''}>Provider</span>
          <span>→</span>
          <span className={step === 'service' ? 'text-accent-primary font-bold' : ''}>Service</span>
          <span>→</span>
          <span className={step === 'slot' ? 'text-accent-primary font-bold' : ''}>Time</span>
          <span>→</span>
          <span className={step === 'patient' ? 'text-accent-primary font-bold' : ''}>Details</span>
          <span>→</span>
          <span className={step === 'confirm' ? 'text-accent-primary font-bold' : ''}>Confirm</span>
        </div>
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
                className="font-mono text-xs p-2 border border-neutral/20 outline-none"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(parse(e.target.value, 'yyyy-MM-dd', new Date()))}
              />
            </div>
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
                      {format(slot.start, 'HH:mm')}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-foreground/60">No slots available for this date.</div>
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
                <label className="text-xs font-mono uppercase text-neutral">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20"
                  value={bookingData.patient.name}
                  onChange={e => setBookingData({ ...bookingData, patient: { ...bookingData.patient, name: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20"
                  value={bookingData.patient.email}
                  onChange={e => setBookingData({ ...bookingData, patient: { ...bookingData.patient, email: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral">Phone</label>
                <input
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
                disabled={!bookingData.patient.name || !bookingData.patient.email}
                onClick={nextStep}
                className="bg-accent-primary text-background px-6 py-2 rounded-sm font-sans font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-serif mb-6">Confirm Appointment</h2>
            <div className="bg-neutral/5 p-6 text-left space-y-3 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-neutral">Provider:</span>
                <span className="font-medium">{providers.find(p => p.id === bookingData.providerId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral">Service:</span>
                <span className="font-medium">{services.find(s => s.id === bookingData.serviceId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral">Date:</span>
                <span className="font-medium">{bookingData.slot ? format(bookingData.slot.start, 'PPPP') : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral">Time:</span>
                <span className="font-medium">{bookingData.slot ? format(bookingData.slot.start, 'HH:mm') : ''}</span>
              </div>
            </div>
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
      </div>
    </div>
  );
}
