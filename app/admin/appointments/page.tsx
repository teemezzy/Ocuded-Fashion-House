import { getAppointments } from "@/lib/queries";
import AppointmentsTable from "@/components/admin/AppointmentsTable";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();
  return <AppointmentsTable appointments={appointments} />;
}
