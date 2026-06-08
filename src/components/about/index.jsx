import { useRef, useEffect } from 'react';

const STATS = [
  { numero: '12', rotulo: 'Sensores Ativos' },
  { numero: '9', rotulo: 'Estados Monitorados' },
  { numero: '5M+', rotulo: 'Dados Coletados' },
  { numero: '24/7', rotulo: 'Monitoramento Contínuo' },
];

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

export function About() {
  return (
    <section id="sobre" className="AboutComponent px-[5%] py-[100px] max-[480px]:py-[60px] max-[480px]:px-[4%]">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-[#1a2e3c] tracking-tight">
        Sobre o{' '}
        <span className="bg-gradient-to-r from-[#00E676] to-[#FF6D00] bg-clip-text text-transparent">RedeAr</span>
      </h2>
      <p className="text-center text-[#5a6d7a] mb-[3.5rem] text-lg max-w-[600px] mx-auto">
        Conheça nossa iniciativa de monitoramento da qualidade do ar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-md:gap-10 max-w-[1280px] mx-auto items-center">
        <FadeUp>
          <div className="text-[#5a6d7a] text-[1.05rem] space-y-4">
            <p>
              O <strong>RedeAr</strong> é uma plataforma de monitoramento da qualidade do ar desenvolvida para
              acompanhar em tempo real os índices de poluentes atmosféricos em todo o <strong>Brasil</strong>.
            </p>
            <p>
              Por meio de uma rede de sensores distribuídos estrategicamente, coletamos dados de material particulado
              (PM2.5 e PM10), ozônio, dióxido de nitrogênio e outros poluentes, transformando essas informações em{' '}
              <strong>dados abertos e acessíveis</strong> para pesquisadores, gestores públicos e a sociedade civil.
            </p>
            <p>
              Nosso objetivo é <strong>contribuir para a preservação ambiental</strong> e a saúde da população,
              fornecendo informações precisas e em tempo real sobre a qualidade do ar.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 gap-6 max-[480px]:grid-cols-1">
          {STATS.map((stat, i) => (
            <FadeUp key={stat.rotulo} delay={i * 100}>
              <div
                className="bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border border-[rgba(255,255,255,0.35)] p-[1.8rem_1.5rem] rounded-[16px] text-center
                  transition-all duration-[0.35s] ease-out shadow-[0_8px_32px_rgba(0,0,0,0.06)]
                  hover:-translate-y-[6px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
              >
                <div
                  className="text-[2.4rem] font-black tracking-tighter"
                  style={{
                    background: 'linear-gradient(135deg, #00E676, #FF6D00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.numero}
                </div>
                <div className="text-sm text-[#5a6d7a] mt-[0.4rem] font-medium">{stat.rotulo}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
