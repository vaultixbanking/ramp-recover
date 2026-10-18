'use client';

import { FormEvent, useEffect, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import OpenChat from '@/app/components/OpenChat';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  FileText,
  LoaderCircle,
  Send,
  Upload,
  X,
} from 'lucide-react';

type IntakeData = {
  scamType: string;
  otherScamType: string;
  amountLost: string;
  incidentDate: string;
  country: string;
  contactChannels: string[];
  paymentMethods: string[];
  institutionName: string;
  reportStatus: string;
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: string;
  timezone: string;
  bestTimeToReach: string;
  caseSummary: string;
  evidenceDetails: string;
  consent: boolean;
  website: string;
};

type SubmitResult = {
  reference: string;
  filesFailed: number;
  confirmationSent: boolean;
};

type SubmitResponse = {
  ok?: boolean;
  reference?: string;
  filesFailed?: number;
  confirmationSent?: boolean;
  fields?: Record<string, string>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// Keep the option lists and file limits in sync with backend/src/validation/intake.ts.
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'];
const FILE_ACCEPT = FILE_EXTENSIONS.map((extension) => `.${extension}`).join(',');

const scamTypes = [
  'Crypto Scam',
  'Investment Scam',
  'Romance Scam',
  'Business Email Compromise',
  'Account Takeover',
  'Phishing',
  'Fake Loan / Advance Fee',
  'Marketplace / Payment Scam',
  'Other',
];

const channelOptions = ['WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'Email', 'Phone Call', 'SMS', 'Dating App'];
const paymentOptions = ['Bank Transfer', 'Debit/Credit Card', 'Crypto Wallet', 'Gift Card', 'Wire Transfer', 'Cash'];

// The step each field lives on, in on-screen order (used to jump to and focus the first error).
const FIELD_STEPS: Record<string, number> = {
  scamType: 1,
  otherScamType: 1,
  amountLost: 2,
  incidentDate: 2,
  country: 2,
  contactChannels: 2,
  paymentMethods: 2,
  institutionName: 2,
  reportStatus: 2,
  referenceId: 2,
  firstName: 3,
  lastName: 3,
  email: 3,
  phone: 3,
  preferredContact: 3,
  timezone: 3,
  bestTimeToReach: 3,
  caseSummary: 3,
  evidenceDetails: 3,
  files: 3,
  consent: 3,
};

const SEND_FAILED =
  "We couldn't send your case. Check your connection and try again. If it keeps failing, use live chat so we can help right away.";

const chatLinkClass = 'font-semibold underline underline-offset-2 hover:text-primary-800';

const inputClass =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100 aria-[invalid=true]:border-error-500';

const initialData: IntakeData = {
  scamType: '',
  otherScamType: '',
  amountLost: '',
  incidentDate: '',
  country: '',
  contactChannels: [],
  paymentMethods: [],
  institutionName: '',
  reportStatus: '',
  referenceId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredContact: '',
  timezone: '',
  bestTimeToReach: '',
  caseSummary: '',
  evidenceDetails: '',
  consent: false,
  website: '',
};

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ContactIntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeData>(initialData);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  // Move focus to the first invalid field (or the success message) once it has rendered.
  // Centre it ourselves: the browser's default focus scroll would tuck it under the fixed header.
  useEffect(() => {
    const target = pendingFocus.current && document.getElementById(pendingFocus.current);
    pendingFocus.current = null;
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center' });
    }
  });

  const update = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFromList = (key: 'contactChannels' | 'paymentMethods', value: string) => {
    setData((prev) => {
      const hasValue = prev[key].includes(value);
      const nextValues = hasValue ? prev[key].filter((item) => item !== value) : [...prev[key], value];
      return { ...prev, [key]: nextValues };
    });
  };

  const describedBy = (key: string) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  // Bring the top of the form back into view (e.g. after "Continue" at the bottom of a long step on mobile).
  const scrollToForm = () => {
    const container = containerRef.current;
    if (!container || container.getBoundingClientRect().top >= 80) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const showErrors = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
    const firstInvalid = Object.keys(FIELD_STEPS).find((key) => nextErrors[key]);
    if (firstInvalid) {
      pendingFocus.current = firstInvalid;
    }
  };

  const validateStep = (targetStep: number) => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!data.scamType) {
        nextErrors.scamType = 'Choose the closest scam category.';
      }
      if (data.scamType === 'Other' && !data.otherScamType.trim()) {
        nextErrors.otherScamType = 'Please describe your scam type.';
      }
    }

    if (targetStep === 2) {
      if (!data.amountLost.trim()) {
        nextErrors.amountLost = 'Enter amount lost (estimate is okay).';
      }
      if (!data.incidentDate) {
        nextErrors.incidentDate = 'Select when this happened.';
      } else if (data.incidentDate > todayIso()) {
        nextErrors.incidentDate = 'The incident date cannot be in the future.';
      }
      if (!data.country.trim()) {
        nextErrors.country = 'Country helps us guide reporting channels.';
      }
      if (data.contactChannels.length === 0) {
        nextErrors.contactChannels = 'Select at least one contact method used by the scammer.';
      }
      if (data.paymentMethods.length === 0) {
        nextErrors.paymentMethods = 'Select at least one payment method used.';
      }
    }

    if (targetStep === 3) {
      if (!data.firstName.trim()) {
        nextErrors.firstName = 'First name is required.';
      }
      if (!data.lastName.trim()) {
        nextErrors.lastName = 'Last name is required.';
      }
      if (!data.email.trim()) {
        nextErrors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        nextErrors.email = 'Enter a valid email address.';
      }
      if (!data.caseSummary.trim()) {
        nextErrors.caseSummary = 'Please summarize your case.';
      } else if (data.caseSummary.trim().length < 40) {
        nextErrors.caseSummary = 'Add a bit more detail (minimum 40 characters).';
      }
      if (!data.consent) {
        nextErrors.consent = 'You must consent before submission.';
      }
    }

    showErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    setSubmitError('');
    setStep((prev) => Math.min(prev + 1, 3));
    scrollToForm();
  };

  const previousStep = () => {
    setErrors({});
    setSubmitError('');
    setStep((prev) => Math.max(prev - 1, 1));
    scrollToForm();
  };

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    // Reset so choosing the same file again still triggers a change.
    event.target.value = '';

    const next = [...files];
    let problem = '';
    for (const file of picked) {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!FILE_EXTENSIONS.includes(extension)) {
        problem = `"${file.name}" isn't a supported file. Use JPG, PNG, WebP, HEIC or PDF.`;
      } else if (file.size > MAX_FILE_BYTES) {
        problem = `"${file.name}" is larger than 10 MB.`;
      } else if (next.length >= MAX_FILES) {
        problem = `You can upload up to ${MAX_FILES} files.`;
      } else if (!next.some((existing) => fileKey(existing) === fileKey(file))) {
        next.push(file);
      }
    }

    setFiles(next);
    setErrors((prev) => ({ ...prev, files: problem }));
  };

  const removeFile = (key: string) => {
    setFiles((prev) => prev.filter((file) => fileKey(file) !== key));
    setErrors((prev) => ({ ...prev, files: '' }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sending || data.website.trim()) {
      return;
    }

    if (!validateStep(3)) {
      return;
    }

    setSending(true);
    setSubmitError('');

    const body = new FormData();
    body.append('data', JSON.stringify(data));
    files.forEach((file) => body.append('files', file));

    try {
      const response = await fetch(`${API_URL}/api/intake`, { method: 'POST', body });
      const payload = (await response.json().catch(() => null)) as SubmitResponse | null;

      if (response.ok && payload?.ok && payload.reference) {
        setResult({
          reference: payload.reference,
          filesFailed: payload.filesFailed ?? 0,
          confirmationSent: Boolean(payload.confirmationSent),
        });
        pendingFocus.current = 'intake-success';
        scrollToForm();
      } else if (response.status === 400 && payload?.fields) {
        const fields = payload.fields;
        const firstInvalid = Object.keys(FIELD_STEPS).find((key) => fields[key]);
        if (firstInvalid) {
          setStep(FIELD_STEPS[firstInvalid]);
        }
        showErrors(fields);
        setSubmitError('Please check the highlighted fields and try again.');
        scrollToForm();
      } else if (response.status === 429) {
        setSubmitError('Too many submissions from your connection. Please wait 15 minutes, or use live chat if your case is urgent.');
      } else {
        setSubmitError(SEND_FAILED);
      }
    } catch {
      setSubmitError(SEND_FAILED);
    } finally {
      setSending(false);
    }
  };

  if (result) {
    const failed = result.filesFailed;
    return (
      <div ref={containerRef}>
        <div role="status" className="rounded-3xl border border-success-500/25 bg-success-500/10 p-7 sm:p-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" />
            <div>
              <p id="intake-success" tabIndex={-1} className="text-lg font-semibold text-gray-900 outline-none">
                Case received
              </p>
              <p className="mt-3 text-sm text-gray-700">Your case reference</p>
              <p className="mt-1 inline-flex rounded-xl border border-success-500/25 bg-white px-4 py-2 font-mono text-lg font-bold tracking-wider text-gray-900">
                {result.reference}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                {result.confirmationSent ? (
                  <>
                    We&apos;ve emailed a confirmation to <span className="font-semibold text-gray-900">{data.email}</span>.{' '}
                  </>
                ) : null}
                Quote this reference whenever you contact us. We will reach out within 24 hours to gather additional
                information and scam proof, then keep regular communication with you throughout the recovery process.
              </p>
              {failed > 0 && (
                <p className="mt-3 rounded-xl border border-warning-500/20 bg-warning-500/10 px-3 py-2 text-sm text-gray-800">
                  {failed === 1 ? '1 file' : `${failed} files`} didn&apos;t upload. Our team will ask you for{' '}
                  {failed === 1 ? 'it' : 'them'} when we contact you.
                </p>
              )}
              <p className="mt-3 text-sm font-medium text-primary-700">
                If your case is urgent, <OpenChat className={chatLinkClass}>use our live chat</OpenChat> immediately so we
                can respond faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-primary-100 bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-gray-900">Secure Scam Intake Form</h3>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">Step {step} of 3</span>
        </div>

        <div className="mb-7 grid grid-cols-3 gap-2" aria-hidden="true">
          {[1, 2, 3].map((stepValue) => (
            <div key={stepValue} className={`h-1.5 rounded-full ${stepValue <= step ? 'bg-primary-600' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <p id="scamType-label" className="text-sm text-gray-600">Select the fraud type closest to your case.</p>

            <div
              id="scamType"
              role="group"
              aria-labelledby="scamType-label"
              tabIndex={-1}
              {...describedBy('scamType')}
              className="grid gap-2 outline-none sm:grid-cols-2"
            >
              {scamTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => update('scamType', type)}
                  aria-pressed={data.scamType === type}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    data.scamType === type
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <FieldError id="scamType" message={errors.scamType} />

            {data.scamType === 'Other' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="otherScamType">
                  Describe your scam type
                </label>
                <input
                  id="otherScamType"
                  type="text"
                  value={data.otherScamType}
                  onChange={(e) => update('otherScamType', e.target.value)}
                  {...describedBy('otherScamType')}
                  className={inputClass}
                  placeholder="Example: AI impersonation extortion"
                />
                <FieldError id="otherScamType" message={errors.otherScamType} />
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="amountLost">
                  Estimated amount lost
                </label>
                <input
                  id="amountLost"
                  type="text"
                  value={data.amountLost}
                  onChange={(e) => update('amountLost', e.target.value)}
                  placeholder="Example: $12,500"
                  {...describedBy('amountLost')}
                  className={inputClass}
                />
                <FieldError id="amountLost" message={errors.amountLost} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="incidentDate">
                  Incident date
                </label>
                <input
                  id="incidentDate"
                  type="date"
                  max={todayIso()}
                  value={data.incidentDate}
                  onChange={(e) => update('incidentDate', e.target.value)}
                  {...describedBy('incidentDate')}
                  className={inputClass}
                />
                <FieldError id="incidentDate" message={errors.incidentDate} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="country">
                Your country
              </label>
              <input
                id="country"
                type="text"
                value={data.country}
                onChange={(e) => update('country', e.target.value)}
                placeholder="Example: United States"
                {...describedBy('country')}
                className={inputClass}
              />
              <FieldError id="country" message={errors.country} />
            </div>

            <div>
              <p id="contactChannels-label" className="mb-2 text-sm font-medium text-gray-700">How did the scammer contact you?</p>
              <div
                id="contactChannels"
                role="group"
                aria-labelledby="contactChannels-label"
                tabIndex={-1}
                {...describedBy('contactChannels')}
                className="flex flex-wrap gap-2 outline-none"
              >
                {channelOptions.map((channel) => {
                  const selected = data.contactChannels.includes(channel);
                  return (
                    <button
                      type="button"
                      key={channel}
                      onClick={() => toggleFromList('contactChannels', channel)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'
                      }`}
                    >
                      {channel}
                    </button>
                  );
                })}
              </div>
              <FieldError id="contactChannels" message={errors.contactChannels} />
            </div>

            <div>
              <p id="paymentMethods-label" className="mb-2 text-sm font-medium text-gray-700">What payment method was used?</p>
              <div
                id="paymentMethods"
                role="group"
                aria-labelledby="paymentMethods-label"
                tabIndex={-1}
                {...describedBy('paymentMethods')}
                className="flex flex-wrap gap-2 outline-none"
              >
                {paymentOptions.map((method) => {
                  const selected = data.paymentMethods.includes(method);
                  return (
                    <button
                      type="button"
                      key={method}
                      onClick={() => toggleFromList('paymentMethods', method)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
              <FieldError id="paymentMethods" message={errors.paymentMethods} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="institutionName">
                  Platform / bank / wallet (optional)
                </label>
                <input
                  id="institutionName"
                  type="text"
                  value={data.institutionName}
                  onChange={(e) => update('institutionName', e.target.value)}
                  placeholder="Example: Coinbase / Chase"
                  {...describedBy('institutionName')}
                  className={inputClass}
                />
                <FieldError id="institutionName" message={errors.institutionName} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="reportStatus">
                  Already reported? (optional)
                </label>
                <select
                  id="reportStatus"
                  value={data.reportStatus}
                  onChange={(e) => update('reportStatus', e.target.value)}
                  {...describedBy('reportStatus')}
                  className={inputClass}
                >
                  <option value="">Select status</option>
                  <option value="Not reported yet">Not reported yet</option>
                  <option value="Reported to bank/payment provider">Reported to bank/payment provider</option>
                  <option value="Reported to law enforcement">Reported to law enforcement</option>
                  <option value="Reported to both">Reported to both</option>
                </select>
                <FieldError id="reportStatus" message={errors.reportStatus} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="referenceId">
                Existing case/report reference (optional)
              </label>
              <input
                id="referenceId"
                type="text"
                value={data.referenceId}
                onChange={(e) => update('referenceId', e.target.value)}
                placeholder="Ticket, case, or complaint number"
                {...describedBy('referenceId')}
                className={inputClass}
              />
              <FieldError id="referenceId" message={errors.referenceId} />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={data.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  {...describedBy('firstName')}
                  className={inputClass}
                />
                <FieldError id="firstName" message={errors.firstName} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={data.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  {...describedBy('lastName')}
                  className={inputClass}
                />
                <FieldError id="lastName" message={errors.lastName} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                  {...describedBy('email')}
                  className={inputClass}
                />
                <FieldError id="email" message={errors.email} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="phone">
                  Phone / WhatsApp (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="Include country code"
                  {...describedBy('phone')}
                  className={inputClass}
                />
                <FieldError id="phone" message={errors.phone} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="preferredContact">
                  Preferred contact
                </label>
                <select
                  id="preferredContact"
                  value={data.preferredContact}
                  onChange={(e) => update('preferredContact', e.target.value)}
                  {...describedBy('preferredContact')}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="Email">Email</option>
                  <option value="Phone call">Phone call</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
                <FieldError id="preferredContact" message={errors.preferredContact} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="timezone">
                  Timezone (optional)
                </label>
                <input
                  id="timezone"
                  type="text"
                  value={data.timezone}
                  onChange={(e) => update('timezone', e.target.value)}
                  placeholder="EST (UTC-5)"
                  {...describedBy('timezone')}
                  className={inputClass}
                />
                <FieldError id="timezone" message={errors.timezone} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="bestTimeToReach">
                  Best time to reach you
                </label>
                <input
                  id="bestTimeToReach"
                  type="text"
                  value={data.bestTimeToReach}
                  onChange={(e) => update('bestTimeToReach', e.target.value)}
                  placeholder="9am - 2pm"
                  {...describedBy('bestTimeToReach')}
                  className={inputClass}
                />
                <FieldError id="bestTimeToReach" message={errors.bestTimeToReach} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="caseSummary">
                Case summary
              </label>
              <textarea
                id="caseSummary"
                rows={5}
                value={data.caseSummary}
                onChange={(e) => update('caseSummary', e.target.value)}
                placeholder="Explain how it started, what happened, and your current situation."
                {...describedBy('caseSummary')}
                className={inputClass}
              />
              <FieldError id="caseSummary" message={errors.caseSummary} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="evidenceDetails">
                Evidence available (optional)
              </label>
              <textarea
                id="evidenceDetails"
                rows={3}
                value={data.evidenceDetails}
                onChange={(e) => update('evidenceDetails', e.target.value)}
                placeholder="Screenshots, wallet addresses, transaction IDs, emails, account numbers, chat usernames"
                {...describedBy('evidenceDetails')}
                className={inputClass}
              />
              <FieldError id="evidenceDetails" message={errors.evidenceDetails} />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-gray-700">Upload evidence files (optional)</p>
              <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition-colors focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100 hover:border-primary-500 hover:bg-primary-50">
                <input
                  id="files"
                  type="file"
                  multiple
                  accept={FILE_ACCEPT}
                  onChange={addFiles}
                  {...describedBy('files')}
                  className="sr-only"
                />
                <Upload className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Choose files</span>
                <span className="text-xs text-gray-500">
                  Screenshots, receipts or statements · JPG, PNG, WebP, HEIC or PDF · up to {MAX_FILES} files, 10 MB each
                </span>
              </label>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file) => (
                    <li
                      key={fileKey(file)}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="truncate text-gray-800">{file.name}</span>
                        <span className="shrink-0 text-xs text-gray-500">{formatSize(file.size)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(fileKey(file))}
                        aria-label={`Remove ${file.name}`}
                        className="shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <FieldError id="files" message={errors.files} />
            </div>

            <input
              type="text"
              className="hidden"
              value={data.website}
              onChange={(e) => update('website', e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
            />

            <label className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4">
              <input
                id="consent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                checked={data.consent}
                onChange={(e) => update('consent', e.target.checked)}
                {...describedBy('consent')}
              />
              <span className="text-sm text-gray-700">
                I confirm the information is accurate to the best of my knowledge and I consent to being contacted
                for recovery support updates. I agree to the{' '}
                <Link href="/terms-of-service" target="_blank" className="font-medium text-primary-700 underline hover:text-primary-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" target="_blank" className="font-medium text-primary-700 underline hover:text-primary-800">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <FieldError id="consent" message={errors.consent} />
          </section>
        )}

        {submitError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl border border-error-500/25 bg-error-500/10 px-4 py-3 text-sm text-gray-800"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-error-500" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-start gap-2 rounded-xl border border-warning-500/20 bg-warning-500/10 px-3 py-2 text-xs text-gray-700">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-500" />
            <p>
              Urgent case? <OpenChat className={chatLinkClass}>Use our live chat</OpenChat> for immediate support while this
              form is being reviewed.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end">
            {step > 1 && (
              <button
                type="button"
                onClick={previousStep}
                disabled={sending}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-600 disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? (
                  <>
                    {files.length > 0 ? 'Uploading…' : 'Sending…'}
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Submit Case
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p id={`${id}-error`} className="mt-1 text-sm text-error-500">
      {message}
    </p>
  );
}
