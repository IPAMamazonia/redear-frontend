import { useState } from 'react';
import { Section, SectionHeading, GlassCard, GradientText } from '@/components';

const FAQ_ITEMS = [
  {
    q: 'O que é o Índice de Qualidade do Ar (AQI)?',
    a: 'O AQI (Air Quality Index) é um índice padronizado que indica o nível de poluição do ar. Quanto maior o valor, pior a qualidade do ar. A escala vai de 0 (Bom) a 500+ (Péssimo), considerando poluentes como material particulado (PM2.5 e PM10), ozônio (O₃), dióxido de nitrogênio (NO₂) e outros.',
  },
  {
    q: 'Como a qualidade do ar é medida?',
    a: 'Utilizamos sensores de última geração que coletam amostras de ar continuamente. Os equipamentos medem a concentração de diferentes poluentes e os dados são processados e convertidos no Índice de Qualidade do Ar seguindo os padrões estabelecidos pela Organização Mundial da Saúde (OMS) e órgãos ambientais brasileiros.',
  },
  {
    q: 'O que significam as cores do AQI?',
    a: 'As cores indicam o nível de preocupação com a qualidade do ar: Verde (Bom) — 0 a 40; Amarelo (Moderado) — 41 a 80; Laranja (Ruim) — 81 a 120; Vermelho (Muito Ruim) — 121 a 200; Marrom (Péssimo) — acima de 200.',
  },
  {
    q: 'Como a poluição do ar afeta a saúde?',
    a: 'A exposição a altos níveis de poluição do ar pode causar problemas respiratórios, cardiovasculares, irritação nos olhos e garganta, além de agravar condições como asma e bronquite. Crianças, idosos e pessoas com doenças pré-existentes são os mais vulneráveis.',
  },
  {
    q: 'Os dados são atualizados em tempo real?',
    a: 'Sim! Nossos sensores transmitem dados a cada hora para nossa plataforma. Os gráficos e indicadores são atualizados automaticamente, permitindo o acompanhamento em tempo real da qualidade do ar em cada região monitorada.',
  },
  {
    q: 'Como posso contribuir com o projeto?',
    a: 'Você pode contribuir compartilhando nossos dados, divulgando a iniciativa, entrando em contato para parcerias ou apoiando financeiramente o projeto. Instituições de pesquisa e órgãos públicos podem solicitar acesso aos dados brutos para estudos e políticas públicas.',
  },
  {
    q: 'O projeto cobre todo o Brasil?',
    a: 'Atualmente monitoramos estados das regiões Norte e Centro-Oeste, com planos de expansão para todo o território nacional. Nosso objetivo é cobrir todos os biomas brasileiros: Amazônia, Cerrado, Pantanal, Caatinga, Mata Atlântica e Pampa.',
  },
  {
    q: 'Como os sensores são instalados e mantidos?',
    a: 'Os sensores são instalados em parceria com universidades locais, unidades de conservação e comunidades indígenas. Cada estação passa por manutenção periódica e calibração para garantir a precisão dos dados coletados.',
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
