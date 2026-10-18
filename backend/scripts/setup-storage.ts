// Creates (or updates) the private Supabase Storage bucket for evidence files. Safe to run again.
import { loadEnv } from '../src/env.js';
import { createSupabaseAdmin } from '../src/storage/evidence.js';
import { EVIDENCE_MIME_TYPES, MAX_FILE_BYTES } from '../src/validation/intake.js';

const env = loadEnv();
const { storage } = createSupabaseAdmin(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const bucket = env.EVIDENCE_BUCKET;
const options = { public: false, fileSizeLimit: MAX_FILE_BYTES, allowedMimeTypes: EVIDENCE_MIME_TYPES };

const existing = await storage.getBucket(bucket);
const { error } = existing.data ? await storage.updateBucket(bucket, options) : await storage.createBucket(bucket, options);

if (error) {
  console.error(`Could not set up bucket "${bucket}": ${error.message}`);
  process.exit(1);
}
console.log(`Bucket "${bucket}" is ready (private, ${MAX_FILE_BYTES / 1024 / 1024} MB per file).`);
