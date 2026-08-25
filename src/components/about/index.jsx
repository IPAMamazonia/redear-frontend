import { Section, SectionHeading, GlassCard, GradientText, FadeUp } from '@/components';
import { selectSensors } from '@/store/slices/sensorsSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

/**
 * Seção "Sobre" com texto institucional e cards de estatísticas.
 */
export function About() {
  const sensors = useSelector(selectSensors);

  const [stats, setStats] = useState([
    { id: 'sensors-total', number: '-', label: 'Sensores Totais' },
    { id: 'states-monitored', number: '-', label: 'Estados Monitorados' },
    { id: 'sensors-redear', number: '-', label: 'Sensores RedeAr' },
    { id: 'sensors-purpleair', number: '-', label: 'Sensores PurpleAir' },
    { id: 'readings-daily', number: '10 mil+', label: 'Leituras Coletadas todos os dias' },
    { id: 'monitoring-continuous', number: '24h/7', label: 'Monitoramento Contínuo' },
  ]);

  useEffect(() => {
    if (!Array.isArray(sensors) && sensors.length === 0) {
      return;
    }

    const totalSensors = sensors.length;
    const redeArSensors = sensors.filter((s) => s.source === 'RedeAr').length;
    const purpleAirSensors = sensors.filter((s) => s.source === 'purpleAir').length;
    const statesMonitored = new Set(sensors.map((s) => s.estado)).size;

    setStats((prevStats) => [
      { id: 'sensors-total', number: totalSensors.toString(), label: 'Sensores Totais' },
      { id: 'states-monitored', number: statesMonitored.toString(), label: 'Estados Monitorados' },
      { id: 'sensors-redear', number: redeArSensors.toString(), label: 'Sensores RedeAr' },
      { id: 'sensors-purpleair', number: purpleAirSensors.toString(), label: 'Sensores PurpleAir' },
      { id: 'readings-daily', number: '10 mil+', label: 'Leituras Coletadas todos os dias' },
      { id: 'monitoring-continuous', number: '24h/7', label: 'Monitoramento Contínuo' },
    ]);
  }, [sensors]);

  return (
    <Section id="sobre" className="AboutComponent">
      <SectionHeading subtitle="Conheça nossa iniciativa de monitoramento da qualidade do ar">
        Sobre a <GradientText>RedeAr</GradientText>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-md:gap-10 max-w-[1280px] mx-auto items-center">
        <FadeUp>
          <div className="text-text-light text-[1.05rem] space-y-4">
            <p>
              A <strong>RedeAr</strong> é uma plataforma de monitoramento da qualidade do ar desenvolvida para
              acompanhar em tempo real os índices de poluentes atmosféricos em todo o <strong>Brasil</strong>.
            </p>

            <p>
              Ela foca em três principais objetivos: visualização, armazenamento e disponibilidade dos dados de sensores
              de diferentes parceiros da rede de monitoramento.
            </p>

            <p>
              Por meio de uma rede de sensores distribuídos estrategicamente, coletamos dados de material particulado
              (PM2.5 e PM10), umidade relativa do ar e temperatura, transformando essas informações em {' '}
              <strong>dados abertos e acessíveis</strong> para pesquisadores, gestores públicos e a sociedade civil.
            </p>

            <p>
              Nosso objetivo é <strong>fortalecer a rede de monitoramento da qualidade do ar no Brasil</strong>, fornecendo dados em 
              tempo real para auxiliar na elaboração de políticas públicas que impactem positivamente na saúde da população 
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 gap-6 max-[480px]:grid-cols-1">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 100}>
              <GlassCard hover className="p-[1.8rem_1.5rem] text-center">
                <div className="text-[2.4rem] font-black tracking-tighter">
                  <GradientText>{stat.number}</GradientText>
                </div>
                <div className="text-sm text-text-light mt-[0.4rem] font-medium">{stat.label}</div>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
