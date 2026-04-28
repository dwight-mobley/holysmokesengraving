import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-black text-white text-center w-full min-h-screen flex items-center justify-center"
      >
        <Image
          src={
            'https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_i1qpcw.webp'
          }
          alt=""
          fill
          sizes='100%'
          priority
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-surface-900/70"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-4xl bg-surface-900/60 rounded-lg px-8 py-16 backdrop-blur-sm">
          <h1 className="text-5xl font-bold mb-4 text-accent-400">
            Holy Smokes Engraving
          </h1>
          <p className="text-2xl font-light mb-6 text-surface-100">
            Faith in Every Detail
          </p>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-surface-200">
            Veteran-Owned &amp; Operated. Custom laser engraving crafted with
            precision, purpose, and pride.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 hover:scale-105 transition-all"
          >
            Shop Custom Pieces
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section aria-label="Our mission" className="py-20 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-surface-900">
                Timeless pieces, crafted to inspire and connect.
              </h2>
              <p className="text-lg text-surface-600 mb-4">
                Every piece that leaves our studio is made with intention —
                blending precision craftsmanship with faith-driven purpose. We
                take pride in making something that means something.
              </p>
              <p className="text-surface-600 mb-6">
                Whether it&apos;s a gift, a keepsake, or a custom order, we pour
                care into every line we engrave.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-surface-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-surface-800 transition-colors"
              >
                Explore Collections
              </Link>
            </div>

            <div className="relative overflow-hidden flex flex-col justify-center items-center p-5 rounded-lg text-white text-center h-80 border-4 border-accent-400">
              <Image
                src={
                  'https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_2_xqimug.webp'
                }
                alt=""
                fill
                sizes='100%'
                className="object-cover object-center "
              />
              <div className="flex flex-col justify-center items-center bg-surface-900/60 p-4 rounded-lg border-2 border-accent-400 backdrop-blur-sm gap-1">
                <p className="text-2xl font-bold text-accent-400">
                  Crafted with Faith
                </p>
                <p className="text-2xl font-bold text-accent-400">
                  Meaningful Personal Pieces
                </p>
                <p className="text-2xl font-bold text-accent-400">
                  Every piece tells a story
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section aria-label="Featured collections" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold mb-2 text-surface-900">
            Featured Collections
          </h2>
          <p className="text-center text-surface-600 mb-12">
            Shop by Collection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* TODO: Replace with real collection data */}
            <Link href="/" className="no-underline">
              <div className="rounded-lg h-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white">
                <div className="p-8 text-center">
                  <Image
                    src="/logo.png"
                    alt="Collection Name"
                    width={40}
                    height={40}
                    className="max-h-40 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-bold text-surface-900">
                    Collection Name
                  </h3>
                  <p className="text-surface-600 text-sm">
                    Short description goes here...
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-linear-to-br from-surface-700 to-surface-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-accent-400">
            Experience Precision Engraving
          </h2>
          <p className="text-lg mb-8 text-surface-200">
            Upload your own designs or choose from our curated collections to
            create something truly special.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 hover:scale-105 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
