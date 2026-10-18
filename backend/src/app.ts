import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import type { CaseStore } from './db/client.js';
import type { Mailer } from './email/mailer.js';
import { intakeRouter } from './routes/intake.js';
import type { EvidenceStorage } from './storage/evidence.js';

export type AppConfig = {
  corsOrigins: string[];
  teamInbox: string[];
  siteUrl?: string;
  rateLimit: { windowMs: number; limit: number };
};

export type AppDeps = {
  cases: CaseStore;
  evidence: EvidenceStorage;
  mailer: Mailer;
};

export function createApp(config: AppConfig, deps: AppDeps) {
  const app = express();

  // Render and Railway sit behind one proxy; this makes req.ip the visitor's address for rate limiting.
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, methods: ['GET', 'POST'] }));

  // Multipart form posts skip the CORS preflight, so refuse other websites here.
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (req.method === 'POST' && origin && !config.corsOrigins.includes(origin)) {
      res.status(403).json({ ok: false, error: 'forbidden_origin' });
      return;
    }
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/intake', intakeRouter(config, deps));

  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: 'not_found' });
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error('[server] unhandled error:', error instanceof Error ? error.message : error);
    res.status(500).json({ ok: false, error: 'server' });
  };
  app.use(errorHandler);

  return app;
}
