import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import {
  getAllowedAdmins,
  addAllowedAdmin,
  removeAllowedAdmin,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ admins: await getAllowedAdmins() });
}

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const email = (body?.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  await addAllowedAdmin(email);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  await removeAllowedAdmin(email);
  return NextResponse.json({ ok: true });
}
