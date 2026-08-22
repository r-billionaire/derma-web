import { services } from '@/content';
import Link from 'next/link';

export default function ServicesOverview() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              Specialized care <br />for your skin's health.
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-sans font-medium text-accent-primary hover:underline underline-offset-4"
          >
            View all services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {services.map((service, index) => {
            const isFeatured = index === 0; // Feature the first service
            return (
              <div
                key={service.id}
                className={`group relative p-8 bg-white border border-neutral/20 hover:border-accent-primary transition-all duration-300 ${
                  isFeatured ? 'md:col-span-8' : 'md:col-span-4'
                }`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[10px] uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                        service.category === 'medical'
                          ? 'border-accent-primary text-accent-primary'
                          : 'border-accent-secondary text-accent-secondary'
                      }`}>
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-accent-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-foreground/70 font-sans leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-sans font-medium text-accent-primary group-hover:translate-x-1 transition-transform"
                  >
                    Learn more <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
