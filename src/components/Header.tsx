import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-neutral flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8">
        {/* // PLACEHOLDER: Logo */}
        <Link href="/" className="text-xl font-serif font-bold text-foreground">
          ClinicLogo
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-foreground/80">
          <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
          <Link href="/providers" className="hover:text-foreground transition-colors">Providers</Link>
          <Link href="/reviews" className="hover:text-foreground transition-colors">Reviews</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <a href="tel:555-0123" className="hidden sm:block font-mono text-xs tracking-wider text-foreground/70 hover:text-foreground transition-colors">
          555-0123
        </a>
        <Link
          href="/book"
          className="bg-accent-primary text-background px-4 py-2 rounded-sm text-sm font-sans font-medium hover:opacity-90 transition-opacity"
        >
          Book Appointment
        </Link>
      </div>
    </header>
  );
}
