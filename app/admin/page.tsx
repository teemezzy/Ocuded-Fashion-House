import Link from "next/link";
import {
  statusStyles,
  formatDate,
  formatMoney,
  TODAY_ISO,
} from "@/lib/adminData";
import { getAppointments } from "@/lib/queries";
import { Card, Badge } from "@/components/admin/ui";
import Greeting from "@/components/admin/Greeting";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

async function getFirstName(): Promise<string> {
  if (!isSupabaseConfigured) return "Studio";
  const {
    data: { user },
  } = await createClient().auth.getUser();
  const meta = (user?.user_metadata ?? {}) as {
    full_name?: string;
    name?: string;
  };
  const full = meta.full_name || meta.name || "";
  if (full) return full.split(" ")[0];
  if (user?.email) return user.email.split("@")[0];
  return "Studio";
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="p-[22px]">
      <div className="text-[11px] tracking-[0.18em] uppercase text-label mb-[10px]">
        {label}
      </div>
      <div className="font-serif text-[32px] leading-none text-ink">{value}</div>
      <div className="text-[12.5px] text-muted mt-[8px]">{hint}</div>
    </Card>
  );
}

export default async function AdminDashboard() {
  const [appointments, firstName] = await Promise.all([
    getAppointments(),
    getFirstName(),
  ]);
  const active = appointments.filter((a) => a.status !== "cancelled");

  const todays = active
    .filter((a) => a.date === TODAY_ISO)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekEnd = (() => {
    const d = new Date(TODAY_ISO + "T00:00:00");
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  })();

  const upcoming = active
    .filter((a) => a.date > TODAY_ISO && a.date <= weekEnd)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const revenue = appointments
    .filter((a) => a.paid)
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div>
      <h1 className="font-serif text-[28px] text-ink mb-[2px]">
        <Greeting firstName={firstName} />
      </h1>
      <p className="text-[13.5px] text-muted mb-[24px]">
        Here&rsquo;s what&rsquo;s happening — {formatDate(TODAY_ISO)}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
        <StatCard
          label="Today"
          value={todays.length}
          hint="Appointments today"
        />
        <StatCard
          label="Next 7 days"
          value={upcoming.length}
          hint="Upcoming consultations"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          hint="Paid & on the calendar"
        />
        <StatCard
          label="Revenue"
          value={formatMoney(revenue)}
          hint="Collected to date"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-[20px] items-start">
        {/* Today */}
        <Card className="p-[22px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-serif text-[19px] text-ink">Today&rsquo;s schedule</h2>
            <Link
              href="/admin/calendar"
              className="text-[12px] tracking-[0.12em] uppercase text-rust border-b border-rust pb-[2px] hover:text-rust-dark hover:border-rust-dark transition-colors"
            >
              Calendar
            </Link>
          </div>
          {todays.length === 0 ? (
            <p className="text-[13px] text-muted py-[8px]">
              Nothing booked for today.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {todays.map((a) => {
                const s = statusStyles[a.status];
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between py-[12px]"
                  >
                    <div className="flex items-center gap-[14px]">
                      <span className="font-serif text-[17px] text-ink w-[52px]">
                        {a.time}
                      </span>
                      <div>
                        <div className="text-[14px] text-ink">{a.name}</div>
                        <div className="text-[12px] text-muted">
                          {a.eventType} · {a.consultationType}
                        </div>
                      </div>
                    </div>
                    <Badge className={s.className}>{s.label}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Upcoming week */}
        <Card className="p-[22px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-serif text-[19px] text-ink">The week ahead</h2>
            <Link
              href="/admin/appointments"
              className="text-[12px] tracking-[0.12em] uppercase text-rust border-b border-rust pb-[2px] hover:text-rust-dark hover:border-rust-dark transition-colors"
            >
              All bookings
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-[13px] text-muted py-[8px]">
              No appointments in the next 7 days.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {upcoming.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between py-[12px]"
                >
                  <div>
                    <div className="text-[14px] text-ink">{a.name}</div>
                    <div className="text-[12px] text-muted">
                      {formatDate(a.date)} · {a.time}
                    </div>
                  </div>
                  <span className="text-[12.5px] text-muted">{a.eventType}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Needs attention */}
        <Card className="p-[22px] lg:col-span-2">
          <h2 className="font-serif text-[19px] text-ink mb-[4px]">
            Needs attention
          </h2>
          <p className="text-[12.5px] text-muted mb-[16px]">
            Bookings awaiting payment.
          </p>
          {pending.length === 0 ? (
            <p className="text-[13px] text-muted py-[8px]">
              All caught up — no pending payments.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {pending.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between py-[12px]"
                >
                  <div>
                    <div className="text-[14px] text-ink">{a.name}</div>
                    <div className="text-[12px] text-muted">
                      {formatDate(a.date)} · {a.time} · {formatMoney(a.amount)}
                    </div>
                  </div>
                  <Badge className={statusStyles[a.status].className}>
                    {statusStyles[a.status].label}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
