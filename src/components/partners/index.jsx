import { Section, FadeUp, GradientText, GlassCard } from '@/components';

const PARCEIROS = [
  { icon: 'fa-leaf', nome: 'BioAmazônia' },
  { icon: 'fa-university', nome: 'UFAC' },
  { icon: 'fa-tree', nome: 'Instituto Verdejar' },
  { icon: 'fa-globe', nome: 'GreenTech Soluções' },
  { icon: 'fa-hand-holding-heart', nome: 'RedeAr' },
];

/**
 * Seção de parceiros com destaque para o IPAM e cards das instituições envolvidas.
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
        <div className="flex flex-wrap justify-center gap-8 max-w-[1200px] mx-auto items-center max-md:gap-4">
          {PARCEIROS.map((p) => (
            <GlassCard
              key={p.nome}
              hover
              className="px-10 py-8 flex items-center justify-center min-h-[110px] min-w-[170px] max-md:min-w-[140px] max-md:p-6"
            >
              <div className="text-sm font-semibold text-text-light flex flex-col items-center gap-[5px]">
                <i
                  className={`fas ${p.icon} text-[2.2rem] mb-2 block`}
                  style={{
                    background: 'linear-gradient(135deg, #22A64A, #84AAD8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                />
                {p.nome}
              </div>
            </GlassCard>
          ))}
        </div>
      </FadeUp>
    </Section>
  );
}
