import { Section, FadeUp, GradientText, GlassCard } from '@/components';

//IPAM
import logoIpam from '@/assets/sponsors/Logo - IPAM.svg';

//Partners and Sponsors
import logoCapacream from '@/assets/sponsors/Logo - CAPACREAM.png';
import logoConexao from '@/assets/sponsors/Logo - Rede Conexão Povos da Floresta.png';
import logoSema from '@/assets/sponsors/Logo - SEMA MT.png';
import logoUfac from '@/assets/sponsors/Logo - UFAC.png';
import logoUFMT from '@/assets/sponsors/Logo - UFMT.png';

//Developers
import logoUFPA from '@/assets/sponsors/Logo - UFPA.png';
import logoGuama from '@/assets/sponsors/Logo - Guama.png';
import logoLasse from '@/assets/sponsors/Logo - LASSE.png';
import logoWoodwell from '@/assets/sponsors/Logo - Woodwell.png';

const PARTNERS = [
  { src: logoCapacream, nome: 'CAPACREAM' },
  { src: logoConexao, nome: 'Rede Conexão Povos da Floresta' },
  { src: logoUFMT, nome: 'UFMT' },
  { src: logoSema, nome: 'SEMA MT' },
  { src: logoUfac, nome: 'UFAC' },
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
  return (
    <Section id="parceiros" alt className="PartnersComponent flex flex-col items-center justify-center gap-[10px]">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold text-text-dark tracking-tight">
        Instituições <GradientText>Envolvidas</GradientText>
      </h2>

      <FadeUp>
        <GlassCard className="flex flex-col justify-center text-center p-[40px] mb-[10px]">
          <p className="text-sm font-semibold text-text-light uppercase tracking-widest mb-2">Desenvolvido por</p>
          <img src={logoIpam} alt={'IPAM'} className="h-[200px]" loading="lazy" />
        </GlassCard>
      </FadeUp>

      <h3 className="text-center text-[1.4rem] font-bold text-[#22A64A]">Nossos Parceiros</h3>

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

      <h3 className="text-center text-[1.4rem] font-bold text-[#22A64A]"> Desenvolvimento dos Sensores </h3>

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
