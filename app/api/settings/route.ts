import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  await updateSettings(body);
  return NextResponse.json({ ok: true });
}
