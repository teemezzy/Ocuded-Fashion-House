/* Minimal hand-written DB types for the tables we use.
   You can regenerate a fuller version with `supabase gen types typescript`. */

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: number;
          consultation_price: number;
          slot_duration: number;
          buffer_time: number;
          booking_window_days: number;
          business_name: string;
          business_email: string;
          business_phone: string;
          studio_address: string;
          timezone: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admin_settings"]["Row"]>;
      };
      weekly_schedule: {
        Row: {
          day: string;
          weekday: number;
          active: boolean;
          start_time: string;
          end_time: string;
        };
        Insert: Database["public"]["Tables"]["weekly_schedule"]["Row"];
        Update: Partial<Database["public"]["Tables"]["weekly_schedule"]["Row"]>;
      };
      date_overrides: {
        Row: {
          id: string;
          date: string;
          type: "blocked" | "open";
          note: string | null;
          created_at: string;
        };
        Insert: {
          date: string;
          type: "blocked" | "open";
          note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["date_overrides"]["Row"]>;
      };
      appointments: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          date: string;
          time: string;
          event_type: "Wedding" | "Engagement" | "Cultural" | "Custom";
          event_date: string | null;
          consultation_type: "In-person" | "Virtual";
          status:
            | "pending"
            | "confirmed"
            | "rescheduled"
            | "completed"
            | "cancelled";
          amount: number;
          paid: boolean;
          paystack_ref: string | null;
          notes: string | null;
          meta: Record<string, unknown> | null;
          rescheduled_to: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          date: string;
          time: string;
          event_type: "Wedding" | "Engagement" | "Cultural" | "Custom";
          event_date?: string | null;
          consultation_type: "In-person" | "Virtual";
          status?: string;
          amount?: number;
          paid?: boolean;
          paystack_ref?: string | null;
          notes?: string | null;
          meta?: Record<string, unknown> | null;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          appointment_id: string | null;
          name: string;
          amount: number;
          reference: string;
          status: "success" | "refunded" | "pending";
          paid_at: string;
        };
        Insert: {
          appointment_id?: string | null;
          name: string;
          amount: number;
          reference: string;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      allowed_admins: {
        Row: { email: string; added_at: string };
        Insert: { email: string };
        Update: { email?: string };
      };
    };
  };
};
