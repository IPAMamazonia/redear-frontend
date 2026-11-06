import { useCallback, useEffect, useRef, useState } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { AUTOPLAY_MS } from './slides';

/**
 * Controla o slide ativo e a pausa temporária do autoplay.
 *
 * Qualquer navegação manual pausa o autoplay por `autoplayMs` e reinicia a
 * contagem a cada clique, sem empilhar timeouts.
 *
 * @param {number} total - Quantidade de slides.
 * @param {number} [autoplayMs=AUTOPLAY_MS] - Intervalo do autoplay em ms.
 */
export function useCarousel(total, autoplayMs = AUTOPLAY_MS) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimeoutRef = useRef(null);

  const clearResume = useCallback(() => {
    if (resumeTimeoutRef.current == null) return;
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = null;
  }, []);

  const next = useCallback(() => {
    setCurrent((index) => (index + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((index) => (index - 1 + total) % total);
  }, [total]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    clearResume();
    resumeTimeoutRef.current = setTimeout(() => {
      resumeTimeoutRef.current = null;
      setPaused(false);
    }, autoplayMs);
  }, [autoplayMs, clearResume]);

  useEffect(() => clearResume, [clearResume]);

  useInterval(next, paused ? null : autoplayMs);

  const goTo = useCallback(
    (index) => {
      setCurrent(((index % total) + total) % total);
      pauseTemporarily();
    },
    [pauseTemporarily, total],
  );

  const prevManually = useCallback(() => {
    prev();
    pauseTemporarily();
  }, [pauseTemporarily, prev]);

  const nextManually = useCallback(() => {
    next();
    pauseTemporarily();
  }, [next, pauseTemporarily]);

  return { current, goTo, prev: prevManually, next: nextManually };
}
