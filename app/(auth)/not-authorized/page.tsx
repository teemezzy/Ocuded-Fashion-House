import Link from "next/link";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/admin/SignOutButton";

export default function NotAuthorizedPage() {
  return (
    <div className="bg-bg rounded-[16px] p-[36px] text-center shadow-[0_20px_60px_rgba(46,33,26,0.35)]">
      <div className="flex justify-center mb-[18px]">
        <Logo size={44} />
      </div>
      <h1 className="font-serif text-[24px] text-ink">Not authorised</h1>
      <p className="text-[13.5px] text-muted mt-[8px] mb-[24px] leading-[1.7]">
        This Google account isn&rsquo;t on the admin whitelist. If you believe
        this is a mistake, ask the studio owner to add your email.
      </p>
      <div className="flex items-center justify-center gap-[14px]">
        <SignOutButton showLabel />
        <Link
          href="/"
          className="text-[12px] tracking-[0.1em] uppercase text-rust hover:text-rust-dark transition-colors"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}
