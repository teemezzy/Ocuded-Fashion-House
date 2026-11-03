"use client";

import { useState } from "react";
import {
  WeeklyDay,
  DateOverride,
  OverrideType,
  formatDate,
} from "@/lib/adminData";
import {
  PageHeader,
  Card,
  Button,
  Toggle,
  Badge,
  inputCls,
} from "@/components/admin/ui";

export default function AvailabilityEditor({
  initialWeek,
  initialOverrides,
}: {
  initialWeek: WeeklyDay[];
  initialOverrides: DateOverride[];
}) {
  const [week, setWeek] = useState<WeeklyDay[]>(initialWeek);
  const [overrides, setOverrides] = useState<DateOverride[]>(initialOverrides);

  const [newDate, setNewDate] = useState("");
  const [newType, setNewType] = useState<OverrideType>("blocked");
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateDay = (i: number, patch: Partial<WeeklyDay>) =>
    setWeek((w) => w.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  const saveWeek = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: week }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const addOverride = async () => {
    if (!newDate) return;
    const optimistic: DateOverride = {
      id: `tmp-${Date.now()}`,
      date: newDate,
      type: newType,
      note: newNote.trim() || undefined,
    };
    setOverrides((o) =>
      [...o.filter((x) => x.date !== newDate), optimistic].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    );
    setNewDate("");
    setNewNote("");
    setNewType("blocked");
    await fetch("/api/overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: optimistic.date,
        type: optimistic.type,
        note: optimistic.note,
      }),
    });
  };

  const removeOverride = async (o: DateOverride) => {
    setOverrides((list) => list.filter((x) => x.id !== o.id));
    if (!o.id.startsWith("tmp-")) {
      await fetch(`/api/overrides?id=${encodeURIComponent(o.id)}`, {
        method: "DELETE",
      });
    }
  };

  const activeDays = week.filter((d) => d.active).length;

  return (
    <div>
      <PageHeader
        title="Availability"
        subtitle="Set your standard working week, then override specific dates. Overrides always win."
      />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-[20px] items-start">
        {/* Weekly schedule */}
        <Card className="p-[22px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-serif text-[19px] text-ink">Weekly hours</h2>
            <Badge className="bg-rust/10 text-rust-dark border border-rust/30">
              {activeDays} days / week
            </Badge>
          </div>

          <div className="flex flex-col divide-y divide-ink/10">
            {week.map((d, i) => (
              <div
                key={d.day}
                className="flex flex-wrap items-center gap-x-[14px] gap-y-[10px] py-[12px]"
              >
                <div className="w-[36px] shrink-0">
                  <Toggle
                    checked={d.active}
                    onChange={(v) => updateDay(i, { active: v })}
                    label={`Toggle ${d.day}`}
                  />
                </div>
                <div
                  className={`flex-1 min-w-0 sm:flex-none sm:w-[104px] text-[14px] ${
                    d.active ? "text-ink" : "text-muted/60"
                  }`}
                >
                  {d.day}
                </div>
                {d.active ? (
                  <div className="flex items-center gap-[8px] w-full sm:w-auto">
                    <input
                      type="time"
                      value={d.start}
                      onChange={(e) => updateDay(i, { start: e.target.value })}
                      className={`${inputCls} flex-1 min-w-0 sm:flex-none sm:w-[120px] px-[8px] py-[7px]`}
                    />
                    <span className="text-muted text-[13px] shrink-0">to</span>
                    <input
                      type="time"
                      value={d.end}
                      onChange={(e) => updateDay(i, { end: e.target.value })}
                      className={`${inputCls} flex-1 min-w-0 sm:flex-none sm:w-[120px] px-[8px] py-[7px]`}
                    />
                  </div>
                ) : (
                  <span className="text-[13px] text-muted/60 italic">
                    Unavailable
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-[18px] flex items-center justify-end gap-[12px]">
            {saved && (
              <span className="text-[12.5px] text-rust-dark">Saved ✓</span>
            )}
            <Button onClick={saveWeek}>
              {saving ? "Saving…" : "Save weekly hours"}
            </Button>
          </div>
        </Card>

        {/* Date overrides */}
        <Card className="p-[22px]">
          <h2 className="font-serif text-[19px] text-ink mb-[4px]">
            Date overrides
          </h2>
          <p className="text-[12.5px] text-muted mb-[16px]">
            Block a day off, or open a day that&rsquo;s normally closed.
          </p>

          <div className="rounded-[10px] bg-cream2/60 border border-ink/10 p-[14px] mb-[16px] flex flex-col gap-[10px]">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-[8px]">
              {(["blocked", "open"] as OverrideType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className={`flex-1 rounded-[8px] border px-[12px] py-[9px] text-[13px] capitalize transition-colors ${
                    newType === t
                      ? "border-rust bg-rust text-bg"
                      : "border-ink/15 bg-bg text-ink hover:border-rust/50"
                  }`}
                >
                  {t === "blocked" ? "Block day" : "Open day"}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Note (optional)"
              className={inputCls}
            />
            <Button onClick={addOverride} className="w-full">
              Add override
            </Button>
          </div>

          {overrides.length === 0 ? (
            <p className="text-[13px] text-muted text-center py-[12px]">
              No overrides yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-[8px]">
              {overrides.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-[10px] rounded-[9px] border border-ink/10 bg-bg px-[12px] py-[10px]"
                >
                  <div className="min-w-0">
                    <div className="text-[13.5px] text-ink">
                      {formatDate(o.date)}
                    </div>
                    {o.note && (
                      <div className="text-[12px] text-muted truncate">
                        {o.note}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-[8px] shrink-0">
                    <Badge
                      className={
                        o.type === "blocked"
                          ? "bg-ink/[0.06] text-muted border border-ink/15"
                          : "bg-rust/10 text-rust-dark border border-rust/30"
                      }
                    >
                      {o.type === "blocked" ? "Blocked" : "Open"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => removeOverride(o)}
                      aria-label="Remove override"
                      className="text-muted hover:text-rust text-[14px]"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
