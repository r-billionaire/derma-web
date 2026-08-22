import { providers } from '@/content';
import Link from 'next/link';

export default function ProvidersPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Our Experts</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
              Compassionate care, <br />clinical excellence.
            </h1>
            <p className="text-xl font-sans text-foreground/70 leading-relaxed">
              Our board-certified dermatologists combine decades of experience with a
              patient-first approach to provide the highest standard of skin care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {providers.map((provider) => (
              <div key={provider.id} className="group flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-full sm:w-64 h-80 bg-neutral/20 overflow-hidden relative">
                  {/* // PLACEHOLDER: Provider photo */}
                  <div className="absolute inset-0 flex items-center justify-center text-neutral/40 font-sans text-xs text-center p-4">
                    Photo: {provider.name}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-serif text-foreground group-hover:text-accent-primary transition-colors">
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
                  <p className="text-foreground/70 font-sans leading-relaxed text-base">
                    {provider.bio}
                  </p>
                  <Link
                    href={`/providers/${provider.slug}`}
                    className="inline-block text-sm font-sans font-medium text-accent-primary hover:underline underline-offset-4"
                  >
                    View full profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
