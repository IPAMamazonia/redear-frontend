/**
 * Rola suavemente até o elemento apontado por uma âncora interna.
 *
 * Ignora links vazios (`#`) e âncoras inexistentes, em vez de deixar o
 * `querySelector` lançar uma exceção.
 *
 * @param {string} href - Âncora no formato `#id`.
 * @returns {boolean} `true` se o elemento foi encontrado e a rolagem iniciada.
 */
export function scrollToAnchor(href) {
  if (!href || href === '#') return false;

  const element = document.querySelector(href);
  if (!element) return false;

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}
