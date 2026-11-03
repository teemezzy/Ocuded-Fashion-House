"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { adminSettingsDefault, formatDate, formatMoney } from "@/lib/adminData";
import AnimatedScript from "./AnimatedScript";
import type { BookingSelection } from "./BookingStep";

export default function ConfirmedStep({
  selection,
  name,
  amount,
}: {
  selection: BookingSelection;
  name: string;
  amount?: number;
}) {
  const first = name ? name.trim().split(" ")[0] : "";

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-[24px] py-[48px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_62%,#3F2413)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />

      <div className="relative max-w-[560px] text-bg w-full">
        <div className="flex justify-center mb-[20px]">
          <Logo size={50} color="#F1E7D3" />
        </div>

        <AnimatedScript
          text={
            first ? `${first}, you're all booked!` : "You're all booked!"
          }
          className="font-script text-clay-light text-[clamp(1.35rem,5.2vw,3.4rem)] leading-[1.15] block whitespace-nowrap"
          charDelay={58}
        />

        <p className="text-[15px] leading-[1.8] text-[rgba(251,246,238,0.85)] font-light mt-[16px] mb-[28px]">
          Your consultation is confirmed. We&rsquo;ve sent the details to your
          email and we can&rsquo;t wait to meet you.
        </p>

        <div className="bg-bg/10 border border-bg/20 rounded-[14px] p-[22px] text-left backdrop-blur-sm">
          <DetailRow label="Date" value={formatDate(selection.date)} />
          <DetailRow label="Time" value={selection.time} />
          <DetailRow label="Format" value={selection.type} />
          <DetailRow
            label="Paid"
            value={formatMoney(amount ?? adminSettingsDefault.consultationPrice)}
          />
          <div className="mt-[14px] pt-[14px] border-t border-bg/20 text-[13px] text-[rgba(251,246,238,0.85)] leading-[1.6]">
            {selection.type === "Virtual" ? (
              <>A Google Meet link has been sent to your email for the session.</>
            ) : (
              <>
                We&rsquo;ll see you at our studio:
                <br />
                {adminSettingsDefault.studioAddress}
              </>
            )}
          </div>
        </div>

        <Link
          href="/"
          className="inline-block mt-[30px] bg-clay text-[#3A2213] text-[13px] tracking-[0.18em] uppercase px-[30px] py-[15px] rounded-[10px] hover:bg-clay-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[7px]">
      <span className="text-[12px] tracking-[0.1em] uppercase text-[rgba(251,246,238,0.6)]">
        {label}
      </span>
      <span className="text-[14px] text-bg">{value}</span>
    </div>
  );
}
