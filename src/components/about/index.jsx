import { Section, SectionHeading, GlassCard, GradientText, FadeUp } from '@/components';

const STATS = [
  { numero: '12', rotulo: 'Sensores Ativos' },
  { numero: '9+', rotulo: 'Estados Monitorados' },
  { numero: '10 mil+', rotulo: 'Leituras Coletadas todos os dias' },
  { numero: '24/7', rotulo: 'Monitoramento Contínuo' },
];

/**
 * Seção "Sobre" com texto institucional e cards de estatísticas.
 */
export function About() {
  return (
    <Section id="sobre" className="AboutComponent">
      <SectionHeading subtitle="Conheça nossa iniciativa de monitoramento da qualidade do ar">
        Sobre o <GradientText>RedeAr</GradientText>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-md:gap-10 max-w-[1280px] mx-auto items-center">
        <FadeUp>
          <div className="text-text-light text-[1.05rem] space-y-4">
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
              <GlassCard hover className="p-[1.8rem_1.5rem] text-center">
                <div className="text-[2.4rem] font-black tracking-tighter">
                  <GradientText>{stat.numero}</GradientText>
                </div>
                <div className="text-sm text-text-light mt-[0.4rem] font-medium">{stat.rotulo}</div>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
