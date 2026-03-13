// components/Navigation.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, Phone, ShieldCheck, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'border-b border-primary-100 bg-white/90 shadow-sm backdrop-blur-xl'
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/25 transition-transform duration-300 group-hover:-translate-y-0.5">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Sentinel Recover
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#scam-types">Scam Types</NavLink>
          <NavLink href="#proof">Case Results</NavLink>
          <NavLink href="#contact">Contact</NavLink>

          <div className="flex items-center gap-2 border-l border-primary-100 pl-6 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-primary-600" />
            <span className="font-semibold">24/7 Response</span>
          </div>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20"
          >
            Free Case Review
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-xl border border-primary-100 bg-white p-2 text-gray-900 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-2xl md:hidden">
          <div className="flex flex-col gap-2">
            <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="#scam-types" onClick={() => setIsOpen(false)}>Scam Types</MobileNavLink>
            <MobileNavLink href="#proof" onClick={() => setIsOpen(false)}>Case Results</MobileNavLink>
            <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Request Recovery Support
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary-600"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
    >
      {children}
    </Link>
  );
}