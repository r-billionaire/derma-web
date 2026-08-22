import { testimonials } from '@/content';

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-neutral/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral">Patient Stories</span>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">
            Trusted by our community.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="p-8 bg-white border border-neutral/20 relative">
              <div className="text-accent-secondary text-4xl font-serif absolute -top-4 left-8">“</div>
              <div className="relative z-10 space-y-6">
                <p className="text-lg font-sans text-foreground/80 leading-relaxed italic">
                  {t.quote}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium text-foreground">{t.patientName}</span>
                  <div className="flex gap-1 text-accent-secondary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
