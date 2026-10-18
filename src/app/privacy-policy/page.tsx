import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '@/app/components/LegalPageLayout';
import { pageMetadata } from '@/app/config/site';
import { CONTACT, emailHref } from '@/app/config/contact';
import { COMPANY } from '@/app/config/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy | Ramp Recover',
  description: 'How Ramp Recover collects, uses, and protects personal data submitted for scam recovery support.',
  path: '/privacy-policy',
});

const linkClass = 'font-medium text-primary-700 hover:text-primary-800';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      path="/privacy-policy"
      updatedOn="October 17, 2026"
      intro="This policy explains how Ramp Recover handles personal information when you use our website, submit a case, or contact us by email, WhatsApp, or live chat."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. Who We Are</h2>
        <p className="mt-2">
          Ramp Recover is operated by {COMPANY.legalName}, {COMPANY.address} (&quot;we&quot;, &quot;us&quot;). We are
          responsible for the personal information described in this policy. You can reach us at{' '}
          <a href={emailHref} className={linkClass}>{CONTACT.email}</a>.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. Information We Collect</h2>
        <p className="mt-2">Information you give us:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            details from the case intake form, including your name, email, phone or WhatsApp number, country, contact
            preferences, the type of scam, amount lost, dates, payment methods, institutions involved, and your description of
            what happened;
          </li>
          <li>evidence files you choose to upload, such as screenshots, receipts, or statements;</li>
          <li>anything you send us by email, WhatsApp, or live chat.</li>
        </ul>
        <p className="mt-2">Information collected automatically:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            your IP address, used briefly when you submit the form to block repeated or automated submissions (it is not
            stored with your case);
          </li>
          <li>
            standard technical logs kept by our hosting providers, such as IP address, browser type, and pages requested, for
            security and troubleshooting;
          </li>
          <li>cookies set by our live chat service when you use it (see section 11).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. How We Use Information</h2>
        <p className="mt-2">We use your information to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>review and triage potential scam recovery cases,</li>
          <li>contact you for follow-up and evidence requests,</li>
          <li>prepare recovery documentation and escalation records,</li>
          <li>keep our website and services secure and prevent spam and abuse,</li>
          <li>meet our legal obligations,</li>
          <li>improve service quality and response workflows.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. Legal Bases (UK and EU Visitors)</h2>
        <p className="mt-2">Where UK or EU data protection law applies, we rely on:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>your consent, which you give when you submit the intake form and can withdraw at any time;</li>
          <li>taking steps at your request to review your case and provide our services;</li>
          <li>our legitimate interests in keeping our services secure and handling cases effectively;</li>
          <li>compliance with our legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. Who We Share Information With</h2>
        <p className="mt-2">
          We do not sell or rent your personal information. We may share relevant case information with financial
          institutions, legal professionals, regulators, or law-enforcement channels only when necessary for case handling or
          when required by law.
        </p>
        <p className="mt-2">
          We also use trusted service providers that process information only on our behalf to run our services:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Supabase, for secure database and file storage;</li>
          <li>Resend, for sending emails;</li>
          <li>our website and server hosting providers;</li>
          <li>Smartsupp, for live chat.</li>
        </ul>
        <p className="mt-2">
          If you message us on WhatsApp, WhatsApp (Meta) also processes your messages under its own privacy policy.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">6. International Transfers</h2>
        <p className="mt-2">
          We are based in the United States, and our service providers may process information in the United States and
          other countries. If you are outside the United States, your information will be transferred there. Where the law
          requires it, we rely on appropriate safeguards for these transfers, such as standard contractual clauses.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">7. How Long We Keep Information</h2>
        <p className="mt-2">
          We keep case records and evidence files for {COMPANY.retention} after your case is closed, unless the law requires
          us to keep them longer or we need them for a legal claim. After that, we delete them.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">8. How We Protect Information</h2>
        <p className="mt-2">
          Information you send through our website travels over encrypted connections. Case records and evidence files are kept
          in private storage that is not publicly accessible, and links to evidence files expire. Access is limited to people
          who need it to handle your case. No method of storage or transmission is completely secure, but we work to protect
          your information from unauthorized access.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">9. Your Rights</h2>
        <p className="mt-2">Depending on where you live, you may have the right to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>access the personal information we hold about you,</li>
          <li>correct information that is inaccurate,</li>
          <li>ask us to delete your information,</li>
          <li>restrict or object to how we use it,</li>
          <li>receive a copy of it in a portable format,</li>
          <li>withdraw your consent at any time (this does not affect anything we did before you withdrew it).</li>
        </ul>
        <p className="mt-2">
          To make a request, email{' '}
          <a href={emailHref} className={linkClass}>{CONTACT.email}</a> with
          &quot;Privacy request&quot; in the subject line. We may need to confirm your identity, and we aim to respond within
          30 days. You can also complain to your local data protection authority.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">10. Children</h2>
        <p className="mt-2">
          Our services are intended for adults. We do not knowingly collect information from anyone under 18. If a minor has
          been affected by a scam, a parent or guardian should contact us on their behalf.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">11. Cookies</h2>
        <p className="mt-2">
          Our website does not use advertising or analytics cookies. Our live chat service, Smartsupp, sets cookies needed to
          run the chat and remember your conversation.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">12. Changes to This Policy</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Material changes will be reflected by updating the
          &quot;Last updated&quot; date on this page.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">13. Contact Us</h2>
        <p className="mt-2">
          {COMPANY.legalName}, {COMPANY.address}
          <br />
          Email: <a href={emailHref} className={linkClass}>{CONTACT.email}</a>
          <br />
          Phone: {CONTACT.phone}
        </p>
        <p className="mt-2">
          See also our <Link href="/terms-of-service" className={linkClass}>Terms of Service</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
