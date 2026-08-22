export default function TrustBar() {
  return (
    <div className="bg-neutral/5 border-y border-neutral/20 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-foreground/60 font-sans text-sm">
          <div className="flex items-center gap-2">
            <span className="text-accent-secondary">✓</span>
            <span>Board Certified Dermatologists</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-secondary">✓</span>
            <span>Advanced Mohs Surgery Suite</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-secondary">✓</span>
            <span>Patient-First Care Model</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-secondary">✓</span>
            <span>Cutting-Edge Cosmetic Tech</span>
          </div>
        </div>
      </div>
    </div>
  );
}
