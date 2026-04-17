import Link from "next/link";

export const Footer =()=> {
  return (
    <footer className="bg-surface-900 text-surface-200 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-brand-300 font-heading text-xl font-bold tracking-tight">
              Holy Smokes Engraving
            </h3>
            <p className="text-surface-400 mt-2 max-w-sm text-sm">
              Custom laser engraving, handcrafted pieces, and faith‑inspired artwork made in Georgia.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="text-surface-300 font-semibold text-sm mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/shop" className="hover:text-brand-300">Shop</Link></li>
                <li><Link href="/gallery" className="hover:text-brand-300">Gallery</Link></li>
                <li><Link href="/custom" className="hover:text-brand-300">Custom Orders</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-surface-300 font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-brand-300">About</Link></li>
                <li><Link href="/contact" className="hover:text-brand-300">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-700 mt-10 pt-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-surface-500">
          <p>© {new Date().getFullYear()} Holy Smokes Engraving. All rights reserved.</p>

          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-brand-300">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
