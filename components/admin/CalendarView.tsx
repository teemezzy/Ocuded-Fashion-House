"use client";

import { useMemo, useState } from "react";
import {
  isDateAvailable,
  toISO,
  formatDate,
  statusStyles,
  TODAY_ISO,
  Appointment,
  WeeklyDay,
  DateOverride,
} from "@/lib/adminData";
import { PageHeader, Card, Badge } from "@/components/admin/ui";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({
  appointments,
  weekly,
  overrides,
}: {
  appointments: Appointment[];
  weekly: WeeklyDay[];
  overrides: DateOverride[];
}) {
  const initial = new Date(TODAY_ISO + "T00:00:00");
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [selected, setSelected] = useState<string>(TODAY_ISO);

  const apptCountByDate = useMemo(() => {
    const m: Record<string, number> = {};
    appointments.forEach((a) => {
      if (a.status === "cancelled") return;
      m[a.date] = (m[a.date] ?? 0) + 1;
    });
    return m;
  }, [appointments]);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(toISO(new Date(year, month, d)));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const dayAppointments: Appointment[] = appointments
    .filter((a) => a.date === selected && a.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Appointments at a glance. Dots mark booked days; greyed days are unavailable."
      />

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-[20px] items-start">
        <Card className="p-[22px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-serif text-[20px] text-ink">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-[8px]">
              <button
                onClick={prev}
                aria-label="Previous month"
                className="w-[34px] h-[34px] rounded-[8px] border border-ink/15 text-ink hover:border-rust hover:text-rust transition-colors"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="Next month"
                className="w-[34px] h-[34px] rounded-[8px] border border-ink/15 text-ink hover:border-rust hover:text-rust transition-colors"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-[6px] mb-[6px]">
            {DOW.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] tracking-[0.1em] uppercase text-muted py-[4px]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[6px]">
            {cells.map((iso, i) => {
              if (!iso) return <div key={i} />;
              const count = apptCountByDate[iso] ?? 0;
              const available = isDateAvailable(iso, weekly, overrides);
              const isToday = iso === TODAY_ISO;
              const isSelected = iso === selected;
              const dayNum = Number(iso.slice(-2));
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  className={`aspect-square rounded-[9px] border flex flex-col items-center justify-center gap-[4px] text-[13px] transition-colors ${
                    isSelected
                      ? "border-rust bg-rust/10"
                      : available
                      ? "border-ink/10 bg-bg hover:border-rust/50"
                      : "border-transparent bg-ink/[0.03] text-muted/50"
                  }`}
                >
                  <span
                    className={`${isToday ? "font-semibold text-rust" : available ? "text-ink" : "text-muted/50"}`}
                  >
                    {dayNum}
                  </span>
                  {count > 0 && (
                    <span
                      className={`w-[6px] h-[6px] rounded-full ${
                        available ? "bg-rust" : "bg-muted/50"
                      }`}
                      title={`${count} appointment${count > 1 ? "s" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-[16px] mt-[16px] text-[12px] text-muted">
            <span className="flex items-center gap-[6px]">
              <span className="w-[6px] h-[6px] rounded-full bg-rust" /> Booked
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="w-[12px] h-[12px] rounded-[3px] bg-ink/[0.06]" />{" "}
              Unavailable
            </span>
          </div>
        </Card>

        <Card className="p-[22px]">
          <h2 className="font-serif text-[18px] text-ink mb-[2px]">
            {formatDate(selected)}
          </h2>
          <p className="text-[12.5px] text-muted mb-[16px]">
            {dayAppointments.length} appointment
            {dayAppointments.length === 1 ? "" : "s"}
          </p>

          {dayAppointments.length === 0 ? (
            <p className="text-[13px] text-muted py-[8px]">
              No appointments on this day.
            </p>
          ) : (
            <ul className="flex flex-col gap-[10px]">
              {dayAppointments.map((a) => {
                const s = statusStyles[a.status];
                return (
                  <li
                    key={a.id}
                    className="rounded-[10px] border border-ink/10 bg-bg p-[14px]"
                  >
                    <div className="flex items-center justify-between mb-[6px]">
                      <span className="font-serif text-[16px] text-ink">
                        {a.time}
                      </span>
                      <Badge className={s.className}>{s.label}</Badge>
                    </div>
                    <div className="text-[14px] text-ink">{a.name}</div>
                    <div className="text-[12.5px] text-muted">
                      {a.eventType} · {a.consultationType}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
