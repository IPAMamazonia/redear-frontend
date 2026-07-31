import { useState } from 'react';
import { Section, SectionHeading, GlassCard, GradientText } from '@/components';

const FAQ_ITEMS = [
  {
    q: 'O que é o Índice de Qualidade do Ar (AQI)?',
    a: `O AQI (Air Quality Index) é um índice padronizado que representa a qualidade do ar com base na concentração 
    de poluentes atmosféricos. Quanto maior o valor do índice, pior é a qualidade do ar e maiores são os riscos à saúde.
    A escala do AQI varia de 0 a 500, sendo que valores mais baixos indicam melhor qualidade do ar. O índice é 
    calculado a partir das concentrações de poluentes, como o material particulado (PM2.5 e PM10), entre outros, 
    conforme a metodologia adotada.', //(PM2.5 e PM10), ozônio (O₃), dióxido de nitrogênio (NO₂) e outros.`,
  },
  {
    q: `Como a qualidade do ar é medida?`,
    a: `Utilizamos sensores de baixo custo que realizam medições contínuas da qualidade do ar. Os equipamentos 
    monitoram a concentração de material particulado (PM2.5 e PM10), além da temperatura e da umidade relativa do ar.
    Os dados coletados são processados e convertidos em indicadores de qualidade do ar com base em metodologias 
    reconhecidas internacionalmente e nas diretrizes dos órgãos ambientais brasileiros, permitindo o acompanhamento 
    das condições atmosféricas em tempo real.`,
  },
  {
    q: `O que significam as cores do AQI?`,
    a: `As cores representam as categorias de qualidade do ar e indicam o potencial risco à saúde associado 
    à exposição aos poluentes atmosféricos: Verde (Bom) — 0 a 40; Amarelo (Moderado) — 41 a 80;
    Laranja (Ruim) — 81 a 120; Vermelho (Muito Ruim) — 121 a 200; Marrom (Péssimo) — acima de 200.
    Quanto pior a categoria, maiores são os riscos à saúde, especialmente para crianças, idosos, gestantes e 
    pessoas com doenças respiratórias ou cardiovasculares.`,
  },
  {
    q: `Como a poluição do ar afeta a saúde?`,
    a: `A exposição à poluição do ar pode causar ou agravar diversos problemas de saúde, especialmente quando 
    os níveis de poluentes permanecem elevados por longos períodos. Entre os principais efeitos estão irritação 
    nos olhos, nariz e garganta, dificuldade para respirar, agravamento de doenças respiratórias, como asma e 
    bronquite, e aumento do risco de doenças cardiovasculares. Crianças, idosos, gestantes e pessoas com doenças 
    respiratórias ou cardiovasculares são os grupos mais vulneráveis aos impactos da poluição do ar.`,
  },
  {
    q: `Os dados são atualizados em tempo real?`,
    a: `Sim! Os sensores da RedeAr transmitem dados automaticamente para a plataforma a cada hora. 
    Assim que novas medições são recebidas, os gráficos e indicadores são atualizados, permitindo o 
    acompanhamento contínuo da qualidade do ar nas regiões monitoradas.`,
  },
  {
    q: `Como posso contribuir com o projeto?`,
    a: `Você pode contribuir divulgando a iniciativa, compartilhando os dados da plataforma, estabelecendo 
    parcerias ou apoiando o desenvolvimento do projeto. Instituições de pesquisa, organizações da sociedade 
    civil e órgãos públicos também podem colaborar por meio da instalação de novos sensores e da utilização 
    dos dados em pesquisas, estudos e na formulação de políticas públicas. Se sua instituição tem interesse 
    em fazer parte da RedeAr, entre em contato conosco.`,
  },
  {
    q: `O projeto cobre todo o Brasil?`,
    a: `Ainda não. Atualmente, a RedeAr conta com sensores instalados em estados das regiões Norte e 
    Centro-Oeste, e está em constante expansão para ampliar a cobertura do monitoramento da qualidade do 
    ar no país. Nosso objetivo é construir uma rede nacional de monitoramento que contemple todos os biomas 
    brasileiros — Amazônia, Cerrado, Pantanal, Caatinga, Mata Atlântica e Pampa —, fortalecendo a 
    disponibilidade de dados em diferentes regiões do Brasil.`,
  },
  {
    q: `Como os sensores são instalados e mantidos?`,
    a: `Os sensores da RedeAr são instalados em parceria com universidades, instituições de pesquisa, 
    unidades de conservação, comunidades indígenas e outras organizações parceiras. Cada estação passa por 
    inspeções e manutenções periódicas para garantir seu funcionamento adequado e a qualidade dos dados coletados.
    Além disso, os dados são submetidos a procedimentos de controle de qualidade para assegurar sua 
    confiabilidade antes de serem disponibilizados na plataforma.`,
  },
];

/**
 * Seção de Perguntas Frequentes (FAQ) com accordion.
 */
export function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <Section id="faq" alt className="FAQComponent">
      <SectionHeading subtitle="Tire suas dúvidas sobre o projeto e a qualidade do ar">
        Perguntas <GradientText>Frequentes</GradientText>
      </SectionHeading>

      <div className="max-w-[1100px] mx-auto">
        {FAQ_ITEMS.map((item, idx) => (
          <GlassCard key={idx} sm className="mb-3 overflow-hidden card-lift">
            <button
              onClick={() => toggle(idx)}
              className="w-full px-6 py-[1.2rem] text-left bg-transparent border-none text-base font-semibold text-text-dark cursor-pointer flex justify-between items-center gap-4"
            >
              {item.q}
              <span
                className={`shrink-0 text-xl font-light text-[#FF6D00] leading-none transition-transform duration-[0.35s] ease-out ${
                  activeIndex === idx ? 'rotate-[135deg]' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`text-text-light leading-relaxed transition-all duration-[0.4s] ease-out overflow-hidden ${
                activeIndex === idx ? 'max-h-[300px] px-6 pb-5' : 'max-h-0 px-6'
              }`}
            >
              {item.a}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
