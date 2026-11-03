"use client";

import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/Logo";
import {
  isDateAvailable,
  availableSlotsForDate,
  toISO,
  formatDate,
  ConsultationType,
  WeeklyDay,
  DateOverride,
  AdminSettings,
  weeklyScheduleDefault,
  dateOverridesDefault,
  adminSettingsDefault,
} from "@/lib/adminData";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Same-day in-person visits close at noon.
const INPERSON_CUTOFF_MIN = 12 * 60;

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export type BookingSelection = {
  date: string;
  time: string;
  type: ConsultationType;
};

type Config = {
  weekly: WeeklyDay[];
  overrides: DateOverride[];
  settings: AdminSettings;
};

export default function BookingStep({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (sel: BookingSelection) => void;
}) {
  const now = new Date();
  const todayISO = toISO(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<ConsultationType | "">("");

  const [config, setConfig] = useState<Config>({
    weekly: weeklyScheduleDefault,
    overrides: dateOverridesDefault,
    settings: adminSettingsDefault,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.weekly && d?.settings) {
          setConfig({
            weekly: d.weekly,
            overrides: d.overrides ?? [],
            settings: d.settings,
          });
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const maxISO = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + config.settings.bookingWindowDays);
    return toISO(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.settings.bookingWindowDays]);

  // Slots for a date, honoring same-day rules: hide times that have already
  // passed, and block same-day in-person once it's past noon.
  const slotsFor = (iso: string, t: ConsultationType | ""): string[] => {
    const base = availableSlotsForDate(
      iso,
      config.weekly,
      config.overrides,
      config.settings
    );
    if (iso !== todayISO) return base;
    if (t === "In-person" && nowMinutes >= INPERSON_CUTOFF_MIN) return [];
    return base.filter((s) => toMin(s) > nowMinutes);
  };

  const bookable = (iso: string) => {
    if (iso < todayISO || iso > maxISO) return false;
    if (!isDateAvailable(iso, config.weekly, config.overrides)) return false;
    // Calendar stays lenient (virtual perspective); the in-person noon rule is
    // enforced on the slot list once a type is chosen.
    return slotsFor(iso, "Virtual").length > 0;
  };

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const pad = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const arr: (string | null)[] = [];
    for (let i = 0; i < pad; i++) arr.push(null);
    for (let d = 1; d <= days; d++) arr.push(toISO(new Date(year, month, d)));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const slots = date ? slotsFor(date, type || "Virtual") : [];

  // If the chosen type invalidates the picked time, clear it.
  const chooseType = (t: ConsultationType) => {
    setType(t);
    if (date && time && !slotsFor(date, t).includes(time)) {
      setTime("");
    }
  };

  const inpersonBlockedToday =
    date === todayISO &&
    type === "In-person" &&
    nowMinutes >= INPERSON_CUTOFF_MIN;

  const prev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const ready = date && time && type;

  return (
    <div className="min-h-screen bg-cream2/40 px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
      <div className="max-w-[860px] mx-auto">
        <div className="flex items-center justify-between mb-[24px]">
          <div className="flex items-center gap-[10px]">
            <Logo size={26} />
            <span className="font-serif text-[16px] tracking-[0.2em] text-ink">
              O_CUBED
            </span>
          </div>
          <button
            onClick={onBack}
            className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-rust transition-colors"
          >
            ← Back
          </button>
        </div>

        <h1 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] text-ink leading-tight">
          Book your consultation
        </h1>
        <p className="text-[13.5px] text-muted mt-[4px] mb-[24px]">
          Pick an available date and time, and tell us how you&rsquo;d like to
          meet.
        </p>

        {loading && (
          <p className="text-[13px] text-muted mb-[16px]">
            Loading availability…
          </p>
        )}

        <div className="grid lg:grid-cols-2 gap-[20px] items-start">
          {/* Calendar */}
          <div className="bg-bg border border-ink/10 rounded-[14px] p-[22px]">
            <div className="flex items-center justify-between mb-[14px]">
              <h2 className="font-serif text-[18px] text-ink">
                {MONTHS[month]} {year}
              </h2>
              <div className="flex gap-[8px]">
                <button
                  onClick={prev}
                  aria-label="Previous month"
                  className="w-[32px] h-[32px] rounded-[8px] border border-ink/15 text-ink hover:border-rust hover:text-rust transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next month"
                  className="w-[32px] h-[32px] rounded-[8px] border border-ink/15 text-ink hover:border-rust hover:text-rust transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-[5px] mb-[5px]">
              {DOW.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] uppercase text-muted py-[3px]"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-[5px]">
              {cells.map((iso, i) => {
                if (!iso) return <div key={i} />;
                const ok = bookable(iso);
                const selected = iso === date;
                const isToday = iso === todayISO;
                const dayNum = Number(iso.slice(-2));
                return (
                  <button
                    key={iso}
                    disabled={!ok}
                    onClick={() => {
                      setDate(iso);
                      setTime("");
                    }}
                    className={`aspect-square rounded-[8px] text-[13px] transition-colors ${
                      selected
                        ? "bg-rust text-bg"
                        : ok
                        ? "bg-bg border border-ink/10 text-ink hover:border-rust"
                        : "text-muted/40 cursor-not-allowed"
                    } ${isToday && !selected ? "ring-1 ring-rust/40" : ""}`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time + type */}
          <div className="flex flex-col gap-[20px]">
            <div className="bg-bg border border-ink/10 rounded-[14px] p-[22px]">
              <h2 className="font-serif text-[18px] text-ink mb-[12px]">
                Available times
              </h2>
              {!date ? (
                <p className="text-[13px] text-muted">
                  Select a date to see available times.
                </p>
              ) : inpersonBlockedToday ? (
                <p className="text-[13px] text-muted">
                  Same-day in-person visits close at 12pm. Please pick another
                  day, or choose Virtual.
                </p>
              ) : slots.length === 0 ? (
                <p className="text-[13px] text-muted">
                  No times left on this day — try another.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-[8px]">
                  {slots.map((sTime) => (
                    <button
                      key={sTime}
                      onClick={() => setTime(sTime)}
                      className={`rounded-[8px] border px-[10px] py-[10px] text-[13px] transition-colors ${
                        time === sTime
                          ? "border-rust bg-rust text-bg"
                          : "border-ink/15 bg-bg text-ink hover:border-rust/50"
                      }`}
                    >
                      {sTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-bg border border-ink/10 rounded-[14px] p-[22px]">
              <h2 className="font-serif text-[18px] text-ink mb-[12px]">
                How would you like to meet?
              </h2>
              <div className="grid grid-cols-2 gap-[10px]">
                {(["In-person", "Virtual"] as ConsultationType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => chooseType(t)}
                    className={`rounded-[12px] border px-[16px] py-[16px] text-left transition-all ${
                      type === t
                        ? "border-rust bg-rust/[0.06] ring-2 ring-rust/20"
                        : "border-ink/15 bg-bg hover:border-rust/50"
                    }`}
                  >
                    <div className="text-[15px] font-medium text-ink">{t}</div>
                    <div className="text-[12px] text-muted mt-[2px]">
                      {t === "In-person"
                        ? "At our Lagos studio"
                        : "Google Meet video call"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary + continue */}
        <div className="flex items-center justify-between mt-[28px] pt-[20px] border-t border-ink/10">
          <div className="text-[13px] text-muted">
            {ready ? (
              <span className="text-ink">
                {formatDate(date)} · {time} · {type}
              </span>
            ) : (
              "Choose a date, time, and format to continue."
            )}
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={() =>
              ready && onConfirm({ date, time, type: type as ConsultationType })
            }
            className={`text-[13px] tracking-[0.16em] uppercase px-[26px] py-[13px] rounded-[10px] transition-colors ${
              ready
                ? "bg-rust text-bg hover:bg-rust-dark"
                : "bg-ink/10 text-muted/50 cursor-not-allowed"
            }`}
          >
            Continue to payment →
          </button>
        </div>
      </div>
    </div>
  );
}
