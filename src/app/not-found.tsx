import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Page not found | Ramp Recover',
};

const HELPFUL_LINKS = [
  { href: '/#services', label: 'Our services' },
  { href: '/#scam-types', label: 'Scam types we handle' },
  { href: '/#process-faq', label: 'Process & FAQ' },
  { href: '/risk-notice#recovery-scams', label: 'How to spot a recovery scam' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <section className="rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Error 404</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">We couldn&apos;t find that page</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-700">
              The link may be broken, or the page may have moved. If you need help with a scam, you can still start a case
              or contact us using the buttons at the bottom of the screen.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-primary-200 bg-white px-6 py-3 font-semibold text-primary-700 transition-all hover:border-primary-300 hover:bg-primary-50"
              >
                Go to home page
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25"
              >
                Start a recovery case
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <nav aria-label="Helpful links" className="mt-10 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">You might be looking for</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {HELPFUL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-primary-200 hover:text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
