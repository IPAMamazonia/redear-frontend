import { useState } from 'react';
import { Section, SectionHeading, GlassCard, GradientText } from '@/components';
import { useTranslation } from '@/i18n';

/** Deve espelhar `faq.items` em pt.js e en.js (verificado por `scripts/check-i18n.js`). */
const FAQ_COUNT = 8;

/**
 * Seção de Perguntas Frequentes (FAQ) com accordion.
 */
export function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <Section id="faq" alt className="FAQComponent">
      <SectionHeading subtitle={t('faq.subtitle')}>
        {t('faq.titlePre')} <GradientText>{t('faq.titleHighlight')}</GradientText>
      </SectionHeading>

      <div className="max-w-[1100px] mx-auto">
        {Array.from({ length: FAQ_COUNT }, (_, idx) => (
          <GlassCard key={idx} sm className="mb-3 overflow-hidden card-lift">
            <button
              onClick={() => toggle(idx)}
              className="w-full px-6 py-[1.2rem] text-left bg-transparent border-none text-base font-semibold text-text-dark cursor-pointer flex justify-between items-center gap-4"
            >
              {t(`faq.items.${idx}.q`)}
              <span
                className={`shrink-0 text-xl font-light text-[#22A64A] leading-none transition-transform duration-[0.35s] ease-out ${
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
              {t(`faq.items.${idx}.a`)}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
