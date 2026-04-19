import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-heading text-brand-400">Product Not Found</h1>
      <p className="text-surface-400">{"That product doesn't exist or may have been removed."}</p>
      <Link href="/shop" className="bg-accent-500 text-white px-4 py-2 rounded-md">
        Back to Shop
      </Link>
    </div>
  );
}