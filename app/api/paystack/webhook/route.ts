import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { confirmPaymentByRef, confirmOrderByRef } from "@/lib/queries";
import { isPaystackConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Paystack calls this server-to-server after a payment. Source of truth.
export async function POST(request: Request) {
  if (!isPaystackConfigured) {
    return NextResponse.json({ ok: true, skipped: "not configured" });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: string; amount?: number };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const reference = event.data.reference;
    const amountNaira = Math.round((event.data.amount ?? 0) / 100);
    // Consultations use "ocb_" refs; product orders use "ord_". Try both —
    // each is idempotent and no-ops if the reference doesn't match.
    if (reference.startsWith("ord_")) {
      await confirmOrderByRef(reference);
    } else {
      await confirmPaymentByRef(reference, amountNaira);
    }
  }

  // Always 200 so Paystack doesn't retry indefinitely.
  return NextResponse.json({ ok: true });
}
