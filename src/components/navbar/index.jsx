import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu, closeMobileMenu, setScrolled } from '@/store/slices/uiSlice';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#grafico', label: 'Gráfico' },
  { href: '#mapa', label: 'Mapa' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contato', label: 'Fale Conosco' },
  { href: '#parceiros', label: 'Parceiros' },
];

export function Navbar() {
  const { mobileMenuOpen, scrolled } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    const onScroll = () => dispatch(setScrolled(window.scrollY > 50));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  const handleNav = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    dispatch(closeMobileMenu());
  };

  return (
    <nav
      className={`NavbarComponent fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[5%]
        transition-all duration-[0.35s] ease-out
        ${scrolled ? 'bg-white/85 shadow-[0_1px_30px_rgba(0,0,0,0.08)]' : 'bg-white/70'}
        backdrop-blur-xl backdrop-saturate-150 border-b border-white/25`}
    >
      <a
        href="#hero"
        onClick={(e) => handleNav(e, '#hero')}
        className="text-2xl font-black tracking-tighter no-underline"
        style={{
          background: 'linear-gradient(135deg, #00E676, #FF6D00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        RedeAr
      </a>

      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-[5px]"
        onClick={() => dispatch(toggleMobileMenu())}
        aria-label="Menu"
      >
        <span
          className={`block w-[26px] h-[2.5px] bg-[#1a2e3c] rounded transition-all duration-[0.35s] ease-out ${
            mobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''
          }`}
        />
        <span
          className={`block w-[26px] h-[2.5px] bg-[#1a2e3c] rounded transition-all duration-[0.35s] ease-out ${
            mobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-[26px] h-[2.5px] bg-[#1a2e3c] rounded transition-all duration-[0.35s] ease-out ${
            mobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
          }`}
        />
      </button>

      <ul
        className={`list-none flex items-center gap-8 m-0
          ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}
          ${
            mobileMenuOpen
              ? 'fixed top-[72px] right-0 w-[280px] h-[calc(100vh-72px)] flex-col bg-white/92 backdrop-blur-xl p-8 shadow-[-8px_0_40px_rgba(0,0,0,0.08)] items-start gap-5'
              : ''
          }`}
      >
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              onClick={(e) => handleNav(e, href)}
              className="no-underline text-[#1a2e3c] text-sm font-medium transition-colors duration-[0.35s] ease-out relative py-1
                after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2.5px]
                after:bg-gradient-to-r after:from-[#00E676] after:to-[#FF6D00] after:rounded after:transition-all after:duration-[0.35s]
                hover:text-[#FF6D00] hover:after:w-full"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
