import { providers } from '@/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return providers.map((provider) => ({
    slug: provider.slug,
  }));
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = providers.find((p) => p.slug === slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-96 h-[500px] bg-neutral/20 relative">
              {/* // PLACEHOLDER: Provider photo */}
              <div className="absolute inset-0 flex items-center justify-center text-neutral/40 font-sans text-center p-4">
                Photo: {provider.name}
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Link href="/providers" className="text-xs font-mono text-neutral hover:text-foreground transition-colors">
                    ← All Providers
                  </Link>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
                  {provider.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {provider.specialties.map(s => (
                    <span key={s} className="text-[10px] font-mono uppercase tracking-tighter text-neutral bg-neutral/10 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-foreground">About the provider</h2>
                <p className="text-lg font-sans text-foreground/70 leading-relaxed">
                  {provider.bio}
                </p>
              </div>

              <div className="pt-8">
                <Link
                  href="/book"
                  className="inline-block bg-accent-primary text-background px-8 py-4 rounded-sm text-lg font-sans font-bold hover:opacity-90 transition-opacity shadow-xl"
                >
                  Book Appointment with {provider.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-12 bg-white border border-neutral/20 space-y-8 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-serif text-foreground">Clinical Approach</h3>
            <p className="text-lg font-sans text-foreground/70 leading-relaxed">
              {provider.name} believes in a holistic approach to skin health, combining
              preventative care with advanced clinical treatments to ensure the best
              long-term outcomes for every patient.
            </p>
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-center space-y-1">
                <span className="block text-2xl font-serif text-foreground">15+</span>
                <span className="text-xs font-mono uppercase text-neutral">Years Exp.</span>
              </div>
              <div className="text-center space-y-1">
                <span className="block text-2xl font-serif text-foreground">Board</span>
                <span className="text-xs font-mono uppercase text-neutral">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
