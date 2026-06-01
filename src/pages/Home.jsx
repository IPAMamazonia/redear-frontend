import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import Sobre from '@/components/Sobre';
import Grafico from '@/components/Grafico';
import Mapa from '@/components/Mapa';
import FAQ from '@/components/FAQ';
import Contato from '@/components/Contato';
import Parceiros from '@/components/Parceiros';
import Footer from '@/components/Footer';

export default function Home() {
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
      <Sobre />
      <Grafico />
      <Mapa />
      <FAQ />
      <Contato />
      <Parceiros />
      <Footer />
    </div>
  );
}
