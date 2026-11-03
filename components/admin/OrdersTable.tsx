"use client";

import { useState } from "react";
import { Order, formatMoney, formatDate } from "@/lib/adminData";
import { PageHeader, Card, Badge } from "@/components/admin/ui";

type Filter = "unfulfilled" | "fulfilled" | "all";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "unfulfilled", label: "Unfulfilled" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "all", label: "All" },
];

function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      className={`w-[20px] h-[20px] shrink-0 rounded-[5px] border flex items-center justify-center transition-colors ${
        on ? "bg-rust border-rust text-bg" : "border-ink/25"
      }`}
    >
      {on && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}

export default function OrdersTable({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [filter, setFilter] = useState<Filter>("unfulfilled");

  const toggle = async (order: Order) => {
    const next = !order.fulfilled;
    setOrders((list) =>
      list.map((o) => (o.id === order.id ? { ...o, fulfilled: next } : o))
    );
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, fulfilled: next }),
    });
  };

  const rows = orders.filter((o) =>
    filter === "all" ? true : filter === "fulfilled" ? o.fulfilled : !o.fulfilled
  );

  const openCount = orders.filter((o) => !o.fulfilled).length;

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${openCount} awaiting fulfilment · ${orders.length} total`}
      />

      <div className="flex flex-wrap gap-[8px] mb-[16px]">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[12.5px] px-[14px] py-[7px] rounded-full border transition-colors ${
              filter === f.key
                ? "border-rust bg-rust text-bg"
                : "border-ink/15 bg-bg text-ink hover:border-rust/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden flex flex-col gap-[10px]">
        {rows.map((o) => (
          <Card key={o.id} className="p-[16px]">
            <div className="flex items-start justify-between gap-[10px]">
              <div className="min-w-0">
                <div className="text-[15px] text-ink truncate">
                  {o.productTitle}
                </div>
                <div className="text-[12px] text-muted truncate">
                  {o.customerName} · {o.customerEmail}
                </div>
              </div>
              <Badge
                className={
                  o.status === "paid"
                    ? "bg-rust/10 text-rust-dark border border-rust/40"
                    : "bg-clay/15 text-rust border border-clay/40"
                }
              >
                {o.status === "paid" ? "Paid" : "Pending"}
              </Badge>
            </div>

            <div className="mt-[12px] flex items-end justify-between gap-[12px]">
              <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
                <Cell label="Amount">{formatMoney(o.amount)}</Cell>
                <Cell label="Date">{formatDate(o.createdAt)}</Cell>
              </div>
              <button
                type="button"
                aria-pressed={o.fulfilled}
                onClick={() => toggle(o)}
                className={`shrink-0 inline-flex items-center gap-[8px] rounded-[9px] border px-[12px] py-[9px] text-[12px] tracking-[0.06em] uppercase transition-colors ${
                  o.fulfilled
                    ? "border-rust/40 text-rust-dark bg-rust/[0.06]"
                    : "border-ink/15 text-ink hover:border-rust"
                }`}
              >
                <CheckBox on={o.fulfilled} />
                {o.fulfilled ? "Fulfilled" : "Mark done"}
              </button>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <Card className="p-[24px] text-center text-muted text-[13px]">
            {filter === "unfulfilled"
              ? "Nothing waiting — all caught up."
              : "No orders here."}
          </Card>
        )}
      </div>

      {/* Desktop: table */}
      <Card className="hidden sm:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-cream2 text-label text-[11px] tracking-[0.14em] uppercase">
                <th className="px-[16px] py-[13px] font-medium w-[44px]">Done</th>
                <th className="px-[16px] py-[13px] font-medium">Product</th>
                <th className="px-[16px] py-[13px] font-medium">Customer</th>
                <th className="px-[16px] py-[13px] font-medium">Amount</th>
                <th className="px-[16px] py-[13px] font-medium">Date</th>
                <th className="px-[16px] py-[13px] font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] text-ink">
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className={`border-t border-ink/10 transition-colors ${
                    o.fulfilled ? "bg-ink/[0.015]" : "hover:bg-cream2/50"
                  }`}
                >
                  <td className="px-[16px] py-[13px]">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={o.fulfilled}
                      aria-label="Mark fulfilled"
                      onClick={() => toggle(o)}
                    >
                      <CheckBox on={o.fulfilled} />
                    </button>
                  </td>
                  <td className="px-[16px] py-[13px]">{o.productTitle}</td>
                  <td className="px-[16px] py-[13px]">
                    <div>{o.customerName}</div>
                    <div className="text-[12px] text-muted">{o.customerEmail}</div>
                  </td>
                  <td className="px-[16px] py-[13px]">{formatMoney(o.amount)}</td>
                  <td className="px-[16px] py-[13px] text-muted">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-[16px] py-[13px]">
                    <Badge
                      className={
                        o.status === "paid"
                          ? "bg-rust/10 text-rust-dark border border-rust/40"
                          : "bg-clay/15 text-rust border border-clay/40"
                      }
                    >
                      {o.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-[16px] py-[28px] text-center text-muted text-[13px]"
                  >
                    {filter === "unfulfilled"
                      ? "Nothing waiting — all caught up."
                      : "No orders here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Cell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] tracking-[0.12em] uppercase text-label mb-[2px]">
        {label}
      </div>
      <div className="text-[13px] text-ink">{children}</div>
    </div>
  );
}
