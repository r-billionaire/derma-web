import { clinicInfo } from '@/content';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
              We're here to help <br />you glow.
            </h1>
            <p className="text-xl font-sans text-foreground/70 leading-relaxed">
              Whether you have a question about our services or need to reach
              our staff, we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-foreground">Our Location</h3>
                <p className="font-sans text-foreground/70 leading-relaxed">
                  {clinicInfo.address}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-foreground">Hours of Operation</h3>
                <ul className="space-y-2 font-mono text-sm text-foreground/70">
                  {clinicInfo.hours.map(h => (
                    <li key={h.label} className="flex justify-between gap-8">
                      <span>{h.label}</span>
                      <span>{h.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-foreground">Direct Contact</h3>
                <div className="space-y-2 font-sans text-foreground/70">
                  <p>Phone: {clinicInfo.phone}</p>
                  <p>Email: {clinicInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="aspect-square bg-neutral/20 relative border border-neutral/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.23456789!2d-104.99123456!3d39.73876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c83fb56789abc%3A0x123456789abcdef!2sApex%20Dermatology%20Denver!5e0!3m2!1sen!2sus!4v1724230000000!5m2!1sen!2sus"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 bg-white border border-neutral/20 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-foreground">Send a Message</h3>
                <p className="text-foreground/70 font-sans">
                  For appointments, please use our <Link href="/book" className="text-accent-primary underline underline-offset-4">booking system</Link>.
                </p>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral">Name</label>
                  <input type="text" className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral">Email</label>
                  <input type="email" className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary" required />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral">Message</label>
                  <textarea rows={5} className="w-full p-3 border border-neutral/20 outline-none focus:border-accent-primary" required></textarea>
                </div>
                <button type="submit" className="md:col-span-2 bg-accent-primary text-background py-4 rounded-sm font-sans font-bold hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
