import { useEffect, useRef } from 'react';

/**
 * Hook que executa um callback em intervalos regulares.
 * O intervalo é pausado quando `delay` é null.
 *
 * @param {function}  callback - Função a ser executada.
 * @param {number|null} delay   - Intervalo em ms (null pausa o timer).
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
