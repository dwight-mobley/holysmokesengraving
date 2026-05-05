import { ContactForm } from '@/components/ContactForm';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Holy Smokes Engraving',
  description:
    'Veteran-owned and operated custom laser engraving studio. Learn the story behind Holy Smokes Engraving.',
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white text-center min-h-[50vh] flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_i1qpcw.webp"
          alt=""
          fill
          sizes="100%"
          priority
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-surface-900/70"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl px-8 py-16">
          <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Veteran Owned &amp; Operated
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">Our Story</h1>
          <p className="text-xl text-surface-200 font-light">
            Faith in every detail. Purpose in every piece.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-surface-900 mb-6">
              Built from Service. Crafted with Purpose.
            </h2>
            <p className="text-surface-600 text-lg mb-4">
              Holy Smokes Engraving was born from a simple belief — that the
              things we hold onto should mean something. As a veteran, I learned
              firsthand the value of precision, dedication, and doing the job
              right the first time. That same standard carries into every piece
              I create.
            </p>
            <p className="text-surface-600 mb-4">
              What started as a passion for craftsmanship has grown into a full
              custom engraving studio. From personalized gifts to faith-inspired
              artwork, every order gets the same care and attention — whether
              it&apos;s one piece or one hundred.
            </p>
            <p className="text-surface-600">
              When you order from Holy Smokes Engraving, you&apos;re not buying
              from a warehouse. You&apos;re getting something handcrafted by
              someone who takes pride in the work.
            </p>
          </div>

          <div className="relative h-80 rounded-lg overflow-hidden border-4 border-accent-400 shadow-lg">
            <Image
              src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_2_xqimug.webp"
              alt="Holy Smokes Engraving workshop"
              fill
              sizes="100%"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-surface-900 mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Veteran Owned',
                description:
                  'Founded and operated by a US veteran. The discipline and pride of military service is woven into everything we do.',
              },
              {
                title: 'Custom Craftsmanship',
                description:
                  'No two pieces are exactly alike. We work with you to create something personal — a gift, a keepsake, or a statement piece.',
              },
              {
                title: 'Faith-Driven',
                description:
                  'Many of our pieces are inspired by faith. We believe the things you carry and display should reflect what matters most to you.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-surface-50 border border-surface-200 rounded-lg p-8 text-center space-y-3"
              >
                <h3 className="text-lg font-bold text-brand-800">
                  {value.title}
                </h3>
                <p className="text-surface-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Make */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-surface-900 mb-6">
            What We Create
          </h2>
          <p className="text-surface-600 text-lg mb-10">
            Every item is laser engraved with precision on quality materials. We
            specialize in custom work — if you can imagine it, we can engrave
            it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
            {[
              'Custom Gifts',
              'Faith Art',
              'Wedding Pieces',
              'Memorial Items',
              'Home Décor',
              'Personalized Awards',
              'Military Tributes',
              'Business Signage',
            ].map((item) => (
              <div
                key={item}
                className="bg-white border border-surface-200 rounded-lg px-4 py-3 text-brand-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
         <section className="py-20 bg-white" id="contact">
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-brand-800 mb-2">
                  Get in Touch
                </h2>
                <p className="text-surface-500 text-sm mb-8">
                  Have a question or just want to say hi? Send us a message.
                </p>
                <ContactForm />
              </div>
            </section>

      {/* CTA */}
      <section className="py-20 bg-surface-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold text-accent-400">
            Ready to create something meaningful?
          </h2>
          <p className="text-surface-300 text-lg">
            Browse the shop or reach out — we&apos;re happy to work with you on
            a custom order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/shop"
              className="inline-block bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
