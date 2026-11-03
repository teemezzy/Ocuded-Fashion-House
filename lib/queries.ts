/* Server-side data access. Uses the session-aware Supabase client and relies
   on RLS. Falls back to in-memory mock data when Supabase isn't configured, so
   the UI keeps working before the database is wired up. */

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/env";

/** Client for privileged writes that must bypass RLS (bookings, payments,
 *  webhooks — none of which carry an admin session). Falls back to the
 *  session client if no service-role key is set. */
function writeDb() {
  return hasServiceRole ? createServiceClient() : createClient();
}
import {
  Appointment,
  WeeklyDay,
  DateOverride,
  Payment,
  AdminSettings,
  Product,
  Order,
  GalleryImage,
  appointments as mockAppointments,
  weeklyScheduleDefault,
  dateOverridesDefault,
  payments as mockPayments,
  adminSettingsDefault,
  allowedAdminsDefault,
  mockProducts,
  mockOrders,
  mockGallery,
} from "@/lib/adminData";

/* ---------------- mappers (db row -> app type) ---------------- */

type Row = Record<string, unknown>;

function mapSettings(r: Row): AdminSettings {
  return {
    consultationPrice: Number(r.consultation_price),
    slotDuration: Number(r.slot_duration),
    bufferTime: Number(r.buffer_time),
    bookingWindowDays: Number(r.booking_window_days),
    businessName: String(r.business_name),
    businessEmail: String(r.business_email),
    businessPhone: String(r.business_phone ?? ""),
    studioAddress: String(r.studio_address ?? ""),
    timezone: String(r.timezone ?? "Africa/Lagos"),
  };
}

function mapDay(r: Row): WeeklyDay {
  return {
    day: String(r.day),
    active: Boolean(r.active),
    start: String(r.start_time),
    end: String(r.end_time),
  };
}

function mapOverride(r: Row): DateOverride {
  return {
    id: String(r.id),
    date: String(r.date),
    type: r.type as "blocked" | "open",
    note: (r.note as string) ?? undefined,
  };
}

function mapAppointment(r: Row): Appointment {
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone ?? ""),
    date: String(r.date),
    time: String(r.time),
    eventType: r.event_type as Appointment["eventType"],
    eventDate: String(r.event_date ?? ""),
    consultationType: r.consultation_type as Appointment["consultationType"],
    status: r.status as Appointment["status"],
    amount: Number(r.amount),
    paid: Boolean(r.paid),
    paystackRef: (r.paystack_ref as string) ?? null,
    notes: (r.notes as string) ?? undefined,
    meta: (r.meta as Record<string, unknown>) ?? undefined,
  };
}

function mapPayment(r: Row): Payment {
  return {
    id: String(r.id),
    appointmentId: String(r.appointment_id ?? ""),
    name: String(r.name),
    amount: Number(r.amount),
    date: String(r.paid_at).slice(0, 10),
    reference: String(r.reference),
    status: r.status === "refunded" ? "refunded" : "success",
  };
}

/* ---------------- settings ---------------- */

export async function getSettings(): Promise<AdminSettings> {
  if (!isSupabaseConfigured) return adminSettingsDefault;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return adminSettingsDefault;
  return mapSettings(data as Row);
}

export async function updateSettings(
  patch: Partial<AdminSettings>
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase
    .from("admin_settings")
    .update({
      consultation_price: patch.consultationPrice,
      slot_duration: patch.slotDuration,
      buffer_time: patch.bufferTime,
      booking_window_days: patch.bookingWindowDays,
      business_name: patch.businessName,
      business_email: patch.businessEmail,
      business_phone: patch.businessPhone,
      studio_address: patch.studioAddress,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
}

/* ---------------- weekly schedule ---------------- */

export async function getWeeklySchedule(): Promise<WeeklyDay[]> {
  if (!isSupabaseConfigured) return weeklyScheduleDefault;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("weekly_schedule")
    .select("*")
    .order("weekday");
  if (error || !data || data.length === 0) return weeklyScheduleDefault;
  // return in Mon..Sun display order
  const rows = (data as Row[]).map(mapDay);
  const order = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  return order
    .map((d) => rows.find((r) => r.day === d))
    .filter((x): x is WeeklyDay => Boolean(x));
}

export async function updateWeeklySchedule(days: WeeklyDay[]): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await Promise.all(
    days.map((d) =>
      supabase
        .from("weekly_schedule")
        .update({ active: d.active, start_time: d.start, end_time: d.end })
        .eq("day", d.day)
    )
  );
}

/* ---------------- date overrides ---------------- */

export async function getOverrides(): Promise<DateOverride[]> {
  if (!isSupabaseConfigured) return dateOverridesDefault;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("date_overrides")
    .select("*")
    .order("date");
  if (error || !data) return dateOverridesDefault;
  return (data as Row[]).map(mapOverride);
}

export async function addOverride(
  date: string,
  type: "blocked" | "open",
  note?: string
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase
    .from("date_overrides")
    .upsert({ date, type, note: note ?? null }, { onConflict: "date" });
}

export async function removeOverride(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("date_overrides").delete().eq("id", id);
}

/* ---------------- appointments ---------------- */

export async function getAppointments(): Promise<Appointment[]> {
  if (!isSupabaseConfigured) return mockAppointments;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: false })
    .order("time");
  if (error || !data) return mockAppointments;
  return (data as Row[]).map(mapAppointment);
}

