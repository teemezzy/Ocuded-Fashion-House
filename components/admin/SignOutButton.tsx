"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({
  showLabel = false,
}: {
  showLabel?: boolean;
}) {
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-rust transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      aria-label="Sign out"
      title="Sign out"
      className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] text-muted hover:text-rust hover:bg-ink/[0.04] transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}
