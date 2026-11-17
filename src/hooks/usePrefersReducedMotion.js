import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Indica se o usuário pediu menos movimento no sistema operacional.
 *
 * Use para desligar animações automáticas (como autoplay) e transições
 * decorativas, preservando o conteúdo e a navegação.
 *
 * @returns {boolean} `true` quando `prefers-reduced-motion: reduce` está ativo.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;

    const onChange = (event) => setReduced(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
