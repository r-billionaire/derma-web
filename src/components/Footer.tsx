import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-neutral bg-background px-6 py-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Apex Dermatology Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-serif font-bold text-foreground">
              Apex Dermatology
            </span>
          </div>
          <p className="text-sm text-foreground/70 font-sans leading-relaxed">
            {/* // PLACEHOLDER: Clinic description */}
            Providing exceptional dermatology care for the community.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-neutral mb-4">Hours</h4>
          <ul className="text-sm font-mono text-foreground/70 space-y-1">
            <li>Mon-Fri: 7am - 5pm</li>
            <li>Sat-Sun: Closed</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-neutral mb-4">Quick Links</h4>
          <nav className="flex flex-col gap-2 text-sm font-sans text-foreground/70">
            <Link href="/services" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">All Services</Link>
            <Link href="/providers" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Our Providers</Link>
            <Link href="/reviews" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Patient Reviews</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Contact Us</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral/30 text-center text-xs font-sans text-foreground/40">
        © {new Date().getFullYear()} Apex Dermatology. All rights reserved.
      </div>
    </footer>
  );
}


