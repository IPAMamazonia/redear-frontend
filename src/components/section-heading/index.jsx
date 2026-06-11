/**
 * Heading + subtitle padronizados para seções.
 *
 * @param {ReactNode} props.children - Texto do título (pode incluir <GradientText>).
 * @param {string}    [props.subtitle] - Subtítulo exibido abaixo do título.
 */
export function SectionHeading({ children, subtitle }) {
  return (
    <>
      <h2
        className="SectionHeadingComponent text-center text-[2.2rem] max-md:text-[1.8rem] 
        max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-text-dark tracking-tight"
      >
        {children}
      </h2>
      {subtitle && <p className="text-center text-text-light mb-[3.5rem] text-lg max-w-[600px] mx-auto">{subtitle}</p>}
    </>
  );
}
