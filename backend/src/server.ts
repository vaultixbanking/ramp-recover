import { createApp } from './app.js';
import { createCaseStore, createDb } from './db/client.js';
import { createMailer } from './email/mailer.js';
import { loadEnv } from './env.js';
import { createEvidenceStorage } from './storage/evidence.js';

const env = loadEnv();
const database = createDb(env.DATABASE_URL);

const app = createApp(
  {
    corsOrigins: env.CORS_ORIGINS,
    teamInbox: env.TEAM_INBOX,
    siteUrl: env.SITE_URL,
    rateLimit: { windowMs: 15 * 60 * 1000, limit: 5 },
  },
  {
    cases: createCaseStore(database.db),
    evidence: createEvidenceStorage(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, env.EVIDENCE_BUCKET),
    mailer: createMailer(env.RESEND_API_KEY, env.EMAIL_FROM),
  },
);

const server = app.listen(env.PORT, () => {
  console.log(`Ramp Recover backend listening on port ${env.PORT}`);
});

function shutdown() {
  server.close(() => {
    void database.close().finally(() => process.exit(0));
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
