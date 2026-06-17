import type { Metadata } from 'next';
import { CustomOrderForm } from '@/components/forms/CustomOrderForm';

export const metadata: Metadata = {
  title: 'Custom Order | Holy Smokes Engraving',
  description: 'Request a custom laser engraved piece from Holy Smokes Engraving.',
};

const STEPS = [
  { step: '1', title: 'Submit Your Request', description: 'Tell us what you want — material, design, quantity, and any reference images.' },
  { step: '2', title: 'Receive Your Quote', description: "We'll review your request and reply within 1–2 business days with pricing and any questions." },
  { step: '3', title: 'Approve & Pay', description: "Once you approve the quote, we'll send a secure payment link and get to work." },
];

export default function CustomOrderPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-surface-900 text-white py-20 text-center px-4">
        <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Made for You
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">Custom Orders</h1>
        <p className="text-surface-300 text-lg max-w-xl mx-auto">
          Have something specific in mind? Tell us what you want and we&apos;ll
          bring it to life with precision laser engraving.
        </p>
      </section>

      {/* Process */}
      <section className="py-16 bg-surface-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-surface-900 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="bg-white border border-surface-200 rounded-lg p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-accent-600 text-white font-bold text-lg flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-semibold text-brand-800">{title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-800 mb-2">Submit a Request</h2>
          <p className="text-surface-500 text-sm mb-8">
            No payment required at this stage — we&apos;ll quote you first.
          </p>
          <CustomOrderForm />
        </div>
      </section>

    </div>
  );
}