"use client";

import { useState } from "react";
import {
  statusStyles,
  formatDate,
  formatMoney,
  Appointment,
  AppointmentStatus,
} from "@/lib/adminData";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import AppointmentDetail from "@/components/admin/AppointmentDetail";

const FILTERS: { key: AppointmentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function toCsv(rows: Appointment[]): string {
  const headers = [
    "ID", "Name", "Email", "Phone", "Date", "Time",
    "Event Type", "Event Date", "Consultation", "Amount", "Paid", "Status",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  rows.forEach((a) =>
    lines.push(
      [
        a.id, a.name, a.email, a.phone, a.date, a.time,
        a.eventType, a.eventDate, a.consultationType, a.amount,
        a.paid ? "Yes" : "No", a.status,
      ]
        .map(esc)
        .join(",")
    )
  );
  return lines.join("\n");
}

export default function AppointmentsTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [selected, setSelected] = useState<Appointment | null>(null);

  const rows = [...appointments]
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} total bookings`}
        action={
          <button
            type="button"
            onClick={exportCsv}
            title="Download as a CSV spreadsheet"
            className="inline-flex items-center gap-[7px] text-[12px] tracking-[0.08em] uppercase border border-ink/15 rounded-[9px] px-[14px] py-[9px] text-ink hover:border-rust hover:text-rust transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        }
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
        {rows.map((a) => {
          const s = statusStyles[a.status];
          return (
            <Card
              key={a.id}
              onClick={() => setSelected(a)}
              className="p-[16px] cursor-pointer hover:border-rust/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-[10px]">
                <div className="min-w-0">
                  <div className="text-[15px] text-ink truncate">{a.name}</div>
                  <div className="text-[12px] text-muted truncate">
                    {a.email}
                  </div>
                </div>
                <Badge className={s.className}>{s.label}</Badge>
              </div>
              <div className="mt-[12px] grid grid-cols-2 gap-y-[10px] gap-x-[12px]">
                <Cell label="Date">
                  {formatDate(a.date)} · {a.time}
                </Cell>
                <Cell label="Format">{a.consultationType}</Cell>
                <Cell label="Event">{a.eventType}</Cell>
                <Cell label="Amount">
                  {formatMoney(a.amount)}{" "}
                  <span className={a.paid ? "text-rust-dark" : "text-muted"}>
                    ({a.paid ? "Paid" : "Unpaid"})
                  </span>
                </Cell>
              </div>
            </Card>
          );
        })}
        {rows.length === 0 && (
          <Card className="p-[24px] text-center text-muted text-[13px]">
            No appointments match this filter.
          </Card>
        )}
      </div>

      {/* Desktop: table */}
      <Card className="hidden sm:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-cream2 text-label text-[11px] tracking-[0.14em] uppercase">
                <th className="px-[16px] py-[13px] font-medium">Client</th>
                <th className="px-[16px] py-[13px] font-medium">Date &amp; time</th>
                <th className="px-[16px] py-[13px] font-medium">Event</th>
                <th className="px-[16px] py-[13px] font-medium">Type</th>
                <th className="px-[16px] py-[13px] font-medium">Amount</th>
                <th className="px-[16px] py-[13px] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] text-ink">
              {rows.map((a) => {
                const s = statusStyles[a.status];
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="border-t border-ink/10 hover:bg-cream2/50 transition-colors cursor-pointer"
                  >
                    <td className="px-[16px] py-[13px]">
                      <div className="text-ink">{a.name}</div>
                      <div className="text-[12px] text-muted">{a.email}</div>
                    </td>
                    <td className="px-[16px] py-[13px]">
                      <div>{formatDate(a.date)}</div>
                      <div className="text-[12px] text-muted">{a.time}</div>
                    </td>
                    <td className="px-[16px] py-[13px]">
                      <div>{a.eventType}</div>
                      <div className="text-[12px] text-muted">
                        {a.eventDate ? `Event ${formatDate(a.eventDate)}` : "—"}
                      </div>
                    </td>
                    <td className="px-[16px] py-[13px]">
                      <Badge
                        className={
                          a.consultationType === "Virtual"
                            ? "bg-label/10 text-label border border-label/30"
                            : "bg-ink/[0.05] text-muted border border-ink/15"
                        }
                      >
                        {a.consultationType}
                      </Badge>
                    </td>
                    <td className="px-[16px] py-[13px]">
                      <div>{formatMoney(a.amount)}</div>
                      <div
                        className={`text-[12px] ${
                          a.paid ? "text-rust-dark" : "text-muted"
                        }`}
                      >
                        {a.paid ? "Paid" : "Unpaid"}
                      </div>
                    </td>
                    <td className="px-[16px] py-[13px]">
                      <Badge className={s.className}>{s.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-[16px] py-[28px] text-center text-muted text-[13px]"
                  >
                    No appointments match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <AppointmentDetail
          appointment={selected}
          onClose={() => setSelected(null)}
        />
      )}
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
