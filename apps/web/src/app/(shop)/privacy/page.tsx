import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Holy Smokes Engraving',
  description: 'Privacy policy for Holy Smokes Engraving.',
};

const LAST_UPDATED = 'May 5, 2026';
const CONTACT_EMAIL = 'dwight@holysmokesengraving.com';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-surface-800">
      <h1 className="text-3xl font-bold text-brand-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-surface-500 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">1. Overview</h2>
          <p>
            Holy Smokes Engraving (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
            is committed to protecting your personal information. This Privacy Policy explains
            what data we collect, how we use it, and your rights regarding that data when you
            use our website or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">2. Information We Collect</h2>
          <p className="mb-3">We collect the following categories of information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account information:</strong> Name and email address when you register
              for an account.
            </li>
            <li>
              <strong>Order information:</strong> Name, email address, and shipping address
              when you place an order.
            </li>
            <li>
              <strong>Payment information:</strong> Payment is processed by Stripe. We never
              see or store your full card number, CVV, or bank details. Stripe may collect
              and store payment data subject to their own{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:underline"
              >
                Privacy Policy
              </a>.
            </li>
            <li>
              <strong>Usage data:</strong> We may collect anonymized analytics such as pages
              visited and actions taken to improve the site experience. No personally
              identifiable information is included in this data.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">3. How We Use Your Information</h2>
          <p className="mb-3">We use your information solely to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmation and shipping notification emails</li>
            <li>Maintain your account and order history</li>
            <li>Respond to your questions or support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal information with third parties for
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">4. Cookies &amp; Session Data</h2>
          <p>
            We use a single authentication cookie (<code className="bg-surface-100 px-1 rounded">auth-token</code>)
            to keep you signed in to your account. This cookie is HTTP-only, meaning it cannot
            be accessed by JavaScript, and expires after 7 days. We do not use third-party
            tracking cookies or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">5. Third-Party Services</h2>
          <p className="mb-3">
            We use the following third-party services that may process your data as part of
            delivering our service:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Stripe</strong> — payment processing.{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:underline"
              >
                Stripe Privacy Policy
              </a>
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery (order confirmations,
              shipping notifications).{' '}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:underline"
              >
                Resend Privacy Policy
              </a>
            </li>
            <li>
              <strong>Cloudinary</strong> — product image hosting. Images uploaded to our
              store are stored on Cloudinary servers.{' '}
              <a
                href="https://cloudinary.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:underline"
              >
                Cloudinary Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">6. Data Retention</h2>
          <p>
            We retain your order data for as long as necessary to fulfill legal, accounting,
            and business obligations — typically a minimum of 7 years in accordance with US
            tax law. If you delete your account, your personal profile information will be
            removed, but order records will be retained in anonymized form.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">7. Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your personal
            information, including HTTPS encryption, HTTP-only authentication tokens, and
            hashed passwords. No method of transmission over the internet is 100% secure, and
            we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">8. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of any future marketing communications</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-600 hover:underline">
              {CONTACT_EMAIL}
            </a>. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">9. Children&apos;s Privacy</h2>
          <p>
            Our site is not directed at children under the age of 13. We do not knowingly
            collect personal information from children. If you believe a child has provided
            us with personal information, please contact us and we will promptly delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page with an updated date. Continued use of the site after changes are
            posted constitutes your acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-700 mb-2">11. Contact</h2>
          <p>
            Questions about this policy? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-600 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}