import { toggleMobileMenu, closeMobileMenu, setScrolled } from '@/store/slices/uiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { SegmentedControl } from '@/components';
import { useTranslation } from '@/i18n';
import { useEffect } from 'react';
import logo from '@/assets/png/Logo RedeAR - IPAM vetores-01.png';

/**
 * Barra de navegação fixa no topo com menu mobile, links de âncora,
 * seletor de idioma e efeito de scroll.
 *
 * Estados globais usados: ui.mobileMenuOpen, ui.scrolled, ui.language.
 */
export function Navbar() {
  const { mobileMenuOpen, scrolled } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const { language, t, setLanguage } = useTranslation();

  const LINKS = [
    { href: '#sobre', label: t('nav.about') },
    { href: '#mapa', label: t('nav.map') },
    { href: '#grafico', label: t('nav.chart') },
    { href: '#faq', label: t('nav.faq') },
    { href: '#contato', label: t('nav.contact') },
    { href: '#parceiros', label: t('nav.partners') },
  ];

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
      className={`NavbarComponent fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[5%] transition-all duration-[0.35s] ease-out
        ${scrolled ? 'bg-white/85 shadow-[0_1px_30px_rgba(0,0,0,0.08)]' : 'bg-white/70'}
        backdrop-blur-xl backdrop-saturate-150 border-b border-white/25`}
    >
      <a
        href="#hero"
        onClick={(e) => handleNav(e, '#hero')}
        className="text-2xl font-black tracking-tighter no-underline"
      >
        <img src={logo} alt="Logo RedeAR" className="w-[200px]" />
      </a>

      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-[5px]"
        onClick={() => dispatch(toggleMobileMenu())}
        aria-label={t('nav.menu')}
      >
        <span
          className={`block w-[26px] h-[2.5px] bg-text-dark rounded transition-all duration-[0.35s] ease-out ${
            mobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''
          }`}
        />
        <span
          className={`block w-[26px] h-[2.5px] bg-text-dark rounded transition-all duration-[0.35s] ease-out ${
            mobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-[26px] h-[2.5px] bg-text-dark rounded transition-all duration-[0.35s] ease-out ${
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
              className="no-underline text-text-dark text-sm font-medium transition-colors duration-[0.35s] ease-out relative py-1
                after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2.5px]
                after:bg-gradient-to-r after:from-[#00E676] after:to-[#FF6D00] after:rounded after:transition-all after:duration-[0.35s]
                hover:text-[#FF6D00] hover:after:w-full"
            >
              {label}
            </a>
          </li>
        ))}

        <li className="mt-auto pt-6 w-full md:mt-0 md:pt-0 md:w-auto list-none">
          <div role="group" aria-label={t('common.language')}>
            <SegmentedControl
              options={[
                { value: 'pt', label: 'PT' },
                { value: 'en', label: 'EN' },
              ]}
              value={language}
              onChange={setLanguage}
              className="shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            />
          </div>
        </li>
      </ul>
    </nav>
  );
}
