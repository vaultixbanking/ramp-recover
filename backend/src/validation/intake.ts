import { z } from 'zod';

// Keep these lists and messages in sync with src/app/components/ContactIntakeForm.tsx in the website.
export const SCAM_TYPES = [
  'Crypto Scam',
  'Investment Scam',
  'Romance Scam',
  'Business Email Compromise',
  'Account Takeover',
  'Phishing',
  'Fake Loan / Advance Fee',
  'Marketplace / Payment Scam',
  'Other',
] as const;
export const CONTACT_CHANNELS = ['WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'Email', 'Phone Call', 'SMS', 'Dating App'] as const;
export const PAYMENT_METHODS = ['Bank Transfer', 'Debit/Credit Card', 'Crypto Wallet', 'Gift Card', 'Wire Transfer', 'Cash'] as const;
export const REPORT_STATUSES = [
  'Not reported yet',
  'Reported to bank/payment provider',
  'Reported to law enforcement',
  'Reported to both',
] as const;
export const PREFERRED_CONTACTS = ['Email', 'Phone call', 'WhatsApp'] as const;

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
// Checked against each file's real contents, not its name.
export const EVIDENCE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const optionalText = (max: number) => text(max).optional().default('');
const optionalChoice = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal('')]).optional().default('');

function isFutureDate(isoDate: string) {
  // One day of slack so "today" is accepted for people in timezones ahead of UTC.
  const latest = new Date();
  latest.setUTCDate(latest.getUTCDate() + 1);
  return isoDate > latest.toISOString().slice(0, 10);
}

export const intakeSchema = z
  .object({
    scamType: z.enum(SCAM_TYPES, 'Choose the closest scam category.'),
    otherScamType: optionalText(150),
    amountLost: text(60).min(1, 'Enter amount lost (estimate is okay).'),
    incidentDate: z.iso
      .date('Select when this happened.')
      .refine((value) => !isFutureDate(value), 'The incident date cannot be in the future.'),
    country: text(100).min(1, 'Country helps us guide reporting channels.'),
    contactChannels: z
      .array(z.enum(CONTACT_CHANNELS))
      .min(1, 'Select at least one contact method used by the scammer.')
      .max(CONTACT_CHANNELS.length),
    paymentMethods: z
      .array(z.enum(PAYMENT_METHODS))
      .min(1, 'Select at least one payment method used.')
      .max(PAYMENT_METHODS.length),
    institutionName: optionalText(150),
    reportStatus: optionalChoice(REPORT_STATUSES),
    referenceId: optionalText(150),
    firstName: text(100).min(1, 'First name is required.'),
    lastName: text(100).min(1, 'Last name is required.'),
    email: z.string().trim().max(254).pipe(z.email('Enter a valid email address.')),
    phone: optionalText(40),
    preferredContact: optionalChoice(PREFERRED_CONTACTS),
    timezone: optionalText(60),
    bestTimeToReach: optionalText(100),
    caseSummary: text(5000).min(40, 'Add a bit more detail (minimum 40 characters).'),
    evidenceDetails: optionalText(3000),
    consent: z.literal(true, 'You must consent before submission.'),
  })
  .superRefine((data, ctx) => {
    if (data.scamType === 'Other' && !data.otherScamType) {
      ctx.addIssue({ code: 'custom', path: ['otherScamType'], message: 'Please describe your scam type.' });
    }
  });

export type IntakeInput = z.infer<typeof intakeSchema>;

/** First error message per top-level field, keyed like the website form's fields. */
export function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    fields[key] ??= issue.message;
  }
  return fields;
}

export function scamTypeLabel(input: Pick<IntakeInput, 'scamType' | 'otherScamType'>) {
  return input.scamType === 'Other' ? `Other: ${input.otherScamType}` : input.scamType;
}