export type NewAppointment = {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  eventType: Appointment["eventType"];
  eventDate?: string;
  consultationType: Appointment["consultationType"];
  amount: number;
  meta?: Record<string, unknown>;
  paystackRef?: string;
};

export async function createAppointment(
  input: NewAppointment
): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return { id: `mock-${Date.now()}` };
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      date: input.date,
      time: input.time,
      event_type: input.eventType,
      event_date: input.eventDate ?? null,
      consultation_type: input.consultationType,
      status: "pending",
      amount: input.amount,
      paid: false,
      meta: input.meta ?? null,
      paystack_ref: input.paystackRef ?? null,
    })
    .select("id")
    .maybeSingle();
  if (error || !data) return null;
  return { id: String((data as Row).id) };
}

export async function getAppointmentByRef(
  reference: string
): Promise<Appointment | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("paystack_ref", reference)
    .maybeSingle();
  if (error || !data) return null;
  return mapAppointment(data as Row);
}

/** Mark an appointment paid+confirmed and record the payment. Idempotent. */
export async function confirmPaymentByRef(
  reference: string,
  amountNaira: number
): Promise<Appointment | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = writeDb();

  const { data: appt } = await supabase
    .from("appointments")
    .update({ status: "confirmed", paid: true })
    .eq("paystack_ref", reference)
    .select("*")
    .maybeSingle();

  if (!appt) return null;
  const mapped = mapAppointment(appt as Row);

  // Upsert the payment row (unique on reference makes this idempotent).
  await supabase.from("payments").upsert(
    {
      appointment_id: mapped.id,
      name: mapped.name,
      amount: amountNaira,
      reference,
      status: "success",
    },
    { onConflict: "reference" }
  );

  return mapped;
}

/* ---------------- payments ---------------- */

export async function getPayments(): Promise<Payment[]> {
  if (!isSupabaseConfigured) return mockPayments;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("paid_at", { ascending: false });
  if (error || !data) return mockPayments;
  return (data as Row[]).map(mapPayment);
}

/* ---------------- allowed admins ---------------- */

export async function getAllowedAdmins(): Promise<string[]> {
  if (!isSupabaseConfigured) return allowedAdminsDefault;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("allowed_admins")
    .select("email")
    .order("email");
  if (error || !data) return allowedAdminsDefault;
  return (data as Row[]).map((r) => String(r.email));
}

export async function addAllowedAdmin(email: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("allowed_admins").upsert({ email });
}

export async function removeAllowedAdmin(email: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("allowed_admins").delete().eq("email", email);
}

/* ---------------- products ---------------- */

function mapProduct(r: Row): Product {
  return {
    id: String(r.id),
    title: String(r.title),
    description: String(r.description ?? ""),
    price: Number(r.price),
    imageUrl: (r.image_url as string) ?? null,
    active: Boolean(r.active),
    stock: Number(r.stock ?? 0),
    sold: Number(r.sold ?? 0),
  };
}

/** All products (admin). */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return mockProducts;
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return mockProducts;
  return (data as Row[]).map(mapProduct);
}

/** Active products only (public shop). */
export async function getActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return mockProducts.filter((p) => p.active);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return mockProducts.filter((p) => p.active);
  return (data as Row[]).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const mock = () => mockProducts.find((p) => p.id === id) ?? null;
  if (!isSupabaseConfigured) return mock();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  // Fall back to mock so demo-product links still resolve when the DB/table
  // isn't set up yet (keeps getActiveProducts and this in sync).
  if (error || !data) return mock();
  return mapProduct(data as Row);
}

