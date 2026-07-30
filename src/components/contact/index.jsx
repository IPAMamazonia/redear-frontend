import { Section, SectionHeading, FadeUp, FormInput, FormTextarea, SocialLinks, GradientText } from '@/components';
import { useState } from 'react';

/**
 * Seção de contato com formulário e informações de contato.
 */
export function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', msg: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, email, msg } = form;
    if (!nome.trim() || !email.trim() || !msg.trim()) {
      setStatus('Por favor, preencha todos os campos.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setStatus('Por favor, insira um e-mail válido.');
      return;
    }
    setStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setForm({ nome: '', email: '', assunto: '', msg: '' });
  };

  return (
    <Section id="contato" className="ContactComponent">
      <SectionHeading subtitle="Tem dúvidas, sugestões ou quer ser parceiro? Entre em contato!">
        <GradientText>Fale</GradientText> Conosco
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1100px] mx-auto">
        <FadeUp>
          <div>
            <h3 className="mb-4 text-lg">
              <i className="fas fa-comments text-[#22A64A] mr-2"></i> Informações de Contato
            </h3>
            <p className="text-text-light mb-2">
              <i className="fas fa-envelope text-[#22A64A] w-6"></i> contato@redear.org
            </p>
            <p className="text-text-light mb-2">
              <i className="fas fa-phone text-[#22A64A] w-6"></i> +55 (92) 99999-8888
            </p>
            <p className="text-text-light mb-2">
              <i className="fas fa-map-marker-alt text-[#22A64A] w-6"></i> Manaus, Amazonas, Brasil
            </p>
            <p className="text-text-light mt-6 text-sm">
              Estamos abertos a parcerias com instituições de pesquisa, órgãos governamentais e organizações da
              sociedade civil comprometidas com a preservação ambiental.
            </p>
            <SocialLinks className="mt-4" />
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" required />
            <FormInput
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              required
            />
            <FormInput name="assunto" value={form.assunto} onChange={handleChange} placeholder="Assunto" />
            <FormTextarea name="msg" value={form.msg} onChange={handleChange} placeholder="Sua mensagem" required />
            {status && (
              <p className={`text-sm ${status.includes('sucesso') ? 'text-green-600' : 'text-[#22A64A]'}`}>{status}</p>
            )}
            <button
              type="submit"
              className="px-8 py-[0.85rem] bg-[#22A64A] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-[0.35s] ease-out hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(255,109,0,0.3)] active:translate-y-0"
            >
              Enviar Mensagem
            </button>
          </form>
        </FadeUp>
      </div>
    </Section>
  );
}
