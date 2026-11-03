import type { Metadata } from "next";
import BookingFlow from "@/components/consultation/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Consultation — O_Cubed Fashion House",
  description:
    "Share your bridal vision with O_Cubed. Complete our short pre-consultation form to help us design a gown that is uniquely yours.",
};

export default function ConsultationPage() {
  return <BookingFlow />;
}
