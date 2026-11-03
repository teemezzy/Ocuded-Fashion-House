import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { createProduct, deleteProduct, updateProduct } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const title = (body?.title ?? "").trim();
  const price = Number(body?.price);
  const stock = Number(body?.stock);
  if (!title || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const created = await createProduct({
    title,
    description: (body?.description ?? "").trim(),
    price: Math.round(price),
    imageUrl: body?.imageUrl || null,
    stock: Math.round(stock),
  });
  if (!created)
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  return NextResponse.json({ id: created.id });
}

export async function PATCH(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const patch: {
    price?: number;
    stock?: number;
    active?: boolean;
  } = {};
  if (body.price !== undefined) patch.price = Math.round(Number(body.price));
  if (body.stock !== undefined) patch.stock = Math.round(Number(body.stock));
  if (typeof body.active === "boolean") patch.active = body.active;

  await updateProduct(body.id, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await getAdminEmail();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
