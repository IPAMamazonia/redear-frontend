import { useEffect, useRef } from 'react';

/**
 * Executa um callback quando o usuário clica fora de um elemento.
 *
 * O listener só é registrado enquanto `enabled` for verdadeiro, evitando
 * trabalho desnecessário com o dropdown fechado.
 *
 * @param {import('react').RefObject<HTMLElement>} ref - Elemento que deve permanecer "dentro".
 * @param {(event: MouseEvent) => void} onOutside - Callback chamado em um clique externo.
 * @param {boolean} [enabled=true] - Liga/desliga o listener.
 */
export function useClickOutside(ref, onOutside, enabled = true) {
  const callbackRef = useRef(onOutside);

  useEffect(() => {
    callbackRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!enabled) return undefined;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current?.(event);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, enabled]);
}
