"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { adminSettingsDefault, formatDate, formatMoney } from "@/lib/adminData";
import type { BookingSelection } from "./BookingStep";

export default function PaymentStep({
  selection,
  name,
  email,
  onBack,
  onPaid,
}: {
  selection: BookingSelection;
  name: string;
  email: string;
  onBack: () => void;
  onPaid: () => void;
}) {
  const [processing, setProcessing] = useState(false);
  const fee = adminSettingsDefault.consultationPrice;

  const pay = () => {
    // Kicks off Paystack via the flow controller. In demo mode (no keys) it
    // falls through to the confirmation screen; with keys it redirects to pay.
    setProcessing(true);
    onPaid();
  };

  return (
    <div className="min-h-screen bg-cream2/40 px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
      <div className="max-w-[520px] mx-auto">
        <div className="flex items-center justify-between mb-[24px]">
          <div className="flex items-center gap-[10px]">
            <Logo size={26} />
            <span className="font-serif text-[16px] tracking-[0.2em] text-ink">
              O_CUBED
            </span>
          </div>
          {!processing && (
            <button
              onClick={onBack}
              className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-rust transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        <h1 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] text-ink leading-tight">
          Confirm &amp; pay
        </h1>
        <p className="text-[13.5px] text-muted mt-[4px] mb-[24px]">
          A consultation fee secures your session with the designer.
        </p>

        <div className="bg-bg border border-ink/10 rounded-[14px] p-[24px]">
          <div className="flex flex-col divide-y divide-ink/10">
            <Row label="Name" value={name} />
            <Row label="Email" value={email} />
            <Row label="Date" value={formatDate(selection.date)} />
            <Row label="Time" value={selection.time} />
            <Row label="Format" value={selection.type} />
          </div>

          <div className="flex items-center justify-between mt-[18px] pt-[18px] border-t border-ink/10">
            <span className="text-[14px] text-ink">Consultation fee</span>
            <span className="font-serif text-[24px] text-ink">
              {formatMoney(fee)}
            </span>
          </div>

          <button
            type="button"
            onClick={pay}
            disabled={processing}
            className={`w-full mt-[20px] text-[13px] tracking-[0.16em] uppercase px-[26px] py-[15px] rounded-[10px] transition-colors ${
              processing
                ? "bg-rust/70 text-bg cursor-wait"
                : "bg-rust text-bg hover:bg-rust-dark"
            }`}
          >
            {processing ? "Processing…" : `Pay ${formatMoney(fee)} with Paystack`}
          </button>

          <p className="text-[11.5px] text-muted text-center mt-[12px] leading-[1.6]">
            Secure payment via Paystack — cards, bank transfer, and USSD.
            {!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && (
              <>
                <br />
                <span className="text-muted/70">
                  Demo mode: no real charge is made.
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-[13.5px] text-ink">{value}</span>
    </div>
  );
}
