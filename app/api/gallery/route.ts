import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { createGalleryImage, deleteGalleryImage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const imageUrl = (body?.imageUrl ?? "").trim();
  if (!imageUrl) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const created = await createGalleryImage({
    imageUrl,
    caption: (body?.caption ?? "").trim(),
  });
  if (!created)
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  return NextResponse.json({ id: created.id });
}

export async function DELETE(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteGalleryImage(id);
  return NextResponse.json({ ok: true });
}
