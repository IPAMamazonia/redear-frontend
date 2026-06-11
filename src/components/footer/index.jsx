import { GradientText } from '@/components';

function FooterLink({ href, children }) {
  const handleClick = (e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="block text-white/60 no-underline mb-2 text-sm transition-colors duration-[0.35s] hover:text-[#FF9100]"
    >
      {children}
    </a>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="text-base mb-4">
        <GradientText>{title}</GradientText>
      </h4>
      {children}
    </div>
  );
}

/**
 * Rodapé com links de navegação, redes sociais e copyright.
 */
export function Footer() {
  return (
    <footer className="FooterComponent bg-bg-dark text-white px-[5%] pt-16 pb-6 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E676] to-[#FF6D00]" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 max-w-[1100px] mx-auto mb-10">
        <FooterColumn title="RedeAr">
          <FooterLink href="#sobre">Sobre</FooterLink>
          <FooterLink href="#grafico">Gráfico</FooterLink>
          <FooterLink href="#mapa">Mapa</FooterLink>
          <FooterLink href="#faq">FAQ</FooterLink>
        </FooterColumn>

        <FooterColumn title="Contato">
          <FooterLink href="#contato">Fale Conosco</FooterLink>
          <FooterLink href="#parceiros">Parceiros</FooterLink>
          <FooterLink href="mailto:contato@redear.org">contato@redear.org</FooterLink>
        </FooterColumn>

        <FooterColumn title="Links">
          <FooterLink href="#">Política de Privacidade</FooterLink>
          <FooterLink href="#">Termos de Uso</FooterLink>
          <FooterLink href="#">API de Dados</FooterLink>
        </FooterColumn>

        <FooterColumn title="Redes Sociais">
          <FooterLink href="#">
            <i className="fab fa-instagram"></i> Instagram
          </FooterLink>
          <FooterLink href="#">
            <i className="fab fa-twitter"></i> Twitter
          </FooterLink>
          <FooterLink href="#">
            <i className="fab fa-linkedin"></i> LinkedIn
          </FooterLink>
          <FooterLink href="#">
            <i className="fab fa-github"></i> GitHub
          </FooterLink>
        </FooterColumn>
      </div>

      <div className="text-center pt-6 border-t border-white/10 text-sm text-white/35">
        &copy; 2026 RedeAr. Todos os direitos reservados. Desenvolvido com{' '}
        <i className="fas fa-heart text-[#FF0000]"></i> pela equipe RedeAr.
      </div>
    </footer>
  );
}
