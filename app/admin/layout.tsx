import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "O_Cubed — Admin",
  description: "O_Cubed Fashion House admin dashboard.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email: string | null = null;

  // Auth gate: only enforced when Supabase is configured.
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/admin");

    email = user.email ?? null;

    // Email must be on the whitelist.
    const db = hasServiceRole ? createServiceClient() : supabase;
    const { data: allowed } = await db
      .from("allowed_admins")
      .select("email")
      .ilike("email", email ?? "")
      .maybeSingle();
    if (!allowed) redirect("/not-authorized");
  }

  return (
    <AdminShell email={email} authEnabled={isSupabaseConfigured}>
      {children}
    </AdminShell>
  );
}
