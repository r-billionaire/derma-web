import { services } from '@/content';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Statically generate all four service routes. Also acts as a build-time check
// that every slug linked from the hero and the services grid actually resolves.
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary';

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1 space-y-8 order-2 md:order-1">
              <div className="space-y-4">
                <Link
                  href="/services"
                  className={`text-xs font-mono text-neutral hover:text-foreground transition-colors motion-reduce:transition-none ${focusRing}`}
                >
                  ← All Services
                </Link>
                <span
                  className={`block w-fit text-[10px] font-mono uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                    service.category === 'medical'
                      ? 'border-accent-primary text-accent-primary'
                      : 'border-accent-secondary text-accent-secondary'
                  }`}
                >
                  {service.category}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-foreground leading-tight">
                  {service.name}
                </h1>
              </div>

              <p className="text-lg md:text-xl font-sans text-foreground/70 leading-relaxed max-w-2xl">
                {service.description}
              </p>

              <dl className="flex flex-wrap gap-8 pt-2">
                <div className="space-y-1">
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-neutral">
                    Typical appointment
                  </dt>
                  <dd className="text-2xl font-serif text-foreground">
                    {service.durationMinutes} min
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-neutral">
                    Care type
                  </dt>
                  <dd className="text-2xl font-serif text-foreground capitalize">
                    {service.category}
                  </dd>
                </div>
              </dl>

              <div className="pt-4">
                <Link
                  href="/book"
                  className={`inline-block bg-accent-primary text-background px-8 py-4 rounded-sm text-lg font-sans font-bold hover:opacity-90 transition-opacity motion-reduce:transition-none shadow-xl ${focusRing}`}
                >
                  Book {service.name}
                </Link>
              </div>
            </div>

            <div className="w-full md:w-96 shrink-0 order-1 md:order-2">
              <div className="relative w-full aspect-4/5 bg-neutral/20 overflow-hidden">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.imageAlt ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                ) : (
                  // PLACEHOLDER: photo of the treatment room / procedure for this service.
                  <div className="absolute inset-0 flex items-center justify-center text-neutral/40 font-sans text-center p-4">
                    Photo: {service.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="space-y-4">
            <div className="h-px w-24 bg-accent-secondary" />
            <h2 className="text-3xl font-serif text-foreground">Other services</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/services/${other.slug}`}
                  className={`group block h-full p-6 bg-white border border-neutral/20 hover:border-accent-primary transition-colors motion-reduce:transition-none ${focusRing}`}
                >
                  <h3 className="text-xl font-serif text-foreground group-hover:text-accent-primary transition-colors motion-reduce:transition-none">
                    {other.name}
                  </h3>
                  <p className="mt-2 text-sm font-sans text-foreground/70 leading-relaxed">
                    {other.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
