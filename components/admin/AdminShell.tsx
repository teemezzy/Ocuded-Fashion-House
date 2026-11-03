"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import SignOutButton from "./SignOutButton";

export default function AdminShell({
  email,
  authEnabled,
  children,
}: {
  email: string | null;
  authEnabled: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-cream2">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 shadow-2xl">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <header className="h-[60px] sm:h-[64px] shrink-0 bg-bg border-b border-ink/10 flex items-center justify-between px-[16px] sm:px-[28px] gap-[12px]">
          <div className="flex items-center gap-[12px] min-w-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="lg:hidden -ml-[4px] w-[36px] h-[36px] flex flex-col items-center justify-center gap-[5px] rounded-[8px] hover:bg-ink/[0.04] transition-colors"
            >
              <span className="w-[20px] h-[1.5px] bg-ink block" />
              <span className="w-[20px] h-[1.5px] bg-ink block" />
              <span className="w-[20px] h-[1.5px] bg-ink block" />
            </button>
            <div className="font-serif text-[15px] sm:text-[18px] text-ink tracking-[0.02em] truncate">
              Fashion House Admin
            </div>
          </div>
          <div className="flex items-center gap-[10px] sm:gap-[14px]">
            <span className="text-[13px] text-muted hidden md:block max-w-[200px] truncate">
              {email ?? "Studio Manager"}
            </span>
            <div className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-rust text-bg font-serif text-[14px] flex items-center justify-center uppercase shrink-0">
              {(email ?? "O")[0]}
            </div>
            {authEnabled && <SignOutButton />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-[16px] sm:p-[28px]">
          {children}
        </main>
      </div>
    </div>
  );
}
