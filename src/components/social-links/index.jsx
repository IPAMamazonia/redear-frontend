const LINKS = [
  { icon: 'fab fa-instagram', href: '#' },
  { icon: 'fab fa-twitter', href: '#' },
  { icon: 'fab fa-linkedin', href: '#' },
  { icon: 'fab fa-github', href: '#' },
];

/**
 * Bloco de links para redes sociais (Instagram, Twitter, LinkedIn, GitHub).
 *
 * @param {string} [props.className] - Classes adicionais para o container.
 */
export function SocialLinks({ className = '' }) {
  return (
    <div className={`SocialLinksComponent flex gap-4 ${className}`}>
      {LINKS.map((link) => (
        <a
          key={link.icon}
          href={link.href}
          className="text-text-light text-2xl hover:text-[#FF6D00] transition-colors"
          aria-label={link.icon.replace('fab fa-', '')}
        >
          <i className={link.icon} />
        </a>
      ))}
    </div>
  );
}
