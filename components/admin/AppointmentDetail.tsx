"use client";

import { useEffect } from "react";
import {
  Appointment,
  statusStyles,
  formatDate,
  formatMoney,
} from "@/lib/adminData";
import { Badge } from "@/components/admin/ui";

type Meta = {
  phone?: string;
  whatsapp?: string;
  residence?: string;
  source?: string;
  weddingDate?: string;
  ceremonyTypes?: string[];
  colors?: string;
  vision?: string;
  visionOther?: string;
  fabrics?: string[];
  fabricsOther?: string;
  styles?: string[];
  stylesOther?: string;
  inspiration?: string[];
  budget?: string;
  exceptional?: string;
  awareness?: string;
  interested?: string;
};

function joinWithOther(arr?: string[], other?: string): string {
  const list = [...(arr ?? [])];
  if (other && other.trim()) {
    const i = list.indexOf("Other");
    if (i >= 0) list[i] = other.trim();
    else list.push(other.trim());
  }
  return list.length ? list.join(", ") : "—";
}

export default function AppointmentDetail({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const a = appointment;
  const m = (a.meta ?? {}) as unknown as Meta;
  const s = statusStyles[a.status];
  const hasForm = Object.keys(m).length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-[560px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto no-scrollbar bg-bg rounded-t-[18px] sm:rounded-[16px] shadow-2xl">
        {/* header */}
        <div className="sticky top-0 bg-bg/95 backdrop-blur border-b border-ink/10 px-[22px] py-[16px] flex items-start justify-between gap-[12px]">
          <div className="min-w-0">
            <div className="font-serif text-[20px] text-ink truncate">
              {a.name}
            </div>
            <div className="text-[12px] text-muted">
              {a.id} · booked {a.email}
            </div>
          </div>
          <div className="flex items-center gap-[10px] shrink-0">
            <Badge className={s.className}>{s.label}</Badge>
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
        </div>

        <div className="px-[22px] py-[20px] flex flex-col gap-[22px]">
          <Section title="Consultation">
            <Row label="Date & time">
              {formatDate(a.date)} · {a.time}
            </Row>
            <Row label="Format">{a.consultationType}</Row>
            <Row label="Payment">
              {formatMoney(a.amount)} · {a.paid ? "Paid" : "Unpaid"}
            </Row>
          </Section>

          <Section title="Contact">
            <Row label="Email">{a.email}</Row>
            <Row label="Phone">{a.phone || m.phone || "—"}</Row>
            {m.whatsapp && <Row label="WhatsApp">{m.whatsapp}</Row>}
            {m.residence && <Row label="Location">{m.residence}</Row>}
            {m.source && <Row label="Found us via">{m.source}</Row>}
          </Section>

          {hasForm ? (
            <>
              <Section title="The wedding">
                <Row label="Wedding date">
                  {m.weddingDate ? formatDate(m.weddingDate) : "—"}
                </Row>
                <Row label="Ceremony">
                  {(m.ceremonyTypes ?? []).join(", ") || "—"}
                </Row>
                <Row label="Colours / palette">{m.colors || "—"}</Row>
              </Section>

              <Section title="Her vision">
                <Row label="Overall look">
                  {m.vision === "Other" ? m.visionOther || "Other" : m.vision || "—"}
                </Row>
                <Row label="Fabrics">
                  {joinWithOther(m.fabrics, m.fabricsOther)}
                </Row>
                <Row label="Styles">
                  {joinWithOther(m.styles, m.stylesOther)}
                </Row>
                <Row label="Inspiration">
                  {m.inspiration && m.inspiration.length
                    ? `${m.inspiration.length} file${
                        m.inspiration.length > 1 ? "s" : ""
                      }: ${m.inspiration.join(", ")}`
                    : "None"}
                </Row>
              </Section>

              <Section title="Budget & notes">
                <Row label="Budget">{m.budget || "—"}</Row>
                <Row label="What would make it exceptional">
                  {m.exceptional || "—"}
                </Row>
                <Row label="Aware of our approach">
                  {m.awareness === "YES" ? "Yes" : m.awareness === "NO" ? "No" : "—"}
                </Row>
                <Row label="Wants to work with us">
                  {m.interested === "YES"
                    ? "Yes"
                    : m.interested === "NO"
                    ? "No"
                    : "—"}
                </Row>
              </Section>
            </>
          ) : (
            <p className="text-[13px] text-muted">
              No pre-consultation questionnaire on file for this booking.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.18em] uppercase text-label mb-[10px]">
        {title}
      </div>
      <div className="flex flex-col gap-[10px]">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-[12px] items-start">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="text-[13.5px] text-ink break-words">{children}</div>
    </div>
  );
}
