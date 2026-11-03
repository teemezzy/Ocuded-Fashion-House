"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, formatMoney, isSoldOut } from "@/lib/adminData";
import { PageHeader, Card, Badge, Toggle } from "@/components/admin/ui";

export default function ProductsManager({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initial);

  const remove = async (id: string) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  const setActive = async (id: string, active: boolean) => {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, active } : x)));
    await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    router.refresh();
  };

  return (
    <div>
      <PageHeader
        title="Shop Products"
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/admin/products/new"
            aria-label="Add product"
            title="Add product"
            className="shrink-0 inline-flex items-center justify-center gap-[7px] text-[12px] tracking-[0.12em] uppercase bg-rust text-bg rounded-[9px] hover:bg-rust-dark transition-colors w-[40px] h-[40px] sm:w-auto sm:h-auto sm:px-[16px] sm:py-[10px]"
          >
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
            <span className="hidden sm:inline">Add product</span>
          </Link>
        }
      />

      {products.length === 0 ? (
        <Card className="p-[40px] text-center">
          <p className="text-[14px] text-muted mb-[16px]">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="text-[12px] tracking-[0.14em] uppercase text-rust border-b border-rust pb-[2px] hover:text-rust-dark"
          >
            Add your first product
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {products.map((prod) => {
            const soldOut = isSoldOut(prod);
            const remaining = Math.max(0, prod.stock - prod.sold);
            return (
              <Card key={prod.id} className="p-[16px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-[8px] shrink-0 overflow-hidden bg-cream2 border border-ink/10 flex items-center justify-center">
                    {prod.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-muted uppercase tracking-[0.1em]">
                        No image
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <span className="font-serif text-[17px] text-ink">
                        {prod.title}
                      </span>
                      {!prod.active && (
                        <Badge className="bg-ink/[0.06] text-muted border border-ink/15">
                          Offline
                        </Badge>
                      )}
                      {soldOut && (
                        <Badge className="bg-rust/10 text-rust-dark border border-rust/40">
                          Sold out
                        </Badge>
                      )}
                    </div>
                    <div className="text-[12.5px] text-muted truncate mt-[2px]">
                      {prod.description}
                    </div>
                    <div className="text-[12.5px] text-ink mt-[6px]">
                      {formatMoney(prod.price)} ·{" "}
                      <span className="text-muted">
                        {prod.sold}/{prod.stock} sold
                        {!soldOut && ` · ${remaining} left`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* controls */}
                <div className="flex items-center justify-between gap-[12px] mt-[14px] pt-[12px] border-t border-ink/10">
                  <label className="flex items-center gap-[8px] text-[12px] text-muted select-none">
                    <Toggle
                      checked={prod.active}
                      onChange={(v) => setActive(prod.id, v)}
                      label="Toggle online"
                    />
                    {prod.active ? "Online" : "Offline"}
                  </label>
                  <div className="flex items-center gap-[16px]">
                    <Link
                      href={`/admin/products/${prod.id}/edit`}
                      className="text-[12px] tracking-[0.12em] uppercase text-rust hover:text-rust-dark transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(prod.id)}
                      className="text-[12px] tracking-[0.12em] uppercase text-muted hover:text-rust transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
