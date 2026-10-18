import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/SiteFooter';
import { LEGAL_PAGES } from '@/app/config/legal';

type LegalPageLayoutProps = {
  title: string;
  /** This page's path, e.g. "/privacy-policy", to mark it in the "Other legal pages" row. */
  path: string;
  updatedOn: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({ title, path, updatedOn, intro, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <article className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Legal Notice</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: {updatedOn}</p>
            <p className="mt-5 text-base leading-relaxed text-gray-700">{intro}</p>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">{children}</div>

            <nav aria-label="Legal pages" className="mt-10 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Other legal pages</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {LEGAL_PAGES.map((page) => {
                  const current = page.href === path;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        aria-current={current ? 'page' : undefined}
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          current
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-700'
                        }`}
                      >
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
