import { getAppointments, getWeeklySchedule, getOverrides } from "@/lib/queries";
import CalendarView from "@/components/admin/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [appointments, weekly, overrides] = await Promise.all([
    getAppointments(),
    getWeeklySchedule(),
    getOverrides(),
  ]);
  return (
    <CalendarView
      appointments={appointments}
      weekly={weekly}
      overrides={overrides}
    />
  );
}
