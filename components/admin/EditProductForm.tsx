"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, formatMoney, isSoldOut } from "@/lib/adminData";
import { Card, Button, Field, Toggle, Badge, inputCls } from "@/components/admin/ui";

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [active, setActive] = useState(product.active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const soldOut = isSoldOut({ ...product, stock: Number(stock) || 0 });
  const remaining = Math.max(0, (Number(stock) || 0) - product.sold);

  const save = async () => {
    setError("");
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Enter a valid price.");
      return;
    }
    if (!Number.isFinite(stockNum) || stockNum < product.sold) {
      setError(`Quantity can't be less than the ${product.sold} already sold.`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          price: priceNum,
          stock: stockNum,
          active,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not save");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[560px]">
      <div className="flex items-center gap-[14px] mb-[24px]">
        <Link
          href="/admin/products"
          aria-label="Back to products"
          title="Back to products"
          className="w-[38px] h-[38px] shrink-0 rounded-[10px] border border-ink/15 flex items-center justify-center text-ink hover:border-rust hover:text-rust transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div className="min-w-0">
          <h1 className="font-serif text-[24px] text-ink leading-tight truncate">
            {product.title}
          </h1>
          <p className="text-[13px] text-muted mt-[2px]">
            {product.sold} sold · {remaining} left
            {soldOut && " · sold out"}
          </p>
        </div>
      </div>

      <Card className="p-[22px] flex flex-col gap-[16px]">
        <div className="grid grid-cols-2 gap-[14px]">
          <Field label="Price">
            <div className="relative">
              <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] text-muted pointer-events-none">
                ₦
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`${inputCls} pl-[26px]`}
              />
            </div>
          </Field>
          <Field
            label="Quantity available"
            hint={`${product.sold} already sold`}
          >
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-[10px] bg-cream2/50 border border-ink/10 px-[14px] py-[12px]">
          <div>
            <div className="text-[13px] text-ink">
              {active ? "Online" : "Offline"}
            </div>
            <div className="text-[12px] text-muted">
              {active
                ? "Visible to customers in the shop."
                : "Hidden from the shop."}
            </div>
          </div>
          <Toggle checked={active} onChange={setActive} label="Toggle online" />
        </div>

        {error && <p className="text-[12.5px] text-rust">{error}</p>}

        <div className="flex items-center justify-between pt-[14px] border-t border-ink/10">
          <span className="text-[12.5px] text-muted">
            Current: {formatMoney(product.price)}
          </span>
          <Button onClick={save}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </Card>
    </div>
  );
}
