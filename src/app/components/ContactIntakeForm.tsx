'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, CircleAlert, MessageCircleMore } from 'lucide-react';

type FormData = {
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

const RECOVERY_EMAIL = 'vaultixbanking@gmail.com';

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

const initialData: FormData = {
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

export default function ContactIntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedScamType = useMemo(() => {
    if (data.scamType !== 'Other') {
      return data.scamType;
    }

    return data.otherScamType.trim() || 'Other (not specified)';
  }, [data.otherScamType, data.scamType]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFromList = (key: 'contactChannels' | 'paymentMethods', value: string) => {
    setData((prev) => {
      const hasValue = prev[key].includes(value);
      const nextValues = hasValue ? prev[key].filter((item) => item !== value) : [...prev[key], value];
      return { ...prev, [key]: nextValues };
    });
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const previousStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.website.trim()) {
      return;
    }

    if (!validateStep(3)) {
      return;
    }

    const lines = [
      'New Scam Recovery Intake',
      '',
      '--- CASE CATEGORY ---',
      `Scam Type: ${selectedScamType}`,
      '',
      '--- INCIDENT DETAILS ---',
      `Amount Lost: ${data.amountLost}`,
      `Incident Date: ${data.incidentDate || 'Not specified'}`,
      `Country: ${data.country || 'Not specified'}`,
      `Scammer Contact Channels: ${data.contactChannels.join(', ') || 'Not specified'}`,
      `Payment Methods Used: ${data.paymentMethods.join(', ') || 'Not specified'}`,
      `Institution/Exchange Name: ${data.institutionName || 'Not provided'}`,
      `Already Reported: ${data.reportStatus || 'Not specified'}`,
      `Case/Report Reference ID: ${data.referenceId || 'Not provided'}`,
      '',
      '--- CLIENT CONTACT ---',
      `Name: ${data.firstName} ${data.lastName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'Not provided'}`,
      `Preferred Contact Method: ${data.preferredContact || 'Not specified'}`,
      `Timezone: ${data.timezone || 'Not specified'}`,
      `Best Time to Reach: ${data.bestTimeToReach || 'Not specified'}`,
      '',
      '--- CASE DESCRIPTION ---',
      data.caseSummary,
      '',
      '--- EVIDENCE / NOTES ---',
      data.evidenceDetails || 'None provided at intake stage',
      '',
      'Client was informed of 24-hour follow-up and urgent live chat availability.',
    ];

    const subject = encodeURIComponent(`Recovery Intake - ${selectedScamType} - ${data.firstName} ${data.lastName}`);
    const body = encodeURIComponent(lines.join('\n'));

    setSubmitted(true);

    const mailtoUrl = `mailto:${RECOVERY_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-success-500/25 bg-success-500/10 p-7 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-success-500" />
          <div>
            <p className="text-lg font-semibold text-gray-900">Intake drafted successfully</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              We will reach out within 24 hours to gather additional information and scam proof,
              then keep regular communication with you throughout the recovery process.
            </p>
            <p className="mt-2 text-sm font-medium text-primary-700">
              If your case is urgent, use our live chat immediately so we can respond faster.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-primary-100 bg-white p-5 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-900">Secure Scam Intake Form</h3>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">Step {step} of 3</span>
      </div>

      <div className="mb-7 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((stepValue) => (
          <div key={stepValue} className={`h-1.5 rounded-full ${stepValue <= step ? 'bg-primary-600' : 'bg-gray-100'}`} />
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-4">
          <p className="text-sm text-gray-600">Select the fraud type closest to your case.</p>

          <div className="grid gap-2 sm:grid-cols-2">
            {scamTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => update('scamType', type)}
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
          {errors.scamType && <p className="text-sm text-error-500">{errors.scamType}</p>}

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                placeholder="Example: AI impersonation extortion"
              />
              {errors.otherScamType && <p className="mt-1 text-sm text-error-500">{errors.otherScamType}</p>}
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              {errors.amountLost && <p className="mt-1 text-sm text-error-500">{errors.amountLost}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="incidentDate">
                Incident date
              </label>
              <input
                id="incidentDate"
                type="date"
                value={data.incidentDate}
                onChange={(e) => update('incidentDate', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              {errors.incidentDate && <p className="mt-1 text-sm text-error-500">{errors.incidentDate}</p>}
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
            {errors.country && <p className="mt-1 text-sm text-error-500">{errors.country}</p>}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">How did the scammer contact you?</p>
            <div className="flex flex-wrap gap-2">
              {channelOptions.map((channel) => {
                const selected = data.contactChannels.includes(channel);
                return (
                  <button
                    type="button"
                    key={channel}
                    onClick={() => toggleFromList('contactChannels', channel)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    {channel}
                  </button>
                );
              })}
            </div>
            {errors.contactChannels && <p className="mt-1 text-sm text-error-500">{errors.contactChannels}</p>}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">What payment method was used?</p>
            <div className="flex flex-wrap gap-2">
              {paymentOptions.map((method) => {
                const selected = data.paymentMethods.includes(method);
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => toggleFromList('paymentMethods', method)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
            {errors.paymentMethods && <p className="mt-1 text-sm text-error-500">{errors.paymentMethods}</p>}
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="reportStatus">
                Already reported? (optional)
              </label>
              <select
                id="reportStatus"
                value={data.reportStatus}
                onChange={(e) => update('reportStatus', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select status</option>
                <option value="Not reported yet">Not reported yet</option>
                <option value="Reported to bank/payment provider">Reported to bank/payment provider</option>
                <option value="Reported to law enforcement">Reported to law enforcement</option>
                <option value="Reported to both">Reported to both</option>
              </select>
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
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
                value={data.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              {errors.firstName && <p className="mt-1 text-sm text-error-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={data.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              {errors.lastName && <p className="mt-1 text-sm text-error-500">{errors.lastName}</p>}
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
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="phone">
                Phone / WhatsApp (optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="Include country code"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select</option>
                <option value="Email">Email</option>
                <option value="Phone call">Phone call</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
            {errors.caseSummary && <p className="mt-1 text-sm text-error-500">{errors.caseSummary}</p>}
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
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
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300"
              checked={data.consent}
              onChange={(e) => update('consent', e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              I confirm the information is accurate to the best of my knowledge and I consent to being contacted
              for recovery support updates.
            </span>
          </label>
          {errors.consent && <p className="text-sm text-error-500">{errors.consent}</p>}
        </section>
      )}

      <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-start gap-2 rounded-xl border border-warning-500/20 bg-warning-500/10 px-3 py-2 text-xs text-gray-700">
          <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-500" />
          <p>
            Urgent case? Use our live chat for immediate support while this form is being reviewed.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end">
          {step > 1 && (
            <button
              type="button"
              onClick={previousStep}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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
              className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-600"
            >
              Submit via Email
              <MessageCircleMore className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
