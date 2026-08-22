import { testimonials } from '@/content';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Patient Voices</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
              What our patients <br />have to say.
            </h1>
            <p className="text-xl font-sans text-foreground/70 leading-relaxed">
              We pride ourselves on providing clinical excellence and a compassionate
              experience for everyone who walks through our doors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 bg-white border border-neutral/20 relative flex flex-col h-full">
                <div className="text-accent-secondary text-4xl font-serif absolute -top-4 left-8">“</div>
                <div className="relative z-10 flex-grow space-y-6">
                  <p className="text-lg font-sans text-foreground/80 leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-neutral/10">
                  <span className="font-sans font-medium text-foreground">{t.patientName}</span>
                  <div className="flex gap-1 text-accent-secondary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
