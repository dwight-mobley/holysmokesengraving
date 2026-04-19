import Link from "next/link";

export const Footer =()=> {
  return (
    <footer className="bg-surface-900 text-surface-200 font-body">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
