import type { Metadata } from 'next';
import LegalPageLayout from '@/app/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Disclaimer | Sentinel Recover',
  description: 'Important disclaimer regarding scam recovery support services, outcomes, and external dependencies.',
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      updatedOn="March 13, 2026"
      intro="Please read this disclaimer carefully before relying on any information provided on this website."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. Informational Content</h2>
        <p className="mt-2">
          Website content is provided for general informational purposes only and does not constitute legal,
          financial, or regulatory advice.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. Case Outcome Variability</h2>
        <p className="mt-2">
          Scam recovery outcomes depend on multiple external factors including transaction traceability,
          counterparty responsiveness, jurisdiction, and timing. Past results do not guarantee future outcomes.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. Third-Party Platforms</h2>
        <p className="mt-2">
          Cases may involve banks, exchanges, messaging platforms, payment providers, and public authorities.
          Sentinel Recover cannot control third-party processing timelines or decisions.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. No Attorney-Client Relationship</h2>
        <p className="mt-2">
          Use of this website and submission of an intake form does not create an attorney-client relationship.
          If legal representation is required, we may recommend consulting a licensed legal professional.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. External Links and Tools</h2>
        <p className="mt-2">
          External links and third-party tools are provided for convenience. We are not responsible for the
          content, policies, or security practices of third-party websites.
        </p>
      </section>
    </LegalPageLayout>
  );
}
