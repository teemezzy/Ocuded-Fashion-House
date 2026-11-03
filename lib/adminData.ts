/* Mock admin data — mirrors the planned Supabase schema.
   Replace with real API/database calls later. All state is in-memory. */

/* ---------------- Appointments ---------------- */

export type EventType = "Wedding" | "Engagement" | "Cultural" | "Custom";
export type ConsultationType = "In-person" | "Virtual";
export type AppointmentStatus =
  | "pending" // awaiting payment
  | "confirmed" // paid
  | "rescheduled"
  | "completed"
  | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  eventType: EventType;
  eventDate: string; // the client's event date
  consultationType: ConsultationType;
  status: AppointmentStatus;
  amount: number; // NGN, what they paid / owe
  paid: boolean;
  paystackRef: string | null;
  notes?: string;
  meta?: Record<string, unknown>; // full pre-consultation questionnaire answers
};

export const appointments: Appointment[] = [
  {
    id: "A-1042",
    name: "Amara Okafor",
    email: "amara.okafor@email.com",
    phone: "+234 803 111 2200",
    date: "2026-08-20",
    time: "10:00",
    eventType: "Wedding",
    eventDate: "2026-11-14",
    consultationType: "In-person",
    status: "confirmed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_9F2A11",
    notes: "Wants a ball gown with beaded bodice.",
    meta: {
      name: "Amara Okafor",
      email: "amara.okafor@email.com",
      phone: "+234 803 111 2200",
      whatsapp: "+234 803 111 2200",
      residence: "Lagos, Nigeria",
      source: "Social Media",
      weddingDate: "2026-11-14",
      ceremonyTypes: ["White wedding", "Traditional"],
      colors: "Ivory with champagne accents",
      vision: "Elegant, Timeless & Chic",
      visionOther: "",
      fabrics: ["Satin", "Lace"],
      fabricsOther: "",
      styles: ["Ball Gown"],
      stylesOther: "",
      inspiration: ["moodboard-1.jpg", "pinterest-save.png"],
      budget: "₦1,000,000 – ₦1,500,000",
      exceptional: "Being truly listened to and feeling calm throughout.",
      awareness: "YES",
      interested: "YES",
    },
  },
  {
    id: "A-1041",
    name: "Zainab Bello",
    email: "zainab.bello@email.com",
    phone: "+234 806 555 7788",
    date: "2026-08-20",
    time: "13:00",
    eventType: "Engagement",
    eventDate: "2027-02-20",
    consultationType: "Virtual",
    status: "confirmed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_7C88E0",
  },
  {
    id: "A-1040",
    name: "Chioma Eze",
    email: "chioma.eze@email.com",
    phone: "+234 802 909 1122",
    date: "2026-08-21",
    time: "11:00",
    eventType: "Wedding",
    eventDate: "2026-12-05",
    consultationType: "In-person",
    status: "pending",
    amount: 50000,
    paid: false,
    paystackRef: null,
  },
  {
    id: "A-1039",
    name: "Funke Adeyemi",
    email: "funke.adeyemi@email.com",
    phone: "+234 815 234 0099",
    date: "2026-08-22",
    time: "12:00",
    eventType: "Cultural",
    eventDate: "2027-01-16",
    consultationType: "Virtual",
    status: "confirmed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_3B10AA",
  },
  {
    id: "A-1037",
    name: "Ngozi Nwosu",
    email: "ngozi.nwosu@email.com",
    phone: "+234 809 444 6655",
    date: "2026-08-25",
    time: "14:00",
    eventType: "Wedding",
    eventDate: "2026-10-24",
    consultationType: "In-person",
    status: "confirmed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_66D0C1",
  },
  {
    id: "A-1030",
    name: "Halima Sani",
    email: "halima.sani@email.com",
    phone: "+234 807 321 4545",
    date: "2026-08-14",
    time: "10:00",
    eventType: "Wedding",
    eventDate: "2026-09-19",
    consultationType: "In-person",
    status: "completed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_11A9F3",
  },
  {
    id: "A-1028",
    name: "Bisi Ogunled",
    email: "bisi.ogunled@email.com",
    phone: "+234 810 777 8899",
    date: "2026-08-12",
    time: "15:00",
    eventType: "Custom",
    eventDate: "2026-10-03",
    consultationType: "Virtual",
    status: "completed",
    amount: 50000,
    paid: true,
    paystackRef: "PSK_08E4B7",
  },
  {
    id: "A-1025",
    name: "Temi Balogun",
    email: "temi.balogun@email.com",
    phone: "+234 803 010 2030",
    date: "2026-08-18",
    time: "11:00",
    eventType: "Engagement",
    eventDate: "2026-12-12",
    consultationType: "In-person",
    status: "cancelled",
    amount: 50000,
    paid: false,
    paystackRef: null,
  },
];

