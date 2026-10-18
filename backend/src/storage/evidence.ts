import { createClient } from '@supabase/supabase-js';

export interface EvidenceStorage {
  upload(path: string, body: Buffer, contentType: string): Promise<void>;
  /** Time-limited download links, in the same order as `paths`. */
  signedUrls(paths: string[], expiresInSeconds: number): Promise<string[]>;
}

export function createSupabaseAdmin(url: string, serviceRoleKey: string) {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createEvidenceStorage(supabaseUrl: string, serviceRoleKey: string, bucket: string): EvidenceStorage {
  const storage = createSupabaseAdmin(supabaseUrl, serviceRoleKey).storage.from(bucket);

  return {
    async upload(path, body, contentType) {
      const { error } = await storage.upload(path, body, { contentType, upsert: false });
      if (error) throw new Error(`Storage upload failed: ${error.message}`);
    },

    async signedUrls(paths, expiresInSeconds) {
      const { data, error } = await storage.createSignedUrls(paths, expiresInSeconds);
      if (error) throw new Error(`Signed URLs failed: ${error.message}`);
      return data.map((item) => item.signedUrl ?? '');
    },
  };
}
