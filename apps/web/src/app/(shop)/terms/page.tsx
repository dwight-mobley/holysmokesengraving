import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Holy Smokes Engraving',
  description: 'Terms and conditions for Holy Smokes Engraving.',
};

const LAST_UPDATED = 'May 5, 2026';
const CONTACT_EMAIL = 'dwight@holysmokesengraving.com';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-surface-800">
      <h1 className="text-3xl font-bold text-brand-800 mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-surface-500 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">1. Overview</h2>
          <p>
            These Terms and Conditions govern your use of the Holy Smokes Engraving website and
            the purchase of products from our store. By placing an order or using this site, you
            agree to be bound by these terms. If you do not agree, please do not use this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">2. Products</h2>
          <p>
            Holy Smokes Engraving specializes in custom laser-engraved products. Because many
            items are made to order and personalized to your specifications, product images are
            representative and final results may vary slightly based on material and design
            complexity. We reserve the right to discontinue or modify products at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">3. Orders &amp; Payment</h2>
          <p>
            All orders are subject to acceptance and availability. Prices are listed in US dollars
            and are subject to change without notice. Payment is processed securely through Stripe.
            We do not store your payment card details. An order confirmation email will be sent
            once your payment is successfully processed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">4. Custom &amp; Personalized Items</h2>
          <p>
            Custom and personalized orders are made specifically for you. By submitting a custom
            order, you represent that you have the right to use any text, images, or designs
            provided and that they do not infringe on any third-party intellectual property rights.
            Holy Smokes Engraving reserves the right to refuse any order that contains offensive,
            defamatory, or infringing content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">5. Shipping</h2>
          <p>
            Shipping times are estimates and are not guaranteed. Holy Smokes Engraving is not
            responsible for delays caused by carriers, customs, or circumstances beyond our
            control. Risk of loss and title for products pass to you upon delivery to the carrier.
            Shipping costs are calculated at checkout and are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">6. Returns &amp; Refunds</h2>
          <p className="mb-2">
            Due to the custom nature of our products, <strong>all sales on personalized and
            made-to-order items are final</strong>. We do not accept returns or exchanges on
            custom engraved products unless the item arrives damaged or defective.
          </p>
          <p>
            If your order arrives damaged, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-600 hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            within 7 days of delivery with a description and photos of the damage. We will work
            with you to provide a replacement or refund at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">7. Intellectual Property</h2>
          <p>
            All content on this site — including logos, graphics, text, and product photography —
            is the property of Holy Smokes Engraving and may not be reproduced, distributed, or
            used without express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">8. User Accounts</h2>
          <p>
            If you create an account, you are responsible for maintaining the confidentiality of
            your login credentials and for all activity that occurs under your account. Please
            notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Holy Smokes Engraving shall not be liable for
            any indirect, incidental, special, or consequential damages arising from your use of
            this site or the purchase of our products. Our total liability for any claim related
            to a product shall not exceed the purchase price of that product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Georgia, without regard to its
            conflict of law provisions. Any disputes shall be resolved in the courts located in
            Georgia.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">11. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms and Conditions at any time. Changes will
            be posted on this page with an updated date. Continued use of the site after changes
            are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">12. Contact</h2>
          <p>
            Questions about these terms? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-600 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}