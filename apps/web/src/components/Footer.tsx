import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/custom-order', label: 'Custom Orders' },
  { href: '/about', label: 'About' },
];

export const Footer = () => {
  return (
    <footer className="bg-surface-950 text-surface-300 font-body border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="space-y-4">
            <p className="text-white font-bold text-lg tracking-tight">
              Holy Smokes Engraving
            </p>
            <p className="text-sm leading-relaxed text-surface-400 max-w-xs">
              Veteran-owned custom laser engraving. Faith-inspired pieces
              crafted with precision, purpose, and pride.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-400 mb-4">
              Explore
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-400 mb-4">
              Get Started
            </p>
            <p className="text-sm text-surface-400 mb-4 leading-relaxed">
              Ready for a custom piece? Browse the shop or send us your vision.
            </p>
            <Link
              href="/custom-order"
              className="inline-flex items-center text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
            >
              Request a custom order →
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-surface-800 text-xs text-surface-500">
          <p>
            © {new Date().getFullYear()} Holy Smokes Engraving. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-surface-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-surface-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
