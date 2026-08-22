import Link from 'next/link';

export default function BookingCTA() {
  return (
    <section className="py-24 md:py-32 bg-accent-primary text-background text-center">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <h2 className="text-4xl md:text-6xl font-serif leading-tight">
          Ready to prioritize <br />your skin health?
        </h2>
        <p className="text-lg font-sans text-background/80 max-w-md mx-auto leading-relaxed">
          Schedule your appointment today. We offer flexible booking for both medical and cosmetic needs.
        </p>
        <div className="pt-4">
          <Link
            href="/book"
            className="inline-block bg-background text-accent-primary px-8 py-4 rounded-sm text-lg font-sans font-bold hover:opacity-90 transition-opacity shadow-xl"
          >
            Book Your Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
