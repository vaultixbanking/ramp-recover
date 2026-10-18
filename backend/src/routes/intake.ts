import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { fileTypeFromBuffer } from 'file-type';
import multer from 'multer';
import type { AppConfig, AppDeps } from '../app.js';
import { clientConfirmation, teamNotification, type FileLink } from '../email/templates.js';
import { createReference } from '../lib/reference.js';
import {
  EVIDENCE_MIME_TYPES,
  MAX_FILE_BYTES,
  MAX_FILES,
  fieldErrors,
  intakeSchema,
} from '../validation/intake.js';

const SIGNED_LINK_SECONDS = 7 * 24 * 60 * 60;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES, fields: 5, fieldSize: 100 * 1024 },
}).array('files', MAX_FILES);

const FILE_LIMIT_MESSAGES: Partial<Record<multer.ErrorCode, string>> = {
  LIMIT_FILE_SIZE: 'Each file must be 10 MB or smaller.',
  LIMIT_FILE_COUNT: `You can upload up to ${MAX_FILES} files.`,
  LIMIT_UNEXPECTED_FILE: `You can upload up to ${MAX_FILES} files.`,
};

function parseMultipart(req: Request, res: Response) {
  return new Promise<void>((resolve, reject) => {
    upload(req, res, (error: unknown) => (error ? reject(error) : resolve()));
  });
}

const validationError = (fields: Record<string, string>) => ({ ok: false, error: 'validation', fields });

/** Storage-safe file name: keeps letters, numbers, dots and dashes. */
function safeFileName(originalName: string, extension: string) {
  const base = originalName
    .replace(/\.[^.]*$/, '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'file'}.${extension}`;
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function intakeRouter(config: AppConfig, deps: AppDeps) {
  const router = Router();

  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ ok: false, error: 'rate_limited' });
    },
  });

  router.post('/', limiter, async (req, res) => {
    try {
      await parseMultipart(req, res);
    } catch (error) {
      if (error instanceof multer.MulterError) {
        res.status(400).json(validationError({ files: FILE_LIMIT_MESSAGES[error.code] ?? 'Those files could not be read.' }));
        return;
      }
      throw error;
    }

    let raw: unknown;
    try {
      raw = JSON.parse(String(req.body?.data ?? ''));
    } catch {
      res.status(400).json({ ok: false, error: 'invalid_request' });
      return;
    }

    // Honeypot: real visitors never see the "website" field, bots fill it in. Pretend it worked.
    const honeypot = (raw as { website?: unknown } | null)?.website;
    if (typeof honeypot === 'string' && honeypot.trim()) {
      res.status(201).json({ ok: true, reference: createReference(), filesUploaded: 0, filesFailed: 0, confirmationSent: true });
      return;
    }

    const parsed = intakeSchema.safeParse(raw);
    if (!parsed.success) {
      res.status(400).json(validationError(fieldErrors(parsed.error)));
      return;
    }
    const input = parsed.data;

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const checked = await Promise.all(files.map(async (file) => ({ file, type: await fileTypeFromBuffer(file.buffer) })));
    const rejected = checked.find(({ type }) => !type || !EVIDENCE_MIME_TYPES.includes(type.mime));
    if (rejected) {
      res.status(400).json(
        validationError({
          files: `"${rejected.file.originalname}" isn't a supported file. Use JPG, PNG, WebP, HEIC or PDF.`,
        }),
      );
      return;
    }

    // Save the case before anything else, so the lead is kept even if uploads or emails fail.
    const { id, reference } = await deps.cases.create(input);

    const uploaded: { name: string; path: string }[] = [];
    let filesFailed = 0;
    for (const { file, type } of checked) {
      const path = `${reference}/${randomUUID()}-${safeFileName(file.originalname, type!.ext)}`;
      try {
        await deps.evidence.upload(path, file.buffer, type!.mime);
        await deps.cases.addAttachment({
          caseId: id,
          storagePath: path,
          originalName: file.originalname,
          mimeType: type!.mime,
          sizeBytes: file.size,
        });
        uploaded.push({ name: file.originalname, path });
      } catch (error) {
        filesFailed += 1;
        console.error(`[intake ${reference}] file upload failed: ${errorMessage(error)}`);
      }
    }

    let links: FileLink[] = uploaded.map(({ name }) => ({ name, url: '' }));
    if (uploaded.length) {
      try {
        const urls = await deps.evidence.signedUrls(uploaded.map(({ path }) => path), SIGNED_LINK_SECONDS);
        links = uploaded.map(({ name }, index) => ({ name, url: urls[index] ?? '' }));
      } catch (error) {
        console.error(`[intake ${reference}] signed links failed: ${errorMessage(error)}`);
      }
    }

    const team = teamNotification(input, reference, links, filesFailed);
    const client = clientConfirmation(input, reference, uploaded.length, filesFailed, config.siteUrl);
    const [teamResult, clientResult] = await Promise.allSettled([
      deps.mailer.send({ to: config.teamInbox, replyTo: input.email, idempotencyKey: `${reference}-team`, ...team }),
      deps.mailer.send({ to: [input.email], replyTo: config.teamInbox, idempotencyKey: `${reference}-client`, ...client }),
    ]);

    const emailErrors = [
      teamResult.status === 'rejected' ? `team: ${errorMessage(teamResult.reason)}` : '',
      clientResult.status === 'rejected' ? `client: ${errorMessage(clientResult.reason)}` : '',
    ].filter(Boolean);
    if (emailErrors.length) {
      console.error(`[intake ${reference}] email failed: ${emailErrors.join('; ')}`);
    }

    try {
      await deps.cases.recordEmails(id, {
        teamEmailSentAt: teamResult.status === 'fulfilled' ? new Date() : null,
        clientEmailSentAt: clientResult.status === 'fulfilled' ? new Date() : null,
        emailError: emailErrors.join('; ') || null,
      });
    } catch (error) {
      console.error(`[intake ${reference}] could not record email status: ${errorMessage(error)}`);
    }

    res.status(201).json({
      ok: true,
      reference,
      filesUploaded: uploaded.length,
      filesFailed,
      confirmationSent: clientResult.status === 'fulfilled',
    });
  });

  return router;
}
