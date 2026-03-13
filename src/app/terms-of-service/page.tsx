import type { Metadata } from 'next';
import LegalPageLayout from '@/app/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Sentinel Recover',
  description: 'Terms governing use of Sentinel Recover website and scam recovery support services.',
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      updatedOn="March 13, 2026"
      intro="By accessing this website and using our case intake process, you agree to the following terms and conditions."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. Service Scope</h2>
        <p className="mt-2">
          Sentinel Recover provides scam recovery support, case analysis, evidence organization, and escalation guidance.
          We do not provide guaranteed outcomes and we are not a law-enforcement agency.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. User Responsibilities</h2>
        <p className="mt-2">You agree to provide accurate and complete information, including:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>true identity and contact details,</li>
          <li>honest incident descriptions,</li>
          <li>valid transaction and evidence records where available.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. No Guarantee</h2>
        <p className="mt-2">
          Recovery outcomes vary based on scam type, traceability, response timelines, and third-party cooperation.
          Nothing on this site constitutes a promise of fund recovery.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. Communication Consent</h2>
        <p className="mt-2">
          By submitting a case, you consent to receiving communication about your intake, requests for additional
          evidence, and service updates via email, phone, or messaging channels.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. Intellectual Property</h2>
        <p className="mt-2">
          All text, branding, design, and website content belong to Sentinel Recover unless otherwise stated.
          Reproduction or redistribution without authorization is prohibited.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">6. Limitation of Liability</h2>
        <p className="mt-2">
          To the maximum extent permitted by law, Sentinel Recover is not liable for indirect, incidental, or
          consequential losses resulting from use of this website or services.
        </p>
      </section>
    </LegalPageLayout>
  );
}
