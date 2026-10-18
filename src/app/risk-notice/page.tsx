import type { Metadata } from 'next';
import LegalPageLayout from '@/app/components/LegalPageLayout';
import { pageMetadata } from '@/app/config/site';
import { CONTACT, emailHref } from '@/app/config/contact';

export const metadata: Metadata = pageMetadata({
  title: 'Risk Notice | Ramp Recover',
  description: 'Risk notice outlining scam recovery limitations, urgency factors, and user protection responsibilities.',
  path: '/risk-notice',
});

export default function RiskNoticePage() {
  return (
    <LegalPageLayout
      title="Risk Notice"
      path="/risk-notice"
      updatedOn="October 17, 2026"
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

      <section id="recovery-scams">
        <h2 className="text-base font-semibold text-gray-900">6. Recovery Scams: How to Protect Yourself</h2>
        <p className="mt-2">
          After a scam, victims are often targeted again by people pretending to be recovery services, lawyers, police, or
          government agencies. Be careful if anyone:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>guarantees they will get your money back,</li>
          <li>asks for an upfront fee in cryptocurrency or gift cards,</li>
          <li>asks for a &quot;release&quot;, &quot;tax&quot;, or &quot;unlock&quot; fee before you can receive recovered funds,</li>
          <li>asks for your passwords, PINs, seed phrases, or private keys,</li>
          <li>asks you to install software that gives them remote access to your device,</li>
          <li>claims to be from the police or a government agency and asks you for money,</li>
          <li>pressures you to act immediately or keep the conversation secret.</li>
        </ul>
        <div className="mt-4 rounded-xl border border-secondary-500/20 bg-secondary-500/10 p-4">
          <p className="font-semibold text-gray-900">Our promises to you</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>We never guarantee recovery.</li>
            <li>We never ask for payment in cryptocurrency or gift cards.</li>
            <li>We never ask for your passwords, PINs, seed phrases, or private keys.</li>
            <li>We never ask for remote access to your devices.</li>
          </ul>
        </div>
        <p className="mt-4">
          If someone claiming to be Ramp Recover breaks any of these rules, stop contact and tell us at{' '}
          <a href={emailHref} className="font-medium text-primary-700 hover:text-primary-800">{CONTACT.email}</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
