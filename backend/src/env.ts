import { z } from 'zod';

const list = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  // Keep only https://<project>.supabase.co, in case a path such as /rest/v1/ was pasted with it.
  SUPABASE_URL: z.url().transform((url) => new URL(url).origin),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  EVIDENCE_BUCKET: z.string().min(1).default('case-evidence'),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  TEAM_INBOX: z.string().transform(list).pipe(z.array(z.email()).min(1)),
  CORS_ORIGINS: z.string().transform(list).pipe(z.array(z.url()).min(1)),
  SITE_URL: z
    .url()
    .transform((url) => url.replace(/\/+$/, ''))
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  // Local development reads backend/.env; Render/Railway inject variables directly.
  try {
    process.loadEnvFile();
  } catch {
    // No .env file: rely on the process environment.
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment variables (see backend/.env.example):\n${problems.join('\n')}`);
  }
  return parsed.data;
}
