import { useRef, useEffect } from 'react';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-[50px] scale-[0.97] transition-all duration-[0.7s] ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:scale-100"
    >
      {children}
    </div>
  );
}

const PARCEIROS = [
  { icon: 'fa-leaf', nome: 'BioAmazônia' },
  { icon: 'fa-university', nome: 'UFAC' },
  { icon: 'fa-tree', nome: 'Instituto Verdejar' },
  { icon: 'fa-globe', nome: 'GreenTech Soluções' },
  { icon: 'fa-hand-holding-heart', nome: 'RedeAr' },
];

export function Partners() {
  return (
    <section
      id="parceiros"
      className="PartnersComponent px-[5%] py-[100px] max-[480px]:py-[60px] max-[480px]:px-[4%] bg-white/50 backdrop-blur"
    >
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-[#1a2e3c] tracking-tight">
        Instituições{' '}
        <span className="bg-gradient-to-r from-[#00E676] to-[#FF6D00] bg-clip-text text-transparent">Envolvidas</span>
      </h2>

      <FadeUp>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#5a6d7a] uppercase tracking-widest mb-3">Desenvolvido por</p>
          <div
            className="text-3xl font-black tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #00E676, #FF6D00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            IPAM
          </div>
          <p className="text-sm text-[#5a6d7a] mt-1">Instituto de Pesquisa Ambiental da Amazônia</p>
        </div>
      </FadeUp>

      <h3 className="text-center text-[1.4rem] font-bold text-[#FF6D00] mb-8">Nossos Parceiros</h3>

      <FadeUp delay={100}>
        <div className="flex flex-wrap justify-center gap-8 max-w-[1200px] mx-auto items-center max-md:gap-4">
          {PARCEIROS.map((p) => (
            <div
              key={p.nome}
              className="bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border border-[rgba(255,255,255,0.35)] px-10 py-8 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-center min-h-[110px] min-w-[170px] max-md:min-w-[140px] max-md:p-6 transition-all duration-[0.35s] ease-out hover:-translate-y-[6px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
            >
              <div className="text-sm font-semibold text-[#5a6d7a] flex flex-col items-center gap-[5px]">
                <i
                  className={`fas ${p.icon} text-[2.2rem] mb-2 block`}
                  style={{
                    background: 'linear-gradient(135deg, #00E676, #FF6D00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                />
                {p.nome}
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
