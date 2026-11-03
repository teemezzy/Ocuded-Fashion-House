import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { getOrders, setOrderFulfilled } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ orders: await getOrders() });
}

export async function PATCH(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body?.id || typeof body.fulfilled !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await setOrderFulfilled(body.id, body.fulfilled);
  return NextResponse.json({ ok: true });
}
