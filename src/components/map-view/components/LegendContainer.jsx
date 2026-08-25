export function LegendContainer({ children }) {
  return (
    <div className="LegendContainerComponent absolute bottom-[10px] left-[10px] z-10 flex flex-row items-center gap-2 max-md:hidden">
      {children}
    </div>
  );
}
