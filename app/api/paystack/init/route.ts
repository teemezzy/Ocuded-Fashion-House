import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAppointment, getSettings } from "@/lib/queries";
import { initTransaction } from "@/lib/paystack";
import { isPaystackConfigured, SITE_URL } from "@/lib/env";
import type { Appointment } from "@/lib/adminData";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Public: create a pending appointment and start a Paystack transaction.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.selection || !body?.preConsult) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { preConsult, selection } = body as {
    preConsult: {
      name: string;
      email: string;
      phone?: string;
      weddingDate?: string;
      [k: string]: unknown;
    };
    selection: {
      date: string;
      time: string;
      type: Appointment["consultationType"];
    };
  };

  const settings = await getSettings();
  const reference = `ocb_${crypto.randomUUID()}`;

  const created = await createAppointment({
    name: preConsult.name,
    email: preConsult.email,
    phone: preConsult.phone,
    date: selection.date,
    time: selection.time,
    eventType: "Wedding",
    eventDate: preConsult.weddingDate || undefined,
    consultationType: selection.type,
    amount: settings.consultationPrice,
    meta: preConsult,
    paystackRef: reference,
  });

  if (!created) {
    return NextResponse.json(
      { error: "Could not create appointment" },
      { status: 500 }
    );
  }

  // No Paystack keys → demo mode. The client shows the confirmation screen.
  if (!isPaystackConfigured) {
    return NextResponse.json({ demo: true, reference });
  }

  try {
    const tx = await initTransaction({
      email: preConsult.email,
      amountNaira: settings.consultationPrice,
      reference,
      callbackUrl: `${SITE_URL}/consultation/confirmed?ref=${reference}`,
      metadata: { appointmentId: created.id, reference },
    });
    return NextResponse.json({ authorization_url: tx.authorization_url, reference });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Paystack error" },
      { status: 502 }
    );
  }
}
