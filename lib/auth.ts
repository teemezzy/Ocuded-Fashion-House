import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/env";

/** Returns the signed-in admin's email, or null if not an authorised admin.
 *  When Supabase isn't configured, returns a dev placeholder so the app is
 *  usable locally without auth. */
export async function getAdminEmail(): Promise<string | null> {
  if (!isSupabaseConfigured) return "dev@local";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email;
  if (!email) return null;

  // Prefer the service-role client so the whitelist check bypasses RLS and is
  // deterministic. Match case-insensitively to avoid casing mismatches.
  const db = hasServiceRole ? createServiceClient() : supabase;
  const { data } = await db
    .from("allowed_admins")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  return data ? email : null;
}
