"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryImage } from "@/lib/adminData";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { inputCls } from "@/components/admin/ui";

export default function GalleryManager({
  initial,
}: {
  initial: GalleryImage[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryImage[]>(initial);
  const [adding, setAdding] = useState(false);

  const remove = async (id: string) => {
    setItems((list) => list.filter((x) => x.id !== id));
    await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-[12px] mb-[4px]">
        <h1 className="font-serif text-[22px] sm:text-[28px] text-ink truncate">
          Gallery / Lookbook
        </h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          aria-label="Add image"
          title="Add image"
          className="shrink-0 inline-flex items-center justify-center gap-[7px] text-[12px] tracking-[0.12em] uppercase bg-rust text-bg rounded-[9px] hover:bg-rust-dark transition-colors w-[40px] h-[40px] sm:w-auto sm:h-auto sm:px-[16px] sm:py-[10px]"
        >
          <Plus />
          <span className="hidden sm:inline">Add image</span>
        </button>
      </div>
      <p className="text-[13.5px] text-muted mb-[24px]">
        {items.length} lookbook item{items.length === 1 ? "" : "s"}.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        {items.map((g) => (
          <div
            key={g.id}
            className="bg-bg border border-ink/10 rounded-[12px] overflow-hidden group"
          >
            <div className="h-[150px] relative bg-cream2 flex items-center justify-center">
              {g.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.imageUrl}
                  alt={g.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] text-muted uppercase tracking-[0.1em]">
                  No image
                </span>
              )}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => remove(g.id)}
                  className="text-[11px] uppercase tracking-[0.1em] bg-rust text-bg px-[14px] py-[7px] rounded-[6px]"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="p-[12px]">
              <div className="text-[12.5px] text-ink leading-snug line-clamp-2">
                {g.caption || "—"}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="group/add h-full min-h-[196px] rounded-[12px] border-2 border-dashed border-ink/20 bg-cream2/40 flex flex-col items-center justify-center gap-[12px] text-muted hover:border-rust hover:text-rust hover:bg-rust/[0.04] transition-colors"
        >
          <span className="w-[46px] h-[46px] rounded-full border border-current flex items-center justify-center transition-transform group-hover/add:scale-105">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </span>
          <span className="text-[11.5px] tracking-[0.14em] uppercase">
            Add image
          </span>
        </button>
      </div>

      {adding && (
        <AddModal
          onClose={() => setAdding(false)}
          onAdded={(item) => {
            setItems((list) => [item, ...list]);
            setAdding(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function AddModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (item: GalleryImage) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isSupabaseConfigured) {
      setError("Image upload needs Supabase. You can paste an image URL below.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: upErr } = await supabase.storage
        .from("gallery-images")
        .upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage
        .from("gallery-images")
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
    if (!imageUrl) {
      setError("Add an image (upload or URL) first.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption: caption.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save");
      onAdded({
        id: json.id,
        imageUrl,
        caption: caption.trim(),
        active: true,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-[440px] bg-bg rounded-t-[18px] sm:rounded-[16px] shadow-2xl p-[22px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h2 className="font-serif text-[19px] text-ink">Add to lookbook</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-muted hover:text-rust hover:bg-ink/[0.04] transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="aspect-[4/3] rounded-[12px] border border-ink/10 bg-cream2 overflow-hidden flex items-center justify-center mb-[12px]">
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
          {uploading ? "Uploading…" : "Upload photo"}
        </label>

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="…or paste an image URL"
          className={`${inputCls} mt-[10px]`}
        />

        <textarea
          value={caption}
          rows={2}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption or idea (optional) — e.g. 'Beaded bodice inspiration'"
          className={`${inputCls} resize-none mt-[10px]`}
        />

        {error && <p className="text-[12.5px] text-rust mt-[10px]">{error}</p>}

        <div className="flex justify-end gap-[10px] mt-[16px]">
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-ink px-[14px] py-[10px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="text-[12px] tracking-[0.14em] uppercase bg-rust text-bg px-[18px] py-[10px] rounded-[9px] hover:bg-rust-dark transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add to gallery"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Plus() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
