const GRADIENT_STYLE = {
  background: 'linear-gradient(135deg, #22A64A, #84AAD8)', // Alterado para cores da logo principal...
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/**
 * Texto com gradiente verde-laranja aplicado via background-clip.
 *
 * @param {ReactNode} props.children - Texto a ser exibido com gradiente.
 */
export function GradientText({ children }) {
  return <span className="GradientTextComponent" style={GRADIENT_STYLE}>{children}</span>;
}
