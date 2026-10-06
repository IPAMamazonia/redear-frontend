import { Section, SectionHeading, FadeUp, FormInput, FormTextarea, SocialLinks, GradientText } from '@/components';
import { contactAddress, contactMail, contactPhone } from '@/rules';
import { useTranslation } from '@/i18n';
import { useState } from 'react';

/**
 * Seção de contato com formulário e informações de contato.
 */
export function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', msg: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, email, msg } = form;
    if (!nome.trim() || !email.trim() || !msg.trim()) {
      setStatus({ type: 'error', key: 'contact.status.missingFields' });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setStatus({ type: 'error', key: 'contact.status.invalidEmail' });
      return;
    }
    setStatus({ type: 'success', key: 'contact.status.sent' });
    setForm({ nome: '', email: '', assunto: '', msg: '' });
  };

  return (
    <Section id="contato" className="ContactComponent">
      <SectionHeading subtitle={t('contact.subtitle')}>
        <GradientText>{t('contact.titlePre')}</GradientText> {t('contact.titleHighlight')}
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1100px] mx-auto">
        <FadeUp>
          <div>
            <h3 className="mb-4 text-lg">
              <i className="fas fa-comments text-[#22A64A] mr-2"></i> {t('contact.infoTitle')}
            </h3>
            <p className="text-text-light mb-2">
              <i className="fas fa-envelope text-[#22A64A] w-6"></i> {contactMail}
            </p>
            <p className="text-text-light mb-2">
              <i className="fas fa-phone text-[#22A64A] w-6"></i> {contactPhone}
            </p>
            <p className="text-text-light mb-2">
              <i className="fas fa-map-marker-alt text-[#22A64A] w-6"></i> {contactAddress}
            </p>
            <p className="text-text-light mt-6 text-sm">{t('contact.partnershipText')}</p>
            <SocialLinks className="mt-4" />
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder={t('contact.placeholders.name')}
              required
              autocomplete="name"
            />
            <FormInput
              name="email"
              type="email"
              autocomplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('contact.placeholders.email')}
              required
            />
            <FormInput
              name="assunto"
              autocomplete="subject"
              value={form.assunto}
              onChange={handleChange}
              placeholder={t('contact.placeholders.subject')}
            />
            <FormTextarea
              name="msg"
              value={form.msg}
              onChange={handleChange}
              placeholder={t('contact.placeholders.message')}
              required
            />
            {status && (
              <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-[#22A64A]'}`}>
                {t(status.key)}
              </p>
            )}
            <button
              type="submit"
              className="px-8 py-[0.85rem] bg-[#22A64A] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-[0.35s] ease-out hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(255,109,0,0.3)] active:translate-y-0"
            >
              {t('contact.submit')}
            </button>
          </form>
        </FadeUp>
      </div>
    </Section>
  );
}
