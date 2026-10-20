import { Section, FadeUp, GradientText, GlassCard } from '@/components';
import { useTranslation } from '@/i18n';

//IPAM
import {
  logoCapacream,
  logoGuama,
  logoIpam,
  logoLasse,
  logoRCPF,
  logoSEMAMT,
  logoUEA,
  logoUFAC,
  logoUFMT,
  logoUFPA,
  logoUNC,
  logoWoodwell,
  logoRespiraAmazonia,
} from '@/assets/partners';

const PARTNERS = [
  { src: logoCapacream, nome: 'CAPACREAM' },
  { src: logoRCPF, nome: 'Rede Conexão Povos da Floresta' },
  { src: logoRespiraAmazonia, nome: 'Respira Amazonia' },
  { src: logoSEMAMT, nome: 'SEMA MT' },
  { src: logoUFAC, nome: 'UFAC' },
  { src: logoUEA, nome: 'UEA' },
  { src: logoUFMT, nome: 'UFMT' },
  { src: logoUNC, nome: 'University of Chicago' },
];

const DEVELOPERS = [
  { src: logoWoodwell, nome: 'Woodwell' },
  { src: logoUFPA, nome: 'UFPA' },
  { src: logoGuama, nome: 'Fundação Guama' },
  { src: logoLasse, nome: 'LASSE' },
];

/**
 * Seção de parceiros com destaque para o IPAM e mosaico dos logos das instituições envolvidas.
 */
export function Partners() {
  const { t } = useTranslation();
  return (
    <Section id="parceiros" alt className="PartnersComponent flex flex-col items-center justify-center gap-[10px]">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold text-text-dark tracking-tight">
        {t('partners.titlePre')} <GradientText>{t('partners.titleHighlight')}</GradientText>
      </h2>

      <FadeUp>
        <GlassCard className="flex flex-col justify-center text-center p-[40px] mb-[10px]">
          <p className="text-sm font-semibold text-text-light uppercase tracking-widest mb-2">
            {t('partners.developedBy')}
          </p>
          <img src={logoIpam} alt={'IPAM'} className="h-[200px]" loading="lazy" />
        </GlassCard>
      </FadeUp>

      <h3 className="text-center text-[1.4rem] font-bold text-[#22A64A]">{t('partners.ourPartners')}</h3>

      <FadeUp delay={100}>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[1200px] mb-[10px]">
          {PARTNERS.map((p) => (
            <GlassCard
              hover
              key={p.nome}
              className="flex flex-col items-center justify-center rounded-lg shadow-md p-[20px]"
            >
              <img src={p.src} alt={p.nome} className="h-[100px]" loading="lazy" />
            </GlassCard>
          ))}
        </div>
      </FadeUp>

      <h3 className="text-center text-[1.4rem] font-bold text-[#22A64A]">{t('partners.sensorDevelopment')}</h3>

      <FadeUp delay={100}>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[1200px] mb-[10px]">
          {DEVELOPERS.map((p) => (
            <GlassCard hover key={p.nome} className="flex flex-col items-center justify-center rounded-lg p-[20px]">
              <img src={p.src} alt={p.nome} className="h-[150px] rounded-[6px]" loading="lazy" />
            </GlassCard>
          ))}
        </div>
      </FadeUp>
    </Section>
  );
}
