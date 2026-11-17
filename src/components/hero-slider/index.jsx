import { useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useCarousel } from './useCarousel';
import { useTranslation } from '@/i18n';
import { SLIDES } from './slides';

/**
 * Slider/carrossel full-screen com transição automática, navegação por setas e dots.
 *
 * As imagens iniciam em scale(1.05) e reduzem para scale(1) ao passar o mouse (group-hover).
 * O autoplay pausa em hover, foco, aba oculta e quando o usuário pede menos movimento.
 */
export function HeroSlider() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!reducedMotion);
  const [interacting, setInteracting] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    if (!reducedMotion) return;
    setPlaying(false);
  }, [reducedMotion]);

  useEffect(() => {
    const onVisibilityChange = () => setPageHidden(document.hidden);

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const autoplayPaused = !playing || reducedMotion || interacting || pageHidden;
  const { current, goTo, prev, next } = useCarousel(SLIDES.length, { paused: autoplayPaused });

  return (
    <section
      id="hero"
      className="HeroSliderComponent mt-[72px]"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
    >
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
            className="flex h-full transition-transform duration-[0.9s] ease-[cubic-bezier(0.65,0,0.35,1)] group motion-reduce:transition-none"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide, index) => {
              const base = `hero.slides.${slide.key}`;

              return (
                <div
                  key={slide.key}
                  title={t(`${base}.author`)}
                  aria-hidden={index !== current}
                  className="min-w-full h-full relative flex items-center justify-center"
                >
                  <img
                    src={slide.img}
                    alt={t(`${base}.title`)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[6s] ease-out group-hover:scale-100 motion-reduce:transition-none"
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
                      {t(`${base}.title`)}
                    </h1>
                    <p
                      className="text-xl max-md:text-base max-[480px]:text-[0.95rem] opacity-92 font-normal"
                      style={{ textShadow: '0 2px 15px rgba(0,0,0,0.25)' }}
                    >
                      {t(`${base}.subtitle`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 z-[3] left-6 max-md:left-3 w-[52px] h-[52px] max-md:w-[44px] max-md:h-[44px] rounded-full bg-white/12 backdrop-blur-xl border border-white/20 text-white text-[1.4rem] max-md:text-[1.1rem] cursor-pointer flex items-center justify-center transition-all duration-[0.35s] ease-out hover:bg-white/25 hover:scale-108"
            aria-label={t('hero.prev')}
          >
            &#10094;
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 z-[3] right-6 max-md:right-3 w-[52px] h-[52px] max-md:w-[44px] max-md:h-[44px] rounded-full bg-white/12 backdrop-blur-xl border border-white/20 text-white text-[1.4rem] max-md:text-[1.1rem] cursor-pointer flex items-center justify-center transition-all duration-[0.35s] ease-out hover:bg-white/25 hover:scale-108"
            aria-label={t('hero.next')}
          >
            &#10095;
          </button>

          <div
            role="group"
            aria-label={t('hero.slideNavigation')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-3"
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t('hero.goToSlide', { index: i + 1 })}
                aria-current={i === current ? 'true' : undefined}
                className={`w-[10px] h-[10px] rounded-full border-2 border-white/60 bg-transparent cursor-pointer transition-all duration-[0.35s] ease-out motion-reduce:transition-none ${
                  i === current ? 'bg-white scale-130 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              disabled={reducedMotion}
              aria-label={playing ? t('hero.pause') : t('hero.play')}
              className="w-[26px] h-[26px] ml-1 rounded-full border-2 border-white/60 bg-white/12 backdrop-blur-xl text-white text-[10px] cursor-pointer flex items-center justify-center transition-all duration-[0.35s] ease-out hover:bg-white/25 motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
