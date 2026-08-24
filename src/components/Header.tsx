import Link from 'next/link';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/imagekit';

export default function Header() {
  return (
    <header className="border-b border-neutral flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">
          <Image
            src={getOptimizedImage('logo.png', { width: 80, height: 80 })}
            alt="Apex Dermatology Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-serif font-bold text-foreground">
            Apex Dermatology
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-foreground/80">
          <Link href="/services" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Services</Link>
          <Link href="/providers" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Providers</Link>
          <Link href="/reviews" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Reviews</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">Contact</Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <a href="tel:+13032611525" className="hidden sm:block font-mono text-xs tracking-wider text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-sm">
          +1 303-261-1525
        </a>
        <Link
          href="/book"
          className="bg-accent-primary text-background px-4 py-2 rounded-sm text-sm font-sans font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          Book Appointment
        </Link>
      </div>
    </header>
  );
}



