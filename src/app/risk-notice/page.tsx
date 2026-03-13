import type { Metadata } from 'next';
import LegalPageLayout from '@/app/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Risk Notice | Sentinel Recover',
  description: 'Risk notice outlining scam recovery limitations, urgency factors, and user protection responsibilities.',
};

export default function RiskNoticePage() {
  return (
    <LegalPageLayout
      title="Risk Notice"
      updatedOn="March 13, 2026"
      intro="Scam recovery support involves uncertainty. This notice outlines key risks and practical expectations."
    >
      <section>
        <h2 className="text-base font-semibold text-gray-900">1. Time-Sensitive Risk</h2>
        <p className="mt-2">
          Delay in reporting can reduce recovery options. If a scam is ongoing, immediate containment actions are
          critical to prevent further losses.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">2. Asset Movement Risk</h2>
        <p className="mt-2">
          Funds moved through multiple wallets, exchanges, or mule accounts become harder to trace over time.
          Tracing complexity can affect both timeline and likelihood of recovery.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">3. Jurisdiction and Enforcement Risk</h2>
        <p className="mt-2">
          Cross-border cases may involve conflicting legal frameworks and varying authority response levels,
          which can slow case progression.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">4. Identity and Documentation Risk</h2>
        <p className="mt-2">
          Inaccurate or incomplete records may weaken escalation quality. Providing reliable, chronological,
          and verifiable evidence improves case strength.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900">5. Ongoing Scam Interaction Risk</h2>
        <p className="mt-2">
          Continuing contact with scammers after discovery can increase losses. Follow containment advice,
          preserve evidence, and avoid unauthorized additional payments.
        </p>
      </section>
    </LegalPageLayout>
  );
}
