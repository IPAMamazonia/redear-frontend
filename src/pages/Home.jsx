import { Navbar, HeroSlider, About, AQIChart, MapView, FAQ, Contact, Partners, Footer } from '@/components';

export function HomePage() {
  return (
    <div
      className="min-h-screen font-sans text-[#1a2e3c] leading-relaxed"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 0% 20%, rgba(0,230,118,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 100% 30%, rgba(255,109,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 80%, rgba(0,168,90,0.05) 0%, transparent 60%), #f0f5f1',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <HeroSlider />
      <About />
      <MapView />
      <AQIChart />
      <FAQ />
      <Contact />
      <Partners />
      <Footer />
    </div>
  );
}
