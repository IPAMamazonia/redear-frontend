import { useState, useRef, useEffect } from 'react';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-[50px] scale-[0.97] transition-all duration-[0.7s] ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:scale-100"
    >
      {children}
    </div>
  );
}

export default function Contato() {
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
    <section id="contato" className="px-[5%] py-[100px] max-[480px]:py-[60px] max-[480px]:px-[4%]">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-[#1a2e3c] tracking-tight">
        <span className="bg-gradient-to-r from-[#00E676] to-[#FF6D00] bg-clip-text text-transparent">Fale</span> Conosco
      </h2>
      <p className="text-center text-[#5a6d7a] mb-[3.5rem] text-lg max-w-[600px] mx-auto">
        Tem dúvidas, sugestões ou quer ser parceiro? Entre em contato!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1100px] mx-auto">
        <FadeUp>
          <div>
            <h3 className="mb-4 text-lg">
              <i className="fas fa-comments text-[#FF6D00] mr-2"></i> Informações de Contato
            </h3>
            <p className="text-[#5a6d7a] mb-2">
              <i className="fas fa-envelope text-[#FF6D00] w-6"></i> contato@redear.org
            </p>
            <p className="text-[#5a6d7a] mb-2">
              <i className="fas fa-phone text-[#FF6D00] w-6"></i> +55 (92) 99999-8888
            </p>
            <p className="text-[#5a6d7a] mb-2">
              <i className="fas fa-map-marker-alt text-[#FF6D00] w-6"></i> Manaus, Amazonas, Brasil
            </p>
            <p className="text-[#5a6d7a] mt-6 text-sm">
              Estamos abertos a parcerias com instituições de pesquisa, órgãos governamentais e organizações da
              sociedade civil comprometidas com a preservação ambiental.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-[#5a6d7a] text-2xl hover:text-[#FF6D00] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#5a6d7a] text-2xl hover:text-[#FF6D00] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-[#5a6d7a] text-2xl hover:text-[#FF6D00] transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-[#5a6d7a] text-2xl hover:text-[#FF6D00] transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
              className="px-5 py-3 border border-black/10 rounded-[10px] text-sm font-[family-name:var(--font)] bg-white/60 backdrop-blur focus:outline-none focus:border-[#FF6D00] focus:shadow-[0_0_0_3px_rgba(255,109,0,0.12)] transition-all"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              required
              className="px-5 py-3 border border-black/10 rounded-[10px] text-sm font-[family-name:var(--font)] bg-white/60 backdrop-blur focus:outline-none focus:border-[#FF6D00] focus:shadow-[0_0_0_3px_rgba(255,109,0,0.12)] transition-all"
            />
            <input
              name="assunto"
              value={form.assunto}
              onChange={handleChange}
              placeholder="Assunto"
              className="px-5 py-3 border border-black/10 rounded-[10px] text-sm font-[family-name:var(--font)] bg-white/60 backdrop-blur focus:outline-none focus:border-[#FF6D00] focus:shadow-[0_0_0_3px_rgba(255,109,0,0.12)] transition-all"
            />
            <textarea
              name="msg"
              value={form.msg}
              onChange={handleChange}
              placeholder="Sua mensagem"
              required
              className="px-5 py-3 border border-black/10 rounded-[10px] text-sm font-[family-name:var(--font)] bg-white/60 backdrop-blur min-h-[120px] resize-y focus:outline-none focus:border-[#FF6D00] focus:shadow-[0_0_0_3px_rgba(255,109,0,0.12)] transition-all"
            />
            {status && (
              <p className={`text-sm ${status.includes('sucesso') ? 'text-green-600' : 'text-[#FF6D00]'}`}>{status}</p>
            )}
            <button
              type="submit"
              className="px-8 py-[0.85rem] bg-[#FF6D00] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-[0.35s] ease-out hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(255,109,0,0.3)] active:translate-y-0"
            >
              Enviar Mensagem
            </button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
