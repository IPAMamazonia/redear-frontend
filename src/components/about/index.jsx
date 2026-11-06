import { Section, SectionHeading, GlassCard, GradientText, FadeUp } from '@/components';
import { selectSensors } from '@/store/slices/sensorsSlice';
import { useTranslation } from '@/i18n';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { buildStats } from './stats';

/**
 * Seção "Sobre" com texto institucional e cards de estatísticas.
 */
export function About() {
  const sensors = useSelector(selectSensors);
  const { t } = useTranslation();

  const stats = useMemo(() => buildStats(sensors), [sensors]);

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
