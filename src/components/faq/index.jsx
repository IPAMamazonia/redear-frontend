import { useState } from 'react';

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

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="FAQComponent px-[5%] py-[100px] max-[480px]:py-[60px] max-[480px]:px-[4%] bg-white/50 backdrop-blur"
    >
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-[#1a2e3c] tracking-tight">
        Perguntas{' '}
        <span className="bg-gradient-to-r from-[#00E676] to-[#FF6D00] bg-clip-text text-transparent">Frequentes</span>
      </h2>
      <p className="text-center text-[#5a6d7a] mb-[3.5rem] text-lg max-w-[600px] mx-auto">
        Tire suas dúvidas sobre o projeto e a qualidade do ar
      </p>

      <div className="max-w-[1100px] mx-auto">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={`bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border border-[rgba(255,255,255,0.35)] rounded-[10px] mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-[0.35s] ease-out hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] hover:-translate-y-[2px]`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full px-6 py-[1.2rem] text-left bg-transparent border-none text-base font-semibold text-[#1a2e3c] cursor-pointer flex justify-between items-center gap-4"
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
              className={`text-[#5a6d7a] leading-relaxed transition-all duration-[0.4s] ease-out overflow-hidden ${
                activeIndex === idx ? 'max-h-[300px] px-6 pb-5' : 'max-h-0 px-6'
              }`}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
