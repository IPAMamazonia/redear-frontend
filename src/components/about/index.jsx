import { Section, SectionHeading, GlassCard, GradientText, FadeUp } from '@/components';
import { selectSensors } from '@/store/slices/sensorsSlice';
import { useTranslation } from '@/i18n';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

/**
 * Seção "Sobre" com texto institucional e cards de estatísticas.
 */
export function About() {
  const sensors = useSelector(selectSensors);
  const { t } = useTranslation();

  const [stats, setStats] = useState([
    { id: 'sensors-total', number: '-', labelKey: 'about.stats.sensorsTotal' },
    { id: 'states-monitored', number: '-', labelKey: 'about.stats.statesMonitored' },
    { id: 'sensors-redear', number: '-', labelKey: 'about.stats.sensorsRedear' },
    { id: 'sensors-purpleair', number: '-', labelKey: 'about.stats.sensorsPurpleair' },
    { id: 'readings-daily', number: '10 mil+', labelKey: 'about.stats.readingsDaily' },
    { id: 'monitoring-continuous', number: '24h/7', labelKey: 'about.stats.monitoringContinuous' },
  ]);

  useEffect(() => {
    if (!Array.isArray(sensors) && sensors.length === 0) {
      return;
    }

    const totalSensors = sensors.length;
    const redeArSensors = sensors.filter((s) => s.source === 'RedeAr').length;
    const purpleAirSensors = sensors.filter((s) => s.source === 'purpleAir').length;
    const statesMonitored = new Set(sensors.map((s) => s.estado)).size;

    setStats(() => [
      { id: 'sensors-total', number: totalSensors.toString(), labelKey: 'about.stats.sensorsTotal' },
      { id: 'states-monitored', number: statesMonitored.toString(), labelKey: 'about.stats.statesMonitored' },
      { id: 'sensors-redear', number: redeArSensors.toString(), labelKey: 'about.stats.sensorsRedear' },
      { id: 'sensors-purpleair', number: purpleAirSensors.toString(), labelKey: 'about.stats.sensorsPurpleair' },
      { id: 'readings-daily', number: '10 mil+', labelKey: 'about.stats.readingsDaily' },
      { id: 'monitoring-continuous', number: '24h/7', labelKey: 'about.stats.monitoringContinuous' },
    ]);
  }, [sensors]);

  return (
    <Section id="sobre" className="AboutComponent">
      <SectionHeading subtitle={t('about.subtitle')}>
        {t('about.titlePre')} <GradientText>RedeAr</GradientText>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-md:gap-10 max-w-[1280px] mx-auto items-center">
        <FadeUp>
          <div className="text-text-light text-[1.05rem] space-y-4">
            <p>
              {t('about.p1Pre')}
              <strong>RedeAr</strong>
              {t('about.p1Mid')}
              <strong>Brasil</strong>
              {t('about.p1Post')}
            </p>

            <p>{t('about.p2')}</p>

            <p>
              {t('about.p3Pre')}
              <strong>{t('about.p3Strong')}</strong>
              {t('about.p3Post')}
            </p>

            <p>
              {t('about.p4Pre')}
              <strong>{t('about.p4Strong')}</strong>
              {t('about.p4Post')}
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 gap-6 max-[480px]:grid-cols-1">
          {stats.map((stat, i) => (
            <FadeUp key={stat.id} delay={i * 100}>
              <GlassCard hover className="p-[1.8rem_1.5rem] text-center">
                <div className="text-[2.4rem] font-black tracking-tighter">
                  <GradientText>{stat.number}</GradientText>
                </div>
                <div className="text-sm text-text-light mt-[0.4rem] font-medium">{t(stat.labelKey)}</div>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