/* ---------------- Weekly schedule ---------------- */

export type WeeklyDay = {
  day: string; // Monday … Sunday
  active: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
};

export const weeklyScheduleDefault: WeeklyDay[] = [
  { day: "Monday", active: true, start: "10:00", end: "16:00" },
  { day: "Tuesday", active: true, start: "10:00", end: "16:00" },
  { day: "Wednesday", active: true, start: "10:00", end: "16:00" },
  { day: "Thursday", active: true, start: "10:00", end: "16:00" },
  { day: "Friday", active: true, start: "10:00", end: "16:00" },
  { day: "Saturday", active: false, start: "10:00", end: "14:00" },
  { day: "Sunday", active: false, start: "10:00", end: "14:00" },
];

/* ---------------- Date overrides ---------------- */

export type OverrideType = "blocked" | "open";
export type DateOverride = {
  id: string;
  date: string; // YYYY-MM-DD
  type: OverrideType;
  note?: string;
};

export const dateOverridesDefault: DateOverride[] = [
  { id: "O-1", date: "2026-08-26", type: "blocked", note: "Personal day" },
  {
    id: "O-2",
    date: "2026-08-29",
    type: "open",
    note: "Peak-season Saturday",
  },
];

/* ---------------- Payments ---------------- */

export type Payment = {
  id: string;
  appointmentId: string;
  name: string;
  amount: number;
  date: string; // YYYY-MM-DD payment confirmed
  reference: string;
  status: "success" | "refunded";
};

export const payments: Payment[] = appointments
  .filter((a) => a.paid && a.paystackRef)
  .map((a, i) => ({
    id: `PMT-${1000 + i}`,
    appointmentId: a.id,
    name: a.name,
    amount: a.amount,
    date: a.date,
    reference: a.paystackRef as string,
    status: "success" as const,
  }));

/* ---------------- Admin settings ---------------- */

export type AdminSettings = {
  consultationPrice: number;
  slotDuration: number; // minutes
  bufferTime: number; // minutes
  bookingWindowDays: number; // how far ahead clients can book
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  studioAddress: string;
  timezone: string;
};

export const adminSettingsDefault: AdminSettings = {
  consultationPrice: 50000,
  slotDuration: 60,
  bufferTime: 15,
  bookingWindowDays: 60,
  businessName: "O_Cubed Fashion House",
  businessEmail: "hello@ocubed.com",
  businessPhone: "+234 800 000 0000",
  studioAddress: "12 Kingsway Road, Ikoyi, Lagos, Nigeria",
  timezone: "Africa/Lagos (WAT)",
};

export const allowedAdminsDefault: string[] = [
  "marveltoms2014@gmail.com",
  "studio@ocubed.com",
];

/* ---------------- Style maps & helpers ---------------- */

export const statusStyles: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending payment",
    className: "bg-clay/15 text-rust border border-clay/40",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-rust/10 text-rust-dark border border-rust/40",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-label/10 text-label border border-label/30",
  },
  completed: {
    label: "Completed",
    className: "bg-ink/[0.06] text-muted border border-ink/15",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-ink/[0.04] text-muted/70 border border-ink/10 line-through",
  },
};

export const WEEKDAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMoney(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whether a given date is available, honoring overrides then weekly defaults. */
export function isDateAvailable(
  iso: string,
  weekly: WeeklyDay[],
  overrides: DateOverride[]
): boolean {
  const ov = overrides.find((o) => o.date === iso);
  if (ov) return ov.type === "open";
  const weekday = WEEKDAY_ORDER[new Date(iso + "T00:00:00").getDay()];
  const wd = weekly.find((w) => w.day === weekday);
  return wd ? wd.active : false;
}

export function appointmentsForDate(iso: string): Appointment[] {
  return appointments
    .filter((a) => a.date === iso && a.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));
}

