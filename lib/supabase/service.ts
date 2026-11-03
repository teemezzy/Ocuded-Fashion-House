import { createClient } from "@supabase/supabase-js";

/** Privileged server-only client using the service-role key.
 *  Bypasses RLS — never import this into client code. */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
