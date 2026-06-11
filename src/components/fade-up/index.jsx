import { useRef, useEffect } from 'react';

/**
 * Animação de fade + translateY ao entrar na viewport via IntersectionObserver.
 *
 * @param {ReactNode} props.children - Conteúdo animado.
 * @param {number}    [props.delay=0] - Atraso em ms antes de ativar a animação.
 */
export function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="FadeUpComponent opacity-0 translate-y-[50px] scale-[0.97] transition-all duration-[0.7s] ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:scale-100"
    >
      {children}
    </div>
  );
}
