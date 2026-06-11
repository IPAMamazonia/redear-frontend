/**
 * Card com efeito glass (blur, borda, sombra) nas variantes padrão (16px) e sm (10px).
 *
 * @param {ReactNode}  props.children - Conteúdo do card.
 * @param {string}     [props.className] - Classes adicionais.
 * @param {boolean}    [props.hover]  - Se true, aplica efeito de levantar no hover.
 * @param {boolean}    [props.sm]     - Se true, usa border-radius menor (10px).
 */
export function GlassCard({ children, className = '', hover = false, sm = false }) {
  return (
    <div className={`GlassCardComponent ${sm ? 'glass-sm' : 'glass-card'} ${hover ? 'card-lift' : ''} ${className}`}>
      {children}
    </div>
  );
}
