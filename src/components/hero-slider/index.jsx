import { useState, useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80',
    title: 'RedeAr: Monitorando a Qualidade do Ar',
    subtitle: 'Dados em tempo real da qualidade do ar em todo o Brasil',
  },
  {
    img: 'https://ipam.org.br/wp-content/uploads/2026/03/Amazonia-em-chamas-sobrevoo-fumaca-2-Victor-Moriyama-Amazonia-em-Chamas.webp',
    title: 'Qualidade do Ar Importa',
    subtitle: 'Acompanhe a qualidade do ar em tempo real e proteja sua saúde',
  },
  {
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
    title: 'Dados para Transformação',
    subtitle: 'Tecnologia e informação a serviço do meio ambiente',
  },
];

/**
 * Slider/carrossel full-screen com transição automática, navegação por setas e dots.
 *
 * As imagens iniciam em scale(1.05) e reduzem para scale(1) ao passar o mouse (group-hover).
 */
export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useInterval(next, paused ? null : 10000);

  const handleDot = (idx) => {
    goTo(idx);
    setPaused(true);
    setTimeout(() => setPaused(false), 10000);
  };

  const handlePrev = () => {
    prev();
    setPaused(true);
    setTimeout(() => setPaused(false), 10000);
  };

  const handleNext = () => {
    next();
    setPaused(true);
    setTimeout(() => setPaused(false), 10000);
  };

  return (
    <section id="hero" className="HeroSliderComponent mt-[72px]">
      <div className="relative overflow-hidden h-[85vh] min-h-[520px] max-md:h-[65vh] max-md:min-h-[420px] max-[480px]:h-[60vh] max-[480px]:min-h-[360px]">
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,109,0,0.15), transparent 70%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(0,230,118,0.1), transparent 60%)',
          }}
        />
        <div className="relative w-full h-full">
          <div
            className="flex h-full transition-transform duration-[0.9s] ease-[cubic-bezier(0.65,0,0.35,1)] group"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div key={i} className="min-w-full h-full relative flex items-center justify-center">
                <img
                  src={slide.img}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[6s] ease-out group-hover:scale-100"
                />
                <div
                  className="absolute inset-0 z-[1]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(15,42,30,0.7) 0%, rgba(0,0,0,0.35) 50%, rgba(255,109,0,0.2) 100%)',
                  }}
                />
                <div className="relative z-[2] text-center text-white px-8 max-w-[750px]">
                  <h1
                    className="text-[3.5rem] max-md:text-2xl max-[480px]:text-[1.5rem] font-semibold mb-4 tracking-tighter leading-[1.15] max-md:leading-tight"
                    style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="text-xl max-md:text-base max-[480px]:text-[0.95rem] opacity-92 font-normal"
                    style={{ textShadow: '0 2px 15px rgba(0,0,0,0.25)' }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 z-[3] left-6 max-md:left-3 w-[52px] h-[52px] max-md:w-[44px] max-md:h-[44px] rounded-full bg-white/12 backdrop-blur-xl border border-white/20 text-white text-[1.4rem] max-md:text-[1.1rem] cursor-pointer flex items-center justify-center transition-all duration-[0.35s] ease-out hover:bg-white/25 hover:scale-108"
            aria-label="Anterior"
          >
            &#10094;
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 z-[3] right-6 max-md:right-3 w-[52px] h-[52px] max-md:w-[44px] max-md:h-[44px] rounded-full bg-white/12 backdrop-blur-xl border border-white/20 text-white text-[1.4rem] max-md:text-[1.1rem] cursor-pointer flex items-center justify-center transition-all duration-[0.35s] ease-out hover:bg-white/25 hover:scale-108"
            aria-label="Próximo"
          >
            &#10095;
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex gap-3">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                onClick={() => handleDot(i)}
                className={`w-[10px] h-[10px] rounded-full border-2 border-white/60 bg-transparent cursor-pointer transition-all duration-[0.35s] ease-out ${
                  i === current ? 'bg-white scale-130 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
