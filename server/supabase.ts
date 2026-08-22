import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let isSupabaseConfigured = false;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      isSupabaseConfigured = true;
      console.log('✅ Supabase PostgreSQL and Storage connected successfully.');
    } catch (err) {
      console.error('⚠️ Failed to initialize Supabase client:', err);
    }
  }

  return supabaseClient;
}

export function isSupabaseActive(): boolean {
  return !!getSupabase();
}

/**
 * Upload file buffer directly to Supabase Storage
 */
export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg',
  bucketName: string = 'blackgold-assets'
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    // Ensure bucket exists or attempt upload
    const { data, error } = await sb.storage.from(bucketName).upload(filename, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      // Try fallback to product-images
      const fallbackUpload = await sb.storage.from('product-images').upload(filename, buffer, {
        contentType,
        upsert: true,
      });

      if (fallbackUpload.error) {
        console.error('Supabase storage upload error:', error);
        return null;
      }

      const { data: publicUrlData } = sb.storage.from('product-images').getPublicUrl(filename);
      return publicUrlData?.publicUrl || null;
    }

    const { data: publicUrlData } = sb.storage.from(bucketName).getPublicUrl(filename);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Supabase storage exception:', err);
    return null;
  }
}
