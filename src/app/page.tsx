import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ServicesOverview from '@/components/ServicesOverview';
import Testimonials from '@/components/Testimonials';
import ProvidersOverview from '@/components/ProvidersOverview';
import BookingCTA from '@/components/BookingCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <Testimonials />
      <ProvidersOverview />
      <BookingCTA />
    </>
  );
}
