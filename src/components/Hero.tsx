import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
              Advanced care <br />
              <span className="text-accent-primary">for every skin.</span>
            </h1>
            <p className="text-lg md:text-xl font-sans text-foreground/70 max-w-md leading-relaxed">
              From critical skin cancer screenings to aesthetic enhancements, we combine clinical precision with a personalized touch.
            </p>
          </div>

          {/* Dual Path Signature Element */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/services/skin-cancer-screening"
              className="group relative p-8 bg-white border border-neutral/20 hover:border-accent-primary transition-all duration-300 flex flex-col justify-between h-full min-h-[300px]"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral mb-4 block">Urgent & Medical</span>
                <h3 className="text-2xl font-serif text-foreground group-hover:text-accent-primary transition-colors mb-4">
                  Concerned about a spot?
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-sans font-medium text-accent-primary">
                Screening & Diagnostics
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link
              href="/services/chemical-peel"
              className="group relative p-8 bg-white border border-neutral/20 hover:border-accent-primary transition-all duration-300 flex flex-col justify-between h-full min-h-[300px]"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral mb-4 block">Wellness & Glow</span>
                <h3 className="text-2xl font-serif text-foreground group-hover:text-accent-primary transition-colors mb-4">
                  Want healthier, clearer skin?
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-sans font-medium text-accent-primary">
                Cosmetic Treatments
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative background element to add "editorial" feel */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl -z-10" />
    </section>
  );
}
