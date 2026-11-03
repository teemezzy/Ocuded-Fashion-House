import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { getOverrides, addOverride, removeOverride } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ overrides: await getOverrides() });
}

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body?.date || !body?.type)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await addOverride(body.date, body.type, body.note);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await removeOverride(id);
  return NextResponse.json({ ok: true });
}
