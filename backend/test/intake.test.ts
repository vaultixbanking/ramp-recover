import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, type AppConfig } from '../src/app.js';
import type { CaseStore } from '../src/db/client.js';
import type { Mailer } from '../src/email/mailer.js';
import type { EvidenceStorage } from '../src/storage/evidence.js';

// 1x1 transparent PNG.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

const ORIGIN = 'http://localhost:3000';

const validData = {
  scamType: 'Crypto Scam',
  otherScamType: '',
  amountLost: '$12,500',
  incidentDate: '2026-09-01',
  country: 'United States',
  contactChannels: ['Telegram'],
  paymentMethods: ['Crypto Wallet'],
  institutionName: '',
  reportStatus: '',
  referenceId: '',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '',
  preferredContact: 'Email',
  timezone: '',
  bestTimeToReach: '',
  caseSummary: 'A fake trading platform showed profits but blocked every withdrawal and demanded fees.',
  evidenceDetails: '',
  consent: true,
  website: '',
};

function setup(rateLimit = { windowMs: 60_000, limit: 100 }) {
  const cases = {
    create: vi.fn<CaseStore['create']>(async () => ({ id: 'case-1', reference: 'RR-TEST22' })),
    addAttachment: vi.fn<CaseStore['addAttachment']>(async () => {}),
    recordEmails: vi.fn<CaseStore['recordEmails']>(async () => {}),
  };
  const evidence = {
    upload: vi.fn<EvidenceStorage['upload']>(async () => {}),
    signedUrls: vi.fn<EvidenceStorage['signedUrls']>(async (paths) => paths.map((path) => `https://files.test/${path}`)),
  };
  const mailer = { send: vi.fn<Mailer['send']>(async () => {}) };
  const config: AppConfig = { corsOrigins: [ORIGIN], teamInbox: ['team@ramprecover.com'], rateLimit };
  const app = createApp(config, { cases, evidence, mailer });
  return { app, cases, evidence, mailer };
}

function submit(app: ReturnType<typeof setup>['app'], data: object, files: { name: string; body: Buffer }[] = []) {
  const req = request(app).post('/api/intake').set('Origin', ORIGIN).field('data', JSON.stringify(data));
  for (const file of files) req.attach('files', file.body, file.name);
  return req;
}

