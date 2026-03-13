import Link from 'next/link';

type LegalPageLayoutProps = {
  title: string;
  updatedOn: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({ title, updatedOn, intro, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 shadow-sm hover:bg-primary-50"
          >
            Back to Home
          </Link>
        </div>

        <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Legal Notice</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {updatedOn}</p>
          <p className="mt-5 text-base leading-relaxed text-gray-700">{intro}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">{children}</div>
        </section>
      </div>
    </main>
  );
}
