"use client";

import { useState } from "react";

export default function BuyForm({
  productId,
  priceLabel,
}: {
  productId: string;
  priceLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const input =
    "w-full bg-bg border border-ink/15 rounded-[10px] px-[14px] py-[12px] text-[14px] text-ink outline-none transition-colors focus:border-rust focus:ring-2 focus:ring-rust/20";

  const buy = async () => {
    setError("");
    if (!name.trim() || !emailOk(email)) {
      setError("Please enter your name and a valid email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: name.trim(), email, phone }),
      });
      const json = await res.json();
      if (json.authorization_url) {
        window.location.href = json.authorization_url;
        return;
      }
      if (json.reference) {
        // demo mode → straight to the confirmation
        window.location.href = `/shop/confirmed?ref=${json.reference}`;
        return;
      }
      throw new Error(json.error || "Checkout failed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className={input}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={input}
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (optional)"
        className={input}
      />
      {error && <p className="text-[12.5px] text-rust">{error}</p>}
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="mt-[4px] bg-rust text-bg text-[13px] tracking-[0.16em] uppercase px-[26px] py-[15px] rounded-[10px] hover:bg-rust-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Starting checkout…" : `Pay ${priceLabel} with Paystack`}
      </button>
      <p className="text-[11.5px] text-muted text-center leading-[1.6]">
        Secure payment via Paystack.
        {!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && (
          <>
            <br />
            <span className="text-muted/70">Demo mode: no real charge.</span>
          </>
        )}
      </p>
    </div>
  );
}
