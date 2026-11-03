"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSettings } from "@/lib/adminData";
import {
  PageHeader,
  Card,
  Button,
  Field,
  Badge,
  inputCls,
} from "@/components/admin/ui";

export default function SettingsEditor({
  initialSettings,
  initialAdmins,
}: {
  initialSettings: AdminSettings;
  initialAdmins: string[];
}) {
  const [s, setS] = useState<AdminSettings>(initialSettings);
  const [admins, setAdmins] = useState<string[]>(initialAdmins);
  const [newAdmin, setNewAdmin] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const addAdmin = async () => {
    const e = newAdmin.trim().toLowerCase();
    if (!e || admins.includes(e) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return;
    setAdmins((a) => [...a, e]);
    setNewAdmin("");
    await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e }),
    });
  };

  const removeAdmin = async (e: string) => {
    setAdmins((a) => a.filter((x) => x !== e));
    await fetch(`/api/admins?email=${encodeURIComponent(e)}`, {
      method: "DELETE",
    });
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Pricing, scheduling rules, business details, and admin access."
        action={
          <div className="flex items-center gap-[14px]">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-[6px] text-[12.5px] tracking-[0.06em] uppercase text-muted hover:text-rust transition-colors"
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
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
            {saved && (
              <span className="text-[12.5px] text-rust-dark">Saved ✓</span>
            )}
            <Button onClick={save}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-[20px] items-start">
        <Card className="p-[22px]">
          <h2 className="font-serif text-[18px] text-ink mb-[16px]">
            Consultation &amp; scheduling
          </h2>
          <div className="flex flex-col gap-[16px]">
            <Field
              label="Consultation price (₦)"
              hint="Applies to all future bookings immediately."
            >
              <input
                type="number"
                value={s.consultationPrice}
                onChange={(e) => set("consultationPrice", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-[14px]">
              <Field label="Slot duration (min)">
                <input
                  type="number"
                  value={s.slotDuration}
                  onChange={(e) => set("slotDuration", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
              <Field label="Buffer between slots (min)">
                <input
                  type="number"
                  value={s.bufferTime}
                  onChange={(e) => set("bufferTime", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field
              label="Booking window (days)"
              hint="How far in advance clients can book."
            >
              <input
                type="number"
                value={s.bookingWindowDays}
                onChange={(e) => set("bookingWindowDays", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-[22px]">
          <h2 className="font-serif text-[18px] text-ink mb-[16px]">
            Business details
          </h2>
          <div className="flex flex-col gap-[16px]">
            <Field label="Business name">
              <input
                type="text"
                value={s.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Contact email">
              <input
                type="email"
                value={s.businessEmail}
                onChange={(e) => set("businessEmail", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                value={s.businessPhone}
                onChange={(e) => set("businessPhone", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Studio address" hint="Shown to in-person clients.">
              <input
                type="text"
                value={s.studioAddress}
                onChange={(e) => set("studioAddress", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Timezone">
              <input
                type="text"
                value={s.timezone}
                disabled
                className={`${inputCls} opacity-60 cursor-not-allowed`}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-[22px] lg:col-span-2">
          <h2 className="font-serif text-[18px] text-ink mb-[2px]">
            Admin access
          </h2>
          <p className="text-[12.5px] text-muted mb-[16px]">
            Only whitelisted Google accounts can sign in to this panel.
          </p>

          <div className="flex gap-[10px] mb-[16px] max-w-[460px]">
            <input
              type="email"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              placeholder="name@email.com"
              className={`${inputCls} min-w-0`}
            />
            <Button onClick={addAdmin} className="shrink-0">
              Add
            </Button>
          </div>

          <ul className="flex flex-col gap-[8px] max-w-[560px]">
            {admins.map((e) => (
              <li
                key={e}
                className="flex items-center justify-between gap-[10px] rounded-[9px] border border-ink/10 bg-bg px-[14px] py-[10px]"
              >
                <span className="flex items-center gap-[10px] min-w-0">
                  <span className="w-[30px] h-[30px] shrink-0 rounded-full bg-rust text-bg text-[13px] flex items-center justify-center font-serif uppercase">
                    {e[0]}
                  </span>
                  <span className="text-[13.5px] text-ink truncate">{e}</span>
                </span>
                {admins.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeAdmin(e)}
                    className="shrink-0 text-[12px] text-muted hover:text-rust uppercase tracking-[0.1em]"
                  >
                    Remove
                  </button>
                ) : (
                  <Badge className="shrink-0 bg-ink/[0.05] text-muted border border-ink/15">
                    Owner
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
