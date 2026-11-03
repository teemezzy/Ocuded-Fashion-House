import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import {
  getAppointments,
  createAppointment,
  getSettings,
} from "@/lib/queries";
import type { Appointment } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Admin: list all appointments.
export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ appointments: await getAppointments() });
}

// Public: create a (pending) booking from the consultation flow.
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

  // Never trust a client-supplied price.
  const settings = await getSettings();

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
  });

  if (!created) {
    return NextResponse.json(
      { error: "Could not create appointment" },
      { status: 500 }
    );
  }

  // TODO: initialize Paystack transaction here and return its authorization URL.
  return NextResponse.json({ id: created.id, status: "pending" });
}
