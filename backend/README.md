# Ramp Recover backend

Node.js + TypeScript API for the website's case intake form.

For every submission it:
- saves the case in **Supabase Postgres**;
- stores any evidence files in a private **Supabase Storage** bucket;
- emails the team and the client through **Resend**.

## Setup

Requires Node 22 or newer.

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values (see below)
npm run db:migrate        # creates the intake_cases and intake_attachments tables
npm run setup:storage     # creates the private "case-evidence" bucket
npm run dev               # http://localhost:4000
```

Run the website alongside it (`npm run dev` in the project root). The form posts to `NEXT_PUBLIC_API_URL`, which defaults to `http://localhost:4000`.

## Environment variables

| Variable | Where to find it |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string → **Session pooler** |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API. The service role key is secret: backend only. |
| `EVIDENCE_BUCKET` | Storage bucket name (default `case-evidence`) |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | Sender on your verified Resend domain, e.g. `Ramp Recover <recover@getfinora.org>` |
| `TEAM_INBOX` | Where new-case emails go; comma-separated for several |
| `CORS_ORIGINS` | Website origins allowed to submit, e.g. `https://ramp-recover.getfinora.org` |
| `SITE_URL` | Public website URL, used for the logo and live chat link in emails (optional) |

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start with auto-reload |
| `npm run build` / `npm start` | Compile to `dist/` and run it (production) |
| `npm test` | API tests with stand-in database, storage and email services |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Create a new migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to the database in `DATABASE_URL` |
| `npm run setup:storage` | Create or update the evidence bucket (safe to re-run) |

## API

### `POST /api/intake`

The request is `multipart/form-data` with two fields:
- `data`: the form fields as a JSON string.
- `files`: 0–5 evidence files. Each must be 10 MB or smaller and one of JPG, PNG, WebP, HEIC or PDF. The type is checked from the file contents, not the file name.

| Status | Body |
|---|---|
| `201` | `{ ok: true, reference: "RR-7KQ4MZ", filesUploaded, filesFailed, confirmationSent }` |
| `400` | `{ ok: false, error: "validation", fields: { email: "Enter a valid email address." } }` |
| `403` | Request came from a website not in `CORS_ORIGINS` |
| `429` | More than 5 submissions from one IP in 15 minutes |
| `500` | Unexpected server error |

The case is saved first, so it is kept even if an upload or email fails. Upload failures are counted in `filesFailed`. Email results are recorded in `team_email_sent_at`, `client_email_sent_at` and `email_error`.

### `GET /health`

Returns `{ ok: true }`, for uptime checks.

## Viewing cases

Use the Supabase dashboard:
- **Table Editor → `intake_cases`:** the cases themselves. Attachments are in `intake_attachments`.
- **Storage → `case-evidence`:** the files, grouped by case reference.

Both tables have row-level security turned on with no policies, so Supabase's public API keys can't read them.

To find cases whose team email failed:

```sql
select reference, created_at, email_error from intake_cases where team_email_sent_at is null;
```

## Deploying (Render or Railway)

1. Create a new web service from this repo, with root directory `backend`.
2. Set the build command to `npm ci && npm run build` and the start command to `npm start`.
3. Set the health check path to `/health`.
4. Add the environment variables above. `PORT` is set by the platform.
5. Run migrations: set `npm run db:migrate` as the pre-deploy command, or run it once from your machine against the production `DATABASE_URL`.
6. On the website host, set `NEXT_PUBLIC_API_URL` to this service's public URL. Make sure `CORS_ORIGINS` includes the website's domain.
