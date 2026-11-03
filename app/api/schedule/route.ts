import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { getWeeklySchedule, updateWeeklySchedule } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ days: await getWeeklySchedule() });
}

export async function PUT(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.days))
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await updateWeeklySchedule(body.days);
  return NextResponse.json({ ok: true });
}
