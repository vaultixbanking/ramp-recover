import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '@/app/components/LegalPageLayout';
import { pageMetadata } from '@/app/config/site';
import { CONTACT, emailHref } from '@/app/config/contact';
import { COMPANY } from '@/app/config/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service | Ramp Recover',
  description: 'Terms governing use of Ramp Recover website and scam recovery support services.',
  path: '/terms-of-service',
});

const linkClass = 'font-medium text-primary-700 hover:text-primary-800';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      path="/terms-of-service"
      updatedOn="October 17, 2026"
      intro="By accessing this website and using our case intake process, you agree to the following terms and conditions."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. About Us</h2>
        <p className="mt-2">
          Ramp Recover is operated by {COMPANY.legalName}, {COMPANY.address} (&quot;we&quot;, &quot;us&quot;). These terms
          apply to your use of this website and our scam recovery support services.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. What We Do and Don&apos;t Do</h2>
        <p className="mt-2">
          Ramp Recover provides scam recovery support, case analysis, evidence organization, and escalation guidance.
        </p>
        <p className="mt-2">
          We are not a law firm, a law-enforcement agency, or a government body, and we are not affiliated with any bank,
          exchange, or regulator. Where your case needs legal representation, we may recommend that you consult a licensed
          legal professional.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. Fees and Payments</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your initial case review is free and does not commit you to anything.</li>
          <li>
            If your case needs paid services, we will send you a written quote describing the work and the fees. No paid work
            starts until you have agreed to it in writing.
          </li>
          <li>We never ask for payment in cryptocurrency or gift cards.</li>
          <li>
            We never charge &quot;release&quot;, &quot;tax&quot;, &quot;unlock&quot;, or similar fees to free up recovered
            funds.
          </li>
        </ul>
        <p className="mt-2">
          If anyone claiming to be Ramp Recover asks you to pay in these ways, it is not us. Stop contact and tell us at{' '}
          <a href={emailHref} className={linkClass}>{CONTACT.email}</a>. See our{' '}
          <Link href="/risk-notice#recovery-scams" className={linkClass}>guide to spotting recovery scams</Link>.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. Your Responsibilities</h2>
        <p className="mt-2">You agree to provide accurate and complete information, including:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>true identity and contact details,</li>
          <li>honest incident descriptions,</li>
          <li>valid transaction and evidence records where available.</li>
        </ul>
        <p className="mt-2">
          You must not submit false reports, or submit another person&apos;s information without their permission.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. No Guarantee</h2>
        <p className="mt-2">
          Recovery outcomes vary based on scam type, traceability, response timelines, and third-party cooperation.
          Nothing on this site constitutes a promise of fund recovery.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">6. Communication Consent</h2>
        <p className="mt-2">
          By submitting a case, you consent to receiving communication about your intake, requests for additional
          evidence, and service updates via email, phone, WhatsApp, or live chat.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">7. Third-Party Services and Links</h2>
        <p className="mt-2">
          Our website links to and uses third-party services, such as WhatsApp and our live chat provider. Their own terms and
          privacy policies apply when you use them, and we are not responsible for their content or practices.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">8. Intellectual Property</h2>
        <p className="mt-2">
          All text, branding, design, and website content belong to Ramp Recover unless otherwise stated.
          Reproduction or redistribution without authorization is prohibited.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">9. Limitation of Liability</h2>
        <p className="mt-2">
          To the maximum extent permitted by law, Ramp Recover is not liable for indirect, incidental, or
          consequential losses resulting from use of this website or services.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">10. Ending Our Service</h2>
        <p className="mt-2">
          You can stop working with us at any time by telling us. We may decline a case, or stop working on one, for example
          if it falls outside our scope or the information provided is false. If that happens, we will tell you and, where we
          can, point you to the right reporting route.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">11. Changes to These Terms</h2>
        <p className="mt-2">
          We may update these terms from time to time. Changes will be reflected by updating the &quot;Last updated&quot;
          date on this page. Any paid work already agreed in writing stays under the terms of that agreement.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">12. Governing Law</h2>
        <p className="mt-2">
          These terms are governed by the laws of {COMPANY.governingLaw}. This does not remove any rights you have under the
          consumer protection laws of the country where you live.
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
          See also our <Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
