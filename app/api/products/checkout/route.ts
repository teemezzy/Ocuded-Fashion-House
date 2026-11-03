import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProductById, createOrder } from "@/lib/queries";
import { isSoldOut } from "@/lib/adminData";
import { initTransaction } from "@/lib/paystack";
import { isPaystackConfigured, SITE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Public: create a pending order for a product and start a Paystack transaction.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { productId, name, email, phone } = body ?? {};
  if (!productId || !name || !email) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product || !product.active) {
    return NextResponse.json(
      { error: "This product is not available." },
      { status: 404 }
    );
  }
  if (isSoldOut(product)) {
    return NextResponse.json(
      { error: "This product is sold out." },
      { status: 409 }
    );
  }

  const reference = `ord_${crypto.randomUUID()}`;
  const created = await createOrder({
    productId: product.id,
    productTitle: product.title,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    amount: product.price,
    reference,
  });
  if (!created) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  if (!isPaystackConfigured) {
    return NextResponse.json({ demo: true, reference });
  }

  try {
    const tx = await initTransaction({
      email,
      amountNaira: product.price,
      reference,
      callbackUrl: `${SITE_URL}/shop/confirmed?ref=${reference}`,
      metadata: { orderId: created.id, reference, type: "product" },
    });
    return NextResponse.json({ authorization_url: tx.authorization_url, reference });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Paystack error" },
      { status: 502 }
    );
  }
}
