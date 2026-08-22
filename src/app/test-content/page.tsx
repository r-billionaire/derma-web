import { clinicInfo, services, providers, testimonials } from '@/content';

export default function TestContentPage() {
  return (
    <div className="p-8 space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Clinic Info</h2>
        <pre className="bg-neutral/10 p-4 rounded">{JSON.stringify(clinicInfo, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Services</h2>
        <pre className="bg-neutral/10 p-4 rounded">{JSON.stringify(services, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Providers</h2>
        <pre className="bg-neutral/10 p-4 rounded">{JSON.stringify(providers, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
        <pre className="bg-neutral/10 p-4 rounded">{JSON.stringify(testimonials, null, 2)}</pre>
      </section>
    </div>
  );
}
