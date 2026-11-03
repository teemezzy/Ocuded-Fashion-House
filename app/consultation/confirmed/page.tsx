import { redirect } from "next/navigation";
import ConfirmedStep from "@/components/consultation/ConfirmedStep";
import { getAppointmentByRef, confirmPaymentByRef } from "@/lib/queries";
import { verifyTransaction } from "@/lib/paystack";
import { isPaystackConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

// Paystack redirects the customer here after payment (?ref=…). We verify the
// transaction server-side, confirm the booking, then show the confirmation.
export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const ref =
    typeof searchParams.ref === "string" ? searchParams.ref : undefined;
  if (!ref) redirect("/");

  if (isPaystackConfigured) {
    try {
      const v = await verifyTransaction(ref);
      if (v && v.status === "success") {
        await confirmPaymentByRef(ref, Math.round(v.amount / 100));
      }
    } catch {
      // webhook is the source of truth; ignore verify hiccups here
    }
  }

  const appt = await getAppointmentByRef(ref);
  if (!appt) redirect("/");

  return (
    <ConfirmedStep
      selection={{
        date: appt.date,
        time: appt.time,
        type: appt.consultationType,
      }}
      name={appt.name}
      amount={appt.amount}
    />
  );
}
