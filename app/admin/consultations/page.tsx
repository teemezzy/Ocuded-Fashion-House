import { redirect } from "next/navigation";

export default function ConsultationsRedirect() {
  redirect("/admin/appointments");
}