describe('POST /api/intake', () => {
  let ctx: ReturnType<typeof setup>;
  beforeEach(() => {
    ctx = setup();
  });

  it('stores a valid case, uploads files and sends both emails', async () => {
    const res = await submit(ctx.app, validData, [{ name: 'receipt.png', body: PNG }]);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, reference: 'RR-TEST22', filesUploaded: 1, filesFailed: 0, confirmationSent: true });
    expect(ctx.cases.create).toHaveBeenCalledOnce();
    expect(ctx.evidence.upload).toHaveBeenCalledWith(expect.stringMatching(/^RR-TEST22\/.+-receipt\.png$/), expect.any(Buffer), 'image/png');
    expect(ctx.cases.addAttachment).toHaveBeenCalledWith(expect.objectContaining({ caseId: 'case-1', mimeType: 'image/png', originalName: 'receipt.png' }));

    const [team, client] = ctx.mailer.send.mock.calls.map(([email]) => email);
    expect(team).toMatchObject({ to: ['team@ramprecover.com'], replyTo: 'jane@example.com' });
    expect(team!.html).toContain('https://files.test/RR-TEST22/');
    expect(client).toMatchObject({ to: ['jane@example.com'], subject: 'We received your case (RR-TEST22)' });
    expect(client!.text).toContain('We will never ask for your passwords, seed phrases, or payment in crypto or gift cards.');
    expect(ctx.cases.recordEmails).toHaveBeenCalledWith('case-1', expect.objectContaining({ emailError: null }));
  });

  it('escapes HTML typed by the client in the team email', async () => {
    await submit(ctx.app, { ...validData, firstName: '<script>alert(1)</script>' });
    const [team] = ctx.mailer.send.mock.calls.map(([email]) => email);
    expect(team!.html).not.toContain('<script>');
    expect(team!.html).toContain('&lt;script&gt;');
  });

  it('returns field errors for invalid input and stores nothing', async () => {
    const res = await submit(ctx.app, { ...validData, email: 'not-an-email', caseSummary: 'too short', consent: false });

    expect(res.status).toBe(400);
    expect(res.body.fields).toMatchObject({
      email: 'Enter a valid email address.',
      caseSummary: 'Add a bit more detail (minimum 40 characters).',
      consent: 'You must consent before submission.',
    });
    expect(ctx.cases.create).not.toHaveBeenCalled();
  });

  it('rejects incident dates in the future', async () => {
    const res = await submit(ctx.app, { ...validData, incidentDate: '2999-01-01' });
    expect(res.status).toBe(400);
    expect(res.body.fields.incidentDate).toBe('The incident date cannot be in the future.');
  });

  it('requires a description when the scam type is Other', async () => {
    const res = await submit(ctx.app, { ...validData, scamType: 'Other', otherScamType: '' });
    expect(res.status).toBe(400);
    expect(res.body.fields.otherScamType).toBe('Please describe your scam type.');
  });

  it('pretends to succeed for bots that fill the honeypot', async () => {
    const res = await submit(ctx.app, { ...validData, website: 'https://spam.example' });
    expect(res.status).toBe(201);
    expect(ctx.cases.create).not.toHaveBeenCalled();
    expect(ctx.mailer.send).not.toHaveBeenCalled();
  });

  it('rejects a file whose contents are not an allowed type, whatever its name', async () => {
    const res = await submit(ctx.app, validData, [{ name: 'photo.png', body: Buffer.from('MZ fake executable contents') }]);
    expect(res.status).toBe(400);
    expect(res.body.fields.files).toContain('photo.png');
    expect(ctx.cases.create).not.toHaveBeenCalled();
  });

  it('rejects more than 5 files', async () => {
    const files = Array.from({ length: 6 }, (_, i) => ({ name: `f${i}.png`, body: PNG }));
    const res = await submit(ctx.app, validData, files);
    expect(res.status).toBe(400);
    expect(res.body.fields.files).toBe('You can upload up to 5 files.');
  });

  it('still succeeds when an email fails, and records the error', async () => {
    ctx.mailer.send.mockRejectedValueOnce(new Error('Resend down'));
    const res = await submit(ctx.app, validData);

    expect(res.status).toBe(201);
    expect(ctx.cases.recordEmails).toHaveBeenCalledWith(
      'case-1',
      expect.objectContaining({ teamEmailSentAt: null, emailError: expect.stringContaining('Resend down') }),
    );
  });

  it('still succeeds when a file upload fails, and reports it', async () => {
    ctx.evidence.upload.mockRejectedValueOnce(new Error('storage down'));
    const res = await submit(ctx.app, validData, [{ name: 'receipt.png', body: PNG }]);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ filesUploaded: 0, filesFailed: 1 });
    expect(ctx.cases.addAttachment).not.toHaveBeenCalled();
  });

  it('refuses posts from other websites', async () => {
    const res = await request(ctx.app)
      .post('/api/intake')
      .set('Origin', 'https://evil.example')
      .field('data', JSON.stringify(validData));
    expect(res.status).toBe(403);
    expect(ctx.cases.create).not.toHaveBeenCalled();
  });

  it('rate limits after 5 submissions', async () => {
    const limited = setup({ windowMs: 60_000, limit: 5 });
    for (let i = 0; i < 5; i += 1) {
      expect((await submit(limited.app, { ...validData, website: 'bot' })).status).toBe(201);
    }
    const res = await submit(limited.app, validData);
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ ok: false, error: 'rate_limited' });
  });
});

describe('GET /health', () => {
  it('responds ok', async () => {
    const res = await request(setup().app).get('/health');
    expect(res.body).toEqual({ ok: true });
  });
});
