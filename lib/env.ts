/** True when the Supabase environment variables are present.
 *  When false, the app gracefully falls back to in-memory mock data and
 *  the admin auth gate is skipped (dev convenience). */
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** True when a Paystack secret key is present. When false, the payment step
 *  runs in demo mode (no real charge). */
export const isPaystackConfigured = !!process.env.PAYSTACK_SECRET_KEY;
