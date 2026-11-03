"use client";

import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import Interstitial from "./Interstitial";
import BookingStep, { BookingSelection } from "./BookingStep";
import PaymentStep from "./PaymentStep";
import ConfirmedStep from "./ConfirmedStep";
import { ConsultationData, initialData } from "@/lib/consultation";

type Phase = "form" | "interstitial" | "booking" | "payment" | "confirmed";

export default function BookingFlow() {
  const [phase, setPhase] = useState<Phase>("form");
  const [data, setData] = useState<ConsultationData>(initialData);
  const [selection, setSelection] = useState<BookingSelection | null>(null);

  return (
    <>
      {phase === "form" && (
        <ConsultationForm
          onComplete={(d) => {
            setData(d);
            setPhase("interstitial");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {phase === "interstitial" && (
        <Interstitial
          name={data.name}
          onContinue={() => {
            setPhase("booking");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {phase === "booking" && (
        <BookingStep
          onBack={() => setPhase("interstitial")}
          onConfirm={(sel) => {
            setSelection(sel);
            setPhase("payment");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {phase === "payment" && selection && (
        <PaymentStep
          selection={selection}
          name={data.name}
          email={data.email}
          onBack={() => setPhase("booking")}
          onPaid={async () => {
            // Create the pending booking and start a Paystack transaction.
            try {
              const res = await fetch("/api/paystack/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preConsult: data, selection }),
              });
              const json = await res.json();
              if (json.authorization_url) {
                // Real payment: hand off to Paystack. On success it redirects
                // to /consultation/confirmed?ref=… which verifies the payment.
                window.location.href = json.authorization_url;
                return;
              }
            } catch {
              // fall through to the in-memory confirmation (demo mode)
            }
            setPhase("confirmed");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {phase === "confirmed" && selection && (
        <ConfirmedStep selection={selection} name={data.name} />
      )}
    </>
  );
}
