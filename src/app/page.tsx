import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bitcoin,
  ClipboardCheck,
  Clock3,
  FolderOpen,
  Landmark,
  MessageCircleMore,
  MessageSquareText,
  Quote,
  Route,
  ShieldAlert,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import ContactIntakeForm from '@/app/components/ContactIntakeForm';
import OpenChat from '@/app/components/OpenChat';
import SiteFooter from '@/app/components/SiteFooter';
import { HOME_TITLE, SITE_DESCRIPTION, pageMetadata } from '@/app/config/site';

export const metadata = pageMetadata({ title: HOME_TITLE, description: SITE_DESCRIPTION, path: '/' });

const chatLinkClass = 'font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800';
const chatButtonClass =
  'mt-3 inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary-600';

const SERVICES = [
  {
    icon: ClipboardCheck,
    title: 'Case triage',
    detail:
      'We review your report within 24 hours, flag immediate risks, and tell you the first steps to protect remaining funds and accounts.',
  },
  {
    icon: FolderOpen,
    title: 'Evidence case file',
    detail:
      'We organize transaction records, wallet addresses, platform logs, and messages into a clear, chronological case file.',
  },
  {
    icon: Route,
    title: 'Transaction tracing',
    detail:
      'We trace how funds moved across wallets, exchanges, and payment processors to find actionable recovery paths.',
  },
  {
    icon: Landmark,
    title: 'Escalation support',
    detail:
      'We prepare evidence packets for bank disputes, exchange escalations, regulator complaints, and law-enforcement reports.',
  },
  {
    icon: ShieldAlert,
    title: 'Active-scam containment',
    detail:
      'If the scam is still happening, we guide you through steps to stop further losses and preserve evidence.',
  },
  {
    icon: MessageSquareText,
    title: 'Ongoing case updates',
    detail:
      'You get regular, clear updates while we follow up across every channel involved in your case.',
  },
];

const FEATURED = {
  name: 'Margaret O.',
  initials: 'MO',
  location: 'Texas, United States',
  type: 'Crypto Investment Scam',
  recovered: '$47,000',
  year: '2024',
  story:
    'I invested $52,000 over eight months into what I was told was a licensed crypto arbitrage platform. They showed me a live dashboard with growing profits I could never actually withdraw. When I tried to exit, they demanded a \'tax clearance fee\' — that\u2019s when I knew. I found Ramp Recover through a victim support forum. Their team had seen this exact platform before, traced the wallet movement patterns, and built a complete evidence package. I got $47,000 back. I still can\u2019t fully believe it worked.',
};

const TESTIMONIALS = [
  {
    name: 'James T.',
    initials: 'JT',
    location: 'Ontario, Canada',
    avatarBg: 'bg-indigo-500',
    type: 'Investment Platform Fraud',
    typeBadge: 'bg-warning-500/10 text-warning-500',
    recovered: '$23,500',
    excerpt:
      'I put part of my retirement savings into what a colleague recommended as a regulated investment platform. Every withdrawal attempt was blocked by \u201cpending verification.\u201d Ramp Recover traced the domain and payment processors. I got the majority back.',
  },
  {
    name: 'Sandra K.',
    initials: 'SK',
    location: 'Birmingham, United Kingdom',
    avatarBg: 'bg-rose-500',
    type: 'Romance & Wire Transfer Scam',
    typeBadge: 'bg-error-500/10 text-error-500',
    recovered: '$12,800',
    excerpt:
      'I was manipulated emotionally over several months before the asks for money started. The team here never once made me feel judged. They traced four wire transfers and helped me file with my bank. Got back more than I expected.',
  },
  {
    name: 'Rafael M.',
    initials: 'RM',
    location: 'Miami, Florida',
    avatarBg: 'bg-orange-500',
    type: 'Business Email Compromise',
    typeBadge: 'bg-error-500/10 text-error-500',
    recovered: '$89,200',
    excerpt:
      'Our business was social-engineered into a fraudulent wire. The attacker had been reading our email thread for weeks before striking. The forensic report Ramp Recover produced was exactly what our insurer and FBI liaison needed to act.',
  },
  {
    name: 'Liu W.',
    initials: 'LW',
    location: 'Singapore',
    avatarBg: 'bg-violet-500',
    type: 'Fake Crypto Trading App',
    typeBadge: 'bg-warning-500/10 text-warning-500',
    recovered: '$34,600',
    excerpt:
      'A trading app showed SGD 180,000 in my account — all fake. Every withdrawal triggered a new fee. Ramp Recover had seen this scheme before and delivered full blockchain tracing in 12 days. A significant portion was recoverable.',
  },
  {
    name: 'Andrea B.',
    initials: 'AB',
    location: 'Melbourne, Australia',
    avatarBg: 'bg-teal-500',
    type: 'Account Takeover & SIM Swap',
    typeBadge: 'bg-primary-600/10 text-primary-700',
    recovered: '$8,500',
    excerpt:
      'A SIM swap drained my bank account before I noticed. Ramp Recover helped me document the telecom failure, escalate to AFCA, and negotiate a partial reimbursement faster than I imagined possible.',
  },
  {
    name: 'David A.',
    initials: 'DA',
    location: 'London, United Kingdom',
    avatarBg: 'bg-cyan-600',
    type: 'Fake Forex Broker',
    typeBadge: 'bg-primary-600/10 text-primary-700',
    recovered: '$61,000',
    excerpt:
      'The broker had FCA registration numbers cloned from a legitimate firm. I\u2019d traded £48,000 into the account. Ramp Recover\u2019s evidence bundle was the key to my chargeback claim and regulator complaint. Settled in 11 weeks.',
  },
];

