import { Section, FadeUp, GradientText, GlassCard } from '@/components';

import logoCapacream from '@/assets/sponsors/Logo - CAPACREAM.png';
import logoConexao from '@/assets/sponsors/Logo - Rede Conexão Povos da Floresta.png';
import logoSema from '@/assets/sponsors/Logo - SEMA MT.png';
import logoUfac from '@/assets/sponsors/Logo - UFAC.png';
import logoIpam from '@/assets/sponsors/Logo - IPAM.svg';

const PARCEIROS = [
  { src: logoCapacream, nome: 'CAPACREAM' },
  { src: logoConexao, nome: 'Rede Conexão Povos da Floresta' },
  { src: logoIpam, nome: 'IPAM' },
  { src: logoSema, nome: 'SEMA MT' },
  { src: logoUfac, nome: 'UFAC' },
];

/**
 * Seção de parceiros com destaque para o IPAM e mosaico dos logos das instituições envolvidas.
 */
export function Partners() {
  return (
    <Section id="parceiros" alt className="PartnersComponent">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-text-dark tracking-tight">
        Instituições <GradientText>Envolvidas</GradientText>
      </h2>

      <FadeUp>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-text-light uppercase tracking-widest mb-3">Desenvolvido por</p>
          <div className="text-3xl font-black tracking-tighter">
            <GradientText>IPAM</GradientText>
          </div>
          <p className="text-sm text-text-light mt-1">Instituto de Pesquisa Ambiental da Amazônia</p>
        </div>
      </FadeUp>

      <h3 className="text-center text-[1.4rem] font-bold text-[#22A64A] mb-8">Nossos Parceiros</h3>

      <FadeUp delay={100}>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[1200px] mx-auto">
          {PARCEIROS.map((p) => (
            <GlassCard key={p.nome} className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-[20px] card-lift">
              <img src={p.src} alt={p.nome} className="h-[100px]" loading="lazy" />
              <p className="text-center text-sm font-semibold text-text-light mt-2">{p.nome}</p>
            </GlassCard>
          ))}
        </div>
      </FadeUp>
    </Section>
  );
}
