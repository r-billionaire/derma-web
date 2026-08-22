import { services } from '@/content';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Our Expertise</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
              Comprehensive care <br />for every skin concern.
            </h1>
            <p className="text-xl font-sans text-foreground/70 leading-relaxed">
              From critical medical screenings to aesthetic enhancements, we provide
              clinically-backed treatments tailored to your unique needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group p-8 bg-white border border-neutral/20 hover:border-accent-primary transition-all duration-300 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                      service.category === 'medical'
                        ? 'border-accent-primary text-accent-primary'
                        : 'border-accent-secondary text-accent-secondary'
                    }`}>
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif text-foreground group-hover:text-accent-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-foreground/70 font-sans leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium text-accent-primary mt-8 group-hover:translate-x-1 transition-transform"
                >
                  Learn more <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
