/**
 * Wrapper de seção com padding responsivo e fundo alternativo opcional.
 *
 * @param {string}  [props.id]       - ID da âncora da seção.
 * @param {boolean} [props.alt]      - Se true, aplica fundo branco semi-transparente com backdrop-blur.
 * @param {string}  [props.className] - Classes adicionais (use para passar a classe marcadora).
 * @param {ReactNode} props.children - Conteúdo da seção.
 */
export function Section({ id, alt, children, className = '' }) {
  return (
    <section
      id={id}
      className={`${className} section-padding ${alt ? 'bg-white/50 backdrop-blur' : ''}`}
    >
      {children}
    </section>
  );
}