export const TODAY_ISO = "2026-08-20";

/* ---------------- Products & orders ---------------- */

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number; // NGN
  imageUrl: string | null;
  active: boolean; // false = offline (hidden from customers)
  stock: number; // total units that can be sold
  sold: number; // units sold so far
};

/** True when a product has reached its stock cap. */
export function isSoldOut(p: Product): boolean {
  return p.stock > 0 && p.sold >= p.stock;
}

export const mockProducts: Product[] = [
  {
    id: "P-1",
    title: "Sketch Book",
    description: "Original dress sketches and design concepts from our atelier.",
    price: 25000,
    imageUrl: null,
    active: true,
    stock: 50,
    sold: 12,
  },
  {
    id: "P-2",
    title: "Bridal Collections Book",
    description: "A curated lookbook of our bridal collections and photography.",
    price: 40000,
    imageUrl: null,
    active: true,
    stock: 30,
    sold: 30,
  },
];

export type GalleryImage = {
  id: string;
  imageUrl: string | null;
  caption: string;
  active: boolean;
};

export const mockGallery: GalleryImage[] = [
  { id: "G-1", imageUrl: null, caption: "Gown — full silhouette", active: true },
  { id: "G-2", imageUrl: null, caption: "Detail — beadwork", active: true },
  { id: "G-3", imageUrl: null, caption: "Editorial — bridal portrait", active: true },
  { id: "G-4", imageUrl: null, caption: "Studio — fitting session", active: true },
];

export type OrderStatus = "pending" | "paid";
export type Order = {
  id: string;
  productId: string | null;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: OrderStatus;
  fulfilled: boolean;
  reference: string | null;
  createdAt: string; // ISO
};

export const mockOrders: Order[] = [
  {
    id: "ORD-2051",
    productId: "P-2",
    productTitle: "Bridal Collections Book",
    customerName: "Ada Umeh",
    customerEmail: "ada.umeh@email.com",
    customerPhone: "+234 803 222 1100",
    amount: 40000,
    status: "paid",
    fulfilled: false,
    reference: "ord_5f21a0",
    createdAt: "2026-08-19",
  },
  {
    id: "ORD-2049",
    productId: "P-1",
    productTitle: "Sketch Book",
    customerName: "Grace Obi",
    customerEmail: "grace.obi@email.com",
    customerPhone: "+234 807 555 8080",
    amount: 25000,
    status: "paid",
    fulfilled: true,
    reference: "ord_3b90c2",
    createdAt: "2026-08-16",
  },
];

/* ---------------- Slot generation (customer booking) ---------------- */

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Working hours for a specific date, honoring open overrides for normally-closed days. */
export function hoursForDate(
  iso: string,
  weekly: WeeklyDay[],
  overrides: DateOverride[]
): { start: string; end: string } | null {
  const ov = overrides.find((o) => o.date === iso);
  const weekday = WEEKDAY_ORDER[new Date(iso + "T00:00:00").getDay()];
  const wd = weekly.find((w) => w.day === weekday);
  if (!wd) return null;
  if (ov?.type === "blocked") return null;
  if (ov?.type === "open") return { start: wd.start, end: wd.end };
  return wd.active ? { start: wd.start, end: wd.end } : null;
}

/** Generate bookable start times for a date, excluding already-booked slots. */
export function availableSlotsForDate(
  iso: string,
  weekly: WeeklyDay[],
  overrides: DateOverride[],
  settings: AdminSettings
): string[] {
  const hrs = hoursForDate(iso, weekly, overrides);
  if (!hrs) return [];
  const step = settings.slotDuration + settings.bufferTime;
  const startMin = timeToMin(hrs.start);
  const endMin = timeToMin(hrs.end);
  const booked = new Set(
    appointments
      .filter((a) => a.date === iso && a.status !== "cancelled")
      .map((a) => a.time)
  );
  const slots: string[] = [];
  for (let t = startMin; t + settings.slotDuration <= endMin; t += step) {
    const time = minToTime(t);
    if (!booked.has(time)) slots.push(time);
  }
  return slots;
}
