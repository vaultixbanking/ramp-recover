import type { Metadata } from 'next';
import LegalPageLayout from '@/app/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sentinel Recover',
  description: 'How Sentinel Recover collects, uses, and protects personal data submitted for scam recovery support.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      updatedOn="March 13, 2026"
      intro="This policy explains how Sentinel Recover handles personal information when you use our website and recovery intake services."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. Information We Collect</h2>
        <p className="mt-2">
          We collect details you provide through forms, including contact information, incident timelines, transaction details,
          scam communication records, and supporting evidence summaries.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. How We Use Information</h2>
        <p className="mt-2">We use submitted information to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>review and triage potential scam recovery cases,</li>
          <li>contact you for follow-up and evidence requests,</li>
          <li>prepare recovery documentation and escalation records,</li>
          <li>improve service quality and response workflows.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. Data Sharing</h2>
        <p className="mt-2">
          We do not sell your personal information. We may share relevant case information with financial institutions,
          legal professionals, regulators, or law-enforcement channels only when necessary for case handling or when required by law.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. Data Retention and Security</h2>
        <p className="mt-2">
          We retain information only as long as required for service delivery, legal obligations, and dispute handling.
          We use administrative and technical safeguards designed to protect submitted information from unauthorized access.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. Your Rights</h2>
        <p className="mt-2">
          Depending on your location, you may request access, correction, deletion, or restriction of your personal data.
          To make a request, contact us via the support details on our website.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">6. Policy Updates</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Material changes will be reflected by updating the
          &quot;Last updated&quot; date on this page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
