import { providers } from '@/content';
import Link from 'next/link';

export default function ProvidersOverview() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Our Experts</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              Compassionate care, <br />clinical excellence.
            </h2>
          </div>
          <Link
            href="/providers"
            className="text-sm font-sans font-medium text-accent-primary hover:underline underline-offset-4"
          >
            Meet the team →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {providers.map((provider) => (
            <div key={provider.id} className="group flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-full sm:w-48 h-64 bg-neutral/20 overflow-hidden relative">
                {/* // PLACEHOLDER: Provider photo */}
                <div className="absolute inset-0 flex items-center justify-center text-neutral/40 font-sans text-xs text-center p-4">
                  Photo: {provider.name}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-foreground group-hover:text-accent-primary transition-colors">
                    {provider.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.specialties.map(s => (
                      <span key={s} className="text-[10px] font-mono uppercase tracking-tighter text-neutral bg-neutral/10 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-foreground/70 font-sans leading-relaxed text-sm">
                  {provider.bio}
                </p>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="inline-block text-sm font-sans font-medium text-accent-primary hover:underline underline-offset-4"
                >
                  View profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
