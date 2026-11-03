"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { Card, Button, Field, inputCls } from "@/components/admin/ui";

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isSupabaseConfigured) {
      setError(
        "Image upload needs Supabase configured. You can paste an image URL instead."
      );
      return;
    }
    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setError("");
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Enter a valid price.");
      return;
    }
    const stockNum = Number(stock);
    if (!Number.isFinite(stockNum) || stockNum < 1) {
      setError("Enter how many are available (1 or more).");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: priceNum,
          stock: stockNum,
          imageUrl: imageUrl || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not save product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[900px]">
      <div className="flex items-center gap-[14px] mb-[28px]">
        <Link
          href="/admin/products"
          aria-label="Back to products"
          title="Back to products"
          className="w-[38px] h-[38px] shrink-0 rounded-[10px] flex items-center justify-center text-ink hover:border-rust hover:text-rust transition-colors"
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
        <div>
          <h1 className="font-serif text-[28px] text-ink leading-tight">
            Add product
          </h1>
          <p className="text-[13.5px] text-muted mt-[2px]">
            Create a product you can sell in the shop.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-[20px] items-start">
        <Card className="p-[22px] flex flex-col gap-[16px]">
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sketch Book"
              className={inputCls}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this product?"
              className={`${inputCls} resize-none`}
            />
          </Field>
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
                  placeholder="25000"
                  className={`${inputCls} pl-[26px]`}
                />
              </div>
            </Field>
            <Field label="Quantity available" hint="Auto sells out at this number.">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className={inputCls}
              />
            </Field>
          </div>

          {error && <p className="text-[12.5px] text-rust">{error}</p>}

          <div className="flex justify-end pt-[16px] mt-[2px] border-t border-ink/10">
            <Button onClick={save}>
              {saving ? "Saving…" : "Save product"}
            </Button>
          </div>
        </Card>

        {/* Image */}
        <Card className="p-[22px]">
          <div className="text-[13px] font-medium text-ink mb-[10px]">
            Product image
          </div>
          <div className="aspect-square rounded-[10px] border border-ink/10 bg-cream2 overflow-hidden flex items-center justify-center mb-[12px]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[12px] text-muted uppercase tracking-[0.1em]">
                No image
              </span>
            )}
          </div>

          <label className="block cursor-pointer text-center rounded-[9px] border border-dashed border-ink/25 px-[14px] py-[12px] text-[13px] text-ink hover:border-rust hover:bg-rust/[0.03] transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {uploading ? "Uploading…" : "Upload image"}
          </label>

          <div className="mt-[12px]">
            <Field label="…or paste an image URL">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}