export type NewProduct = {
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
};

export async function createProduct(
  input: NewProduct
): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return { id: `mock-${Date.now()}` };
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: input.title,
      description: input.description,
      price: input.price,
      image_url: input.imageUrl ?? null,
      active: true,
      stock: input.stock,
      sold: 0,
    })
    .select("id")
    .maybeSingle();
  if (error || !data) return null;
  return { id: String((data as Row).id) };
}

export type ProductPatch = {
  price?: number;
  stock?: number;
  active?: boolean;
  title?: string;
  description?: string;
};

export async function updateProduct(
  id: string,
  patch: ProductPatch
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = writeDb();
  const row: Record<string, unknown> = {};
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.stock !== undefined) row.stock = patch.stock;
  if (patch.active !== undefined) row.active = patch.active;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  await supabase.from("products").update(row).eq("id", id);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = writeDb();
  await supabase.from("products").delete().eq("id", id);
}

/* ---------------- orders ---------------- */

function mapOrder(r: Row): Order {
  return {
    id: String(r.id),
    productId: (r.product_id as string) ?? null,
    productTitle: String(r.product_title ?? ""),
    customerName: String(r.customer_name),
    customerEmail: String(r.customer_email),
    customerPhone: String(r.customer_phone ?? ""),
    amount: Number(r.amount),
    status: (r.status as Order["status"]) ?? "pending",
    fulfilled: Boolean(r.fulfilled),
    reference: (r.paystack_ref as string) ?? null,
    createdAt: String(r.created_at).slice(0, 10),
  };
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) return mockOrders;
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return mockOrders;
  return (data as Row[]).map(mapOrder);
}

export type NewOrder = {
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  reference: string;
};

export async function createOrder(
  input: NewOrder
): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return { id: `mock-${Date.now()}` };
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      product_id: input.productId,
      product_title: input.productTitle,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone ?? null,
      amount: input.amount,
      status: "pending",
      paystack_ref: input.reference,
    })
    .select("id")
    .maybeSingle();
  if (error || !data) return null;
  return { id: String((data as Row).id) };
}

export async function setOrderFulfilled(
  id: string,
  fulfilled: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = writeDb();
  await supabase
    .from("orders")
    .update({
      fulfilled,
      fulfilled_at: fulfilled ? new Date().toISOString() : null,
    })
    .eq("id", id);
}

/** Mark an order paid by Paystack reference (webhook/verify). Idempotent:
 *  only transitions pending → paid once, and increments the product's sold
 *  count a single time. */
export async function confirmOrderByRef(reference: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = writeDb();
  const { data } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("paystack_ref", reference)
    .eq("status", "pending")
    .select("id, product_id")
    .maybeSingle();
  if (!data) return false; // already paid or not found — don't double-count
  const productId = (data as Row).product_id;
  if (productId) {
    await supabase.rpc("increment_product_sold", { p_id: productId });
  }
  return true;
}

export async function getOrderByRef(reference: string): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("paystack_ref", reference)
    .maybeSingle();
  if (error || !data) return null;
  return mapOrder(data as Row);
}

/* ---------------- gallery ---------------- */

function mapGallery(r: Row): GalleryImage {
  return {
    id: String(r.id),
    imageUrl: (r.image_url as string) ?? null,
    caption: String(r.caption ?? ""),
    active: Boolean(r.active),
  };
}

/** All gallery items (admin). */
export async function getGallery(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured) return mockGallery;
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort")
    .order("created_at", { ascending: false });
  if (error || !data) return mockGallery;
  return (data as Row[]).map(mapGallery);
}

/** Active gallery items (public lookbook). */
export async function getActiveGallery(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured) return mockGallery.filter((g) => g.active);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("active", true)
    .order("sort")
    .order("created_at", { ascending: false });
  if (error || !data) return mockGallery.filter((g) => g.active);
  return (data as Row[]).map(mapGallery);
}

export async function createGalleryImage(input: {
  imageUrl: string;
  caption: string;
}): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return { id: `mock-${Date.now()}` };
  const supabase = writeDb();
  const { data, error } = await supabase
    .from("gallery")
    .insert({
      image_url: input.imageUrl,
      caption: input.caption,
      active: true,
    })
    .select("id")
    .maybeSingle();
  if (error || !data) return null;
  return { id: String((data as Row).id) };
}

export async function deleteGalleryImage(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = writeDb();
  await supabase.from("gallery").delete().eq("id", id);
}
