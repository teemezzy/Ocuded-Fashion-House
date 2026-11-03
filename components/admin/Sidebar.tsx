"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const nav = [
  { href: "/admin", label: "Dashboard", group: "Overview" },
  { href: "/admin/calendar", label: "Calendar", group: "Overview" },
  { href: "/admin/appointments", label: "Appointments", group: "Bookings" },
  { href: "/admin/availability", label: "Availability", group: "Bookings" },
  { href: "/admin/payments", label: "Payments", group: "Bookings" },
  { href: "/admin/gallery", label: "Gallery", group: "Content" },
  { href: "/admin/products", label: "Products", group: "Shop" },
  { href: "/admin/orders", label: "Orders", group: "Shop" },
  { href: "/admin/settings", label: "Settings", group: "System" },
];

const groups = Array.from(new Set(nav.map((n) => n.group)));

export default function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 bg-footer-bg text-[#F3E9DC] h-screen flex flex-col">
      <div className="flex items-center gap-[12px] px-[22px] py-[24px] border-b border-white/10">
        <Logo size={30} color="#C08A4A" />
        <div>
          <div className="font-serif text-[16px] font-medium tracking-[0.22em] leading-none">
            O_CUBED
          </div>
          <div className="text-[7.5px] tracking-[0.4em] text-clay mt-[3px]">
            ADMIN
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-[2px] p-[14px] overflow-y-auto no-scrollbar">
        {groups.map((group) => (
          <div key={group} className="mb-[10px]">
            <div className="px-[16px] py-[6px] text-[10px] tracking-[0.2em] uppercase text-[rgba(243,233,220,0.35)]">
              {group}
            </div>
            {nav
              .filter((item) => item.group === group)
              .map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`block px-[16px] py-[10px] rounded-[8px] text-[13.5px] tracking-[0.02em] transition-colors ${
                      active
                        ? "bg-rust text-bg"
                        : "text-[rgba(243,233,220,0.72)] hover:bg-white/5 hover:text-clay"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

    </aside>
  );
}
