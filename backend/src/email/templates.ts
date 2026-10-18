import { scamTypeLabel, type IntakeInput } from '../validation/intake.js';

export type FileLink = { name: string; url: string };

type RenderedEmail = { subject: string; html: string; text: string };

const COLORS = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  primaryBg: '#eff6ff',
  green: '#059669',
  greenBg: '#ecfdf5',
  amberBg: '#fffbeb',
  text: '#111827',
  muted: '#4b5563',
  border: '#e5e7eb',
  page: '#f9fafb',
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]!);
// Subjects must stay on one line whatever the client typed.
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();
const orDash = (value: string) => value || '—';

function layout(body: string, siteUrl?: string) {
  const brand = siteUrl
    ? `<img src="${escapeHtml(siteUrl)}/brand/ramp-recover-logo.png" alt="Ramp Recover" height="32" style="display:block;height:32px;width:auto;border:0">`
    : `<span style="font-size:20px;font-weight:700;color:${COLORS.text}">Ramp <span style="color:${COLORS.primary}">Recover</span></span>`;

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.page};font-family:${FONT};color:${COLORS.text}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${COLORS.primaryLight};border-radius:16px">
<tr><td style="padding:28px 28px 0">${brand}</td></tr>
<tr><td style="padding:24px 28px 28px;font-size:15px;line-height:1.6">${body}</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function rows(entries: [string, string][]) {
  const cells = entries
    .map(
      ([label, value]) =>
        `<tr><td width="170" style="width:170px;padding:6px 12px 6px 0;color:${COLORS.muted};font-size:13px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px;vertical-align:top">${escapeHtml(orDash(value))}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${cells}</table>`;
}

const heading = (title: string) =>
  `<h2 style="margin:24px 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:${COLORS.primary}">${escapeHtml(title)}</h2>`;

const textBlock = (value: string) =>
  `<div style="padding:12px 14px;background:${COLORS.page};border:1px solid ${COLORS.border};border-radius:10px;font-size:14px;white-space:pre-wrap">${escapeHtml(orDash(value))}</div>`;

export function teamNotification(input: IntakeInput, reference: string, files: FileLink[], filesFailed: number): RenderedEmail {
  const scamType = scamTypeLabel(input);
  const name = `${input.firstName} ${input.lastName}`;

  const incident: [string, string][] = [
    ['Scam type', scamType],
    ['Amount lost', input.amountLost],
    ['Incident date', input.incidentDate],
    ['Country', input.country],
    ['Scammer contacted via', input.contactChannels.join(', ')],
    ['Payment methods', input.paymentMethods.join(', ')],
    ['Platform / bank / wallet', input.institutionName],
    ['Already reported', input.reportStatus],
    ['Existing report ref', input.referenceId],
  ];
  const client: [string, string][] = [
    ['Name', name],
    ['Email', input.email],
    ['Phone / WhatsApp', input.phone],
    ['Preferred contact', input.preferredContact],
    ['Timezone', input.timezone],
    ['Best time to reach', input.bestTimeToReach],
  ];

  const failedNote = filesFailed > 0 ? `${filesFailed} file(s) failed to upload. Ask the client to resend them.` : '';
  const fileList = files.length
    ? `<ul style="margin:0;padding-left:18px">${files
        .map((file) =>
          file.url
            ? `<li><a href="${escapeHtml(file.url)}" style="color:${COLORS.primary}">${escapeHtml(file.name)}</a></li>`
            : `<li>${escapeHtml(file.name)}</li>`,
        )
        .join('')}</ul><p style="margin:8px 0 0;font-size:12px;color:${COLORS.muted}">Links expire in 7 days. Files are also in Supabase Storage under ${escapeHtml(reference)}/.</p>`
    : `<p style="margin:0;font-size:14px;color:${COLORS.muted}">No files uploaded.</p>`;

  const html = layout(
    `<p style="margin:0;font-size:13px;color:${COLORS.muted}">New recovery intake</p>
<h1 style="margin:4px 0 0;font-size:24px">Case ${escapeHtml(reference)}</h1>
<p style="margin:6px 0 0;color:${COLORS.muted}">${escapeHtml(scamType)} · ${escapeHtml(input.amountLost)} · ${escapeHtml(input.country)}</p>
${heading('Incident')}${rows(incident)}
${heading('Client')}${rows(client)}
${heading('Case summary')}${textBlock(input.caseSummary)}
${heading('Evidence notes')}${textBlock(input.evidenceDetails)}
${heading('Uploaded files')}${fileList}
${failedNote ? `<p style="margin:8px 0 0;padding:10px 12px;background:${COLORS.amberBg};border-radius:8px;font-size:13px">${escapeHtml(failedNote)}</p>` : ''}
<p style="margin:24px 0 0;font-size:13px;color:${COLORS.muted}">Reply to this email to contact ${escapeHtml(input.firstName)} directly.</p>`,
  );

  const text = [
    `New Scam Recovery Intake: ${reference}`,
    '',
    '--- INCIDENT ---',
    ...incident.map(([label, value]) => `${label}: ${orDash(value)}`),
    '',
    '--- CLIENT CONTACT ---',
    ...client.map(([label, value]) => `${label}: ${orDash(value)}`),
    '',
    '--- CASE SUMMARY ---',
    input.caseSummary,
    '',
    '--- EVIDENCE NOTES ---',
    orDash(input.evidenceDetails),
    '',
    '--- UPLOADED FILES (links expire in 7 days) ---',
    ...(files.length ? files.map((file) => `${file.name}: ${file.url || 'see Supabase Storage'}`) : ['None']),
    ...(failedNote ? ['', failedNote] : []),
    '',
    `Reply to this email to contact ${input.firstName} directly.`,
  ].join('\n');

  return {
    subject: oneLine(`New case ${reference} · ${scamType} · ${input.amountLost}`),
    html,
    text,
  };
}

// Same promise as the website's Risk Notice; helps clients spot people impersonating us.
const SAFETY_NOTE =
  'We will never ask for your passwords, seed phrases, or payment in crypto or gift cards. If someone claiming to be Ramp Recover does, it is not us.';

const NEXT_STEPS = [
  ['Case review within 24 hours', 'Our intake team reviews your report and flags urgent recovery opportunities.'],
  ['Evidence and proof request', 'We contact you for any additional files, such as screenshots, receipts and transaction records.'],
  ['Regular communication', 'You receive clear updates as we investigate and coordinate the recovery path.'],
] as const;

export function clientConfirmation(
  input: IntakeInput,
  reference: string,
  filesUploaded: number,
  filesFailed: number,
  siteUrl?: string,
): RenderedEmail {
  const filesNote = [
    filesUploaded > 0 ? `We received ${filesUploaded} file(s) with your case.` : '',
    filesFailed > 0 ? `${filesFailed} file(s) couldn't be uploaded; we'll ask you for them when we contact you.` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const liveChat = siteUrl
    ? `<a href="${escapeHtml(siteUrl)}" style="color:${COLORS.primary}">live chat on our website</a>`
    : 'live chat on our website';

  const html = layout(
    `<p style="margin:0">Hi ${escapeHtml(input.firstName)},</p>
<p style="margin:12px 0 0">Thank you for contacting Ramp Recover. We've received your case.</p>
<div style="margin:20px 0;padding:16px 18px;background:${COLORS.greenBg};border:1px solid #a7f3d0;border-radius:12px">
<p style="margin:0;font-size:13px;color:${COLORS.green}">Your case reference</p>
<p style="margin:4px 0 0;font-size:24px;font-weight:700;letter-spacing:.08em;font-family:Menlo,Consolas,monospace">${escapeHtml(reference)}</p>
<p style="margin:6px 0 0;font-size:13px;color:${COLORS.muted}">Please quote this reference whenever you contact us.</p>
</div>
${filesNote ? `<p style="margin:0 0 16px">${escapeHtml(filesNote)}</p>` : ''}
<p style="margin:0;font-weight:600">What happens next</p>
<ol style="margin:8px 0 0;padding-left:20px">
${NEXT_STEPS.map(([title, detail]) => `<li style="margin:0 0 8px"><strong>${title}.</strong> ${detail}</li>`).join('\n')}
</ol>
<div style="margin:20px 0 0;padding:12px 14px;background:${COLORS.amberBg};border-radius:10px;font-size:14px">
<strong>Is the scam still active?</strong> Use the ${liveChat} so our team can guide your next protective steps right away.
</div>
<p style="margin:20px 0 0">You can reply to this email to add details to your case.</p>
<p style="margin:16px 0 0;padding:12px 14px;background:${COLORS.primaryBg};border-radius:10px;font-size:14px"><strong>For your safety:</strong> ${SAFETY_NOTE}</p>
<p style="margin:20px 0 0;font-size:12px;color:${COLORS.muted}">Recovery outcomes vary by case complexity, traceability, and third-party cooperation. You're receiving this email because you submitted a case on the Ramp Recover website.</p>`,
    siteUrl,
  );

  const text = [
    `Hi ${input.firstName},`,
    '',
    "Thank you for contacting Ramp Recover. We've received your case.",
    '',
    `Your case reference: ${reference}`,
    'Please quote this reference whenever you contact us.',
    ...(filesNote ? ['', filesNote] : []),
    '',
    'What happens next:',
    ...NEXT_STEPS.map(([title, detail], index) => `${index + 1}. ${title}. ${detail}`),
    '',
    `Is the scam still active? Use the live chat on our website${siteUrl ? ` (${siteUrl})` : ''} so our team can guide your next protective steps right away.`,
    '',
    'You can reply to this email to add details to your case.',
    '',
    `For your safety: ${SAFETY_NOTE}`,
    '',
    'Recovery outcomes vary by case complexity, traceability, and third-party cooperation.',
  ].join('\n');

  return { subject: `We received your case (${reference})`, html, text };
}
