"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured yet. Add your keys to .env.local.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg rounded-[16px] p-[36px] text-center shadow-[0_20px_60px_rgba(46,33,26,0.35)]">
      <div className="flex justify-center mb-[18px]">
        <Logo size={44} />
      </div>
      <h1 className="font-serif text-[24px] text-ink">O_Cubed Admin</h1>
      <p className="text-[13.5px] text-muted mt-[6px] mb-[26px]">
        Sign in with your authorised Google account.
      </p>

      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-[10px] border border-ink/15 rounded-[10px] px-[18px] py-[13px] text-[14px] text-ink hover:border-rust hover:bg-rust/[0.03] transition-colors disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13.3 17.6 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.1-3.8 6.5-9.4 6.5-16z" />
          <path fill="#FBBC05" d="M10.4 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.8-6.1C.9 16.8 0 20.3 0 24s.9 7.2 2.6 10.4l7.8-6.1z" />
          <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.1-5.5c-2 1.4-4.6 2.2-7.9 2.2-6.4 0-11.8-3.8-13.6-9.3l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>

      {error && <p className="text-[12.5px] text-rust mt-[14px]">{error}</p>}

      <p className="text-[11.5px] text-muted/70 mt-[22px] leading-[1.6]">
        Access is restricted to whitelisted emails.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
