import { useRef, useEffect } from 'react';

/**
 * Hook que retorna uma ref para aplicar animação de fade-up via IntersectionObserver.
 * Adiciona a classe "visible" ao elemento quando ele entra na viewport.
 *
 * @returns {React.RefObject} ref a ser atribuída ao elemento alvo.
 */
export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