const PROCESS_STEPS = [
  {
    title: 'Initial Triage (0-24 hours)',
    detail:
      'We review your intake, identify immediate risk, and tell you the first actions to protect remaining funds and accounts.',
    output: 'Priority assessment + immediate safety checklist',
  },
  {
    title: 'Evidence Mapping (Day 1-3)',
    detail:
      'Our team organizes transaction records, wallet addresses, platform logs, and message history into a clear investigative timeline.',
    output: 'Structured case file and incident chronology',
  },
  {
    title: 'Recovery Strategy (Day 3-7)',
    detail:
      'We define the right escalation path: financial institutions, exchanges, payment processors, or law-enforcement reporting routes.',
    output: 'Case-specific escalation plan',
  },
  {
    title: 'Follow-up and Communication (Ongoing)',
    detail:
      'You receive regular status updates while we push evidence-backed follow-up across channels involved in your case.',
    output: 'Consistent progress updates and action tracking',
  },
];

const FAQS = [
  {
    question: 'Can you guarantee recovery?',
    answer:
      'No ethical recovery team can guarantee outcomes. What we do guarantee is a structured investigation, documented evidence workflows, and transparent communication throughout your case.',
  },
  {
    question: 'How quickly will someone contact me after I submit?',
    answer:
      'Our intake team follows up within 24 hours. Urgent active-fraud situations should use live chat immediately so we can guide fast containment steps while your intake is processed.',
  },
  {
    question: 'What proof should I prepare before the call?',
    answer:
      'Useful items include transaction IDs, wallet addresses, bank/payment receipts, chat screenshots, email headers, scam profile links, and platform account statements.',
  },
  {
    question: 'Do you work with law enforcement and financial institutions?',
    answer:
      'Yes. When needed, we prepare clean evidence packets suitable for bank disputes, exchange escalations, regulator complaints, and law-enforcement reporting channels.',
  },
  {
    question: 'What if I was scammed across multiple platforms?',
    answer:
      'That is common. We consolidate every channel into one timeline and prioritize the paths with the highest probability of actionable response first.',
  },
  {
    question: 'Will my information remain private?',
    answer:
      'Yes. Your details are used for case review and recovery coordination only. We do not publish your identity or case information without permission.',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-50">
      <div className="absolute inset-x-0 top-0 h-155 bg-linear-to-b from-primary-50 via-white to-transparent" />

      <div className="relative z-10">
        <Navigation />

        <section className="mx-auto grid w-full max-w-7xl gap-14 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-36">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm">
              <ShieldAlert className="h-4 w-4" />
              Rapid fraud response team
              <span className="rounded-full bg-secondary-500 px-2 py-0.5 text-xs text-white">24/7</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Recover stolen funds with a forensic team that knows how scammers operate.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-700">
              We support victims of crypto, investment, impersonation, and payment fraud by building evidence,
              tracing transaction paths, and preparing documented recovery workflows.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25"
              >
                Start Recovery Case
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#testimonials"
                className="inline-flex items-center justify-center rounded-xl border border-primary-200 bg-white px-7 py-3.5 font-semibold text-primary-700 transition-all hover:border-primary-300 hover:bg-primary-50"
              >
                See Recovery Results
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
                <div className="mb-2 inline-flex rounded-xl bg-primary-50 p-2 text-primary-700">
                  <Banknote className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">$18.2M</p>
                <p className="text-sm text-gray-600">Reported client funds traced and documented</p>
              </div>

              <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
                <div className="mb-2 inline-flex rounded-xl bg-primary-50 p-2 text-primary-700">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">3,400+</p>
                <p className="text-sm text-gray-600">Victims guided through structured recovery steps</p>
              </div>

              <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
                <div className="mb-2 inline-flex rounded-xl bg-primary-50 p-2 text-primary-700">
                  <Clock3 className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-sm text-gray-600">Follow-up on every new case</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-4xl bg-linear-to-br from-primary-100 to-white blur-2xl" />
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">How our process works</p>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Built for speed, evidence, and client clarity</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">1</span>
                  <p className="text-gray-700">Case intake, identity checks, and full incident timeline mapping.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">2</span>
                  <p className="text-gray-700">Fraud tracing, platform reports, and legal-ready evidence packets.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">3</span>
                  <p className="text-gray-700">Escalation support and coordinated recovery communication.</p>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-secondary-600"
              >
                Speak with Recovery Specialist
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              What we do
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Recovery support from first report to final update
            </h2>
            <p className="mt-3 text-gray-700">
              Every case follows the same structured workflow, from first containment steps to ongoing updates.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, detail }) => (
              <article
                key={title}
                className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-2.5 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="scam-types" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Scam coverage</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Fraud categories we actively handle</h2>
              </div>
              <a href="#contact" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                Report your case now
              </a>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-lg">
                <div className="mb-3 inline-flex rounded-xl bg-warning-500/10 p-2 text-warning-500">
                  <Bitcoin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Crypto wallet and exchange fraud</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Fake trading platforms, phishing drains, and unauthorized wallet transfers.
                </p>
              </article>

              <article className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-lg">
                <div className="mb-3 inline-flex rounded-xl bg-error-500/10 p-2 text-error-500">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Impersonation and account takeover</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Executive impersonation, support scams, and compromised account transaction losses.
                </p>
              </article>

              <article className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-lg">
                <div className="mb-3 inline-flex rounded-xl bg-secondary-500/10 p-2 text-secondary-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Investment and payment scams</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Advance fee fraud, fake brokers, high-yield schemes, and transfer deception incidents.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="bg-gray-900 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">

            {/* Section header */}
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300">
                <BadgeCheck className="h-4 w-4 text-secondary-500" />
                Verified client outcomes
              </span>
              <h2 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
                Real cases. Real recoveries.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-gray-400">
                Every account below is from a real client who trusted us after losing money to fraud.
                Names are abbreviated at client request.
              </p>
            </div>

            {/* Featured testimonial */}
            <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                {/* Avatar column */}
                <div className="flex shrink-0 flex-row items-center gap-4 lg:w-40 lg:flex-col lg:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white shadow-lg shadow-primary-500/20">
                    {FEATURED.initials}
                  </div>
                  <div className="lg:text-center">
                    <p className="font-semibold text-white">{FEATURED.name}</p>
                    <p className="text-xs text-gray-500">{FEATURED.location}</p>
                    <div className="mt-1.5 flex gap-0.5 lg:justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text column */}
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-warning-500/10 px-3 py-1 text-xs font-semibold text-warning-500">
                      {FEATURED.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-500/15 px-3 py-1 text-xs font-semibold text-secondary-500">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified Case
                    </span>
                  </div>
                  <Quote className="mb-3 h-8 w-8 text-primary-500/30" />
                  <p className="text-lg leading-relaxed text-gray-300 sm:text-xl">
                    {FEATURED.story}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="rounded-xl bg-secondary-500/10 px-5 py-3">
                      <p className="text-xs text-secondary-500/70">Amount Recovered</p>
                      <p className="text-xl font-bold text-secondary-500">{FEATURED.recovered}</p>
                    </div>
                    <p className="text-sm text-gray-600">Case closed · {FEATURED.year}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Grid of testimonials */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/8"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${t.avatarBg}`}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.location}</p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-500/15 px-2.5 py-1 text-xs font-semibold text-secondary-500">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  </div>

                  <div className="mb-3 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
                    ))}
                  </div>

                  <span className={`inline-block self-start rounded-full px-2.5 py-1 text-xs font-semibold ${t.typeBadge}`}>
                    {t.type}
                  </span>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{t.excerpt}</p>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs text-gray-600">Amount recovered</p>
                    <p className="text-base font-bold text-secondary-500">{t.recovered}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA strip */}
            <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-2xl font-bold text-white">Seen enough?</p>
                <p className="text-gray-400">Get a free case review — no commitment required.</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-7 py-3.5 font-semibold text-white transition-all hover:bg-secondary-600 hover:shadow-lg hover:shadow-secondary-500/20"
              >
                Start My Recovery
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </section>

        <section id="process-faq" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              Process and clarity
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              What happens after you report your case
            </h2>
            <p className="mt-3 text-gray-700">
              Scam victims often ask what comes next, how long it takes, and what documents are needed.
              Here is the exact workflow and the questions we answer most.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-bold text-gray-900">Recovery timeline</h3>
              <ol className="mt-6 space-y-5">
                {PROCESS_STEPS.map((step, index) => (
                  <li key={step.title} className="relative rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <span className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white shadow-md shadow-primary-500/25">
                      {index + 1}
                    </span>
                    <p className="pl-4 text-base font-semibold text-gray-900">{step.title}</p>
                    <p className="mt-2 pl-4 text-sm leading-relaxed text-gray-700">{step.detail}</p>
                    <p className="mt-3 pl-4 text-xs font-semibold uppercase tracking-wide text-primary-700">
                      Deliverable: {step.output}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-secondary-500/20 bg-secondary-500/10 p-4">
                <p className="text-sm font-semibold text-gray-900">Need immediate action?</p>
                <p className="mt-1 text-sm text-gray-700">
                  If the scam is still active, start live chat first. We will guide containment steps while your full case intake is being reviewed.
                </p>
                <OpenChat fallback={null} className={chatButtonClass}>
                  <MessageCircleMore className="h-4 w-4" />
                  Start live chat
                </OpenChat>
              </div>
            </div>

            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-bold text-gray-900">Frequently asked questions</h3>
              <div className="mt-5 space-y-3">
                {FAQS.map((faq) => (
                  <details key={faq.question} className="group rounded-xl border border-gray-100 bg-gray-50 p-4 open:bg-white open:shadow-sm">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-gray-900 marker:content-none">
                      {faq.question}
                      <span className="float-right text-primary-700 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.answer}</p>
                  </details>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Still unsure if your case qualifies?</p>
                <p className="mt-1 text-sm text-gray-700">
                  Submit the intake anyway. If it falls outside our scope, we will point you to the right reporting route.
                </p>
                <a
                  href="#contact"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
                >
                  Start your free case review
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
          <div className="mb-8 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              Confidential Intake
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Tell us your case. We follow up within 24 hours.
            </h2>
            <p className="mt-3 text-gray-700">
              Complete the secure intake form below. Your information is used only for case review and recovery support.
              If your situation is urgent, <OpenChat className={chatLinkClass}>use live chat</OpenChat> for immediate attention
              while your intake is processed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <ContactIntakeForm />

            <aside className="h-fit rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-lg font-bold text-gray-900">What happens after submission</h3>
              <ul className="mt-5 space-y-4 text-sm text-gray-700">
                <li className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">1. Case review in under 24 hours</p>
                  <p className="mt-1">Our intake team reviews your report and flags urgent recovery opportunities.</p>
                </li>
                <li className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">2. Evidence and proof request</p>
                  <p className="mt-1">We contact you for additional files like screenshots, IDs, receipts, and transaction traces.</p>
                </li>
                <li className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">3. Regular communication</p>
                  <p className="mt-1">You receive clear updates as we investigate and coordinate the recovery path.</p>
                </li>
              </ul>

              <div className="mt-5 rounded-xl border border-secondary-500/20 bg-secondary-500/10 p-4 text-sm text-gray-800">
                <p className="flex items-center gap-2 font-semibold text-gray-900">
                  <ShieldCheck className="h-4 w-4 text-secondary-600" />
                  Our promises to you
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>We never guarantee recovery.</li>
                  <li>We never ask for payment in crypto or gift cards.</li>
                  <li>We never ask for your passwords, seed phrases, or remote access to your devices.</li>
                </ul>
                <Link
                  href="/risk-notice#recovery-scams"
                  className="mt-3 inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800"
                >
                  How to spot a recovery scam
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 rounded-xl border border-warning-500/20 bg-warning-500/10 p-4 text-sm text-gray-800">
                <p className="font-semibold text-gray-900">Urgent fraud in progress?</p>
                <p className="mt-1">
                  Use live chat immediately so our team can guide next protective actions while your intake is reviewed.
                </p>
                <OpenChat fallback={null} className={chatButtonClass}>
                  <MessageCircleMore className="h-4 w-4" />
                  Open live chat
                </OpenChat>
              </div>
            </aside>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}