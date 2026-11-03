import crypto from "crypto";

const BASE = "https://api.paystack.co";

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export type InitResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

/** Initialize a Paystack transaction. `amountNaira` is in Naira (converted to kobo). */
export async function initTransaction(params: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitResult> {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100), // kobo
      currency: "NGN",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata ?? {},
    }),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Paystack init failed");
  return json.data as InitResult;
}

export type VerifyResult = {
  status: string; // 'success', 'failed', 'abandoned', …
  amount: number; // kobo
  reference: string;
  paid_at: string | null;
};

/** Verify a transaction by reference (server-authoritative). */
export async function verifyTransaction(
  reference: string
): Promise<VerifyResult | null> {
  const res = await fetch(
    `${BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret()}` }, cache: "no-store" }
  );
  const json = await res.json();
  if (!json.status) return null;
  return json.data as VerifyResult;
}

/** Validate a webhook payload against the x-paystack-signature header. */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", secret())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
