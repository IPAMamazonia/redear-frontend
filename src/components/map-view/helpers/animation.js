/**
 * Cria um controlador de animação baseado em `requestAnimationFrame`.
 *
 * O controlador mantém o id do frame atual, permitindo cancelar uma animação
 * em andamento antes de iniciar outra.
 *
 * @returns {MapAnimator} Controlador com `animate` e `cancel`.
 */
export function createAnimator() {
  let frameId = null;

  function cancel() {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  /**
   * @param {number} duration - Duração em milissegundos.
   * @param {(eased: number) => void} onFrame - Chamado a cada frame com o progresso suavizado (0 a 1).
   * @param {() => void} [onDone] - Chamado ao final da animação.
   */
  function animate(duration, onFrame, onDone = () => {}) {
    const start = performance.now();

    function step(time) {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      onFrame(eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        frameId = null;
        onDone();
      }
    }

    frameId = requestAnimationFrame(step);
  }

  return { animate, cancel };
}
