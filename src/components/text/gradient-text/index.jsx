export function GradientText({ children, from = 'verde', to = 'laranja' }) {
  return <span className={`bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`}>{children}</span>;
}
