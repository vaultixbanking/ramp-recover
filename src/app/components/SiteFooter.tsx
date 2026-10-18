import Link from 'next/link';
import { Mail, MessageCircleMore, Phone } from 'lucide-react';
import BrandMark from '@/app/components/BrandMark';
import OpenChat from '@/app/components/OpenChat';
import { CONTACT, emailHref, phoneHref } from '@/app/config/contact';
import { LEGAL_PAGES } from '@/app/config/legal';

const QUICK_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#process-faq', label: 'Process & FAQ' },
  { href: '/#contact', label: 'Start Case Intake' },
];

const SCAM_TYPE_LINKS = ['Crypto Wallet Fraud', 'Investment Platform Scam', 'Account Takeover', 'Business Email Compromise'];

// Site-wide footer, shared by the home page and the legal pages (links work from any page).
export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <BrandMark className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Ramp <span className="text-primary-600">Recover</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-700">
            Professional scam recovery support for victims of crypto, payment, impersonation, and investment fraud.
            We prioritize urgent containment and clear recovery communication.
          </p>

          <div className="mt-5 space-y-2 text-sm text-gray-700">
            <a href={emailHref} className="flex w-fit items-center gap-2 hover:text-primary-700">
              <Mail className="h-4 w-4 text-primary-600" />
              {CONTACT.email}
            </a>
            <a href={phoneHref} className="flex w-fit items-center gap-2 hover:text-primary-700">
              <Phone className="h-4 w-4 text-primary-600" />
              {CONTACT.phone}
            </a>
            <OpenChat fallback={null} className="flex w-fit items-center gap-2 hover:text-primary-700">
              <MessageCircleMore className="h-4 w-4 text-secondary-600" />
              Live chat available for urgent active scams
            </OpenChat>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary-700">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Scam Types</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {SCAM_TYPE_LINKS.map((label) => (
              <li key={label}>
                <Link href="/#scam-types" className="hover:text-primary-700">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {LEGAL_PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hover:text-primary-700">{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Ramp Recover. All rights reserved.</p>
          <p>
            Recovery outcomes vary by case complexity, traceability, and third-party cooperation.
          </p>
        </div>
      </div>
    </footer>
  );
}
