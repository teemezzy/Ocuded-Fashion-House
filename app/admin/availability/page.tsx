import { getWeeklySchedule, getOverrides } from "@/lib/queries";
import AvailabilityEditor from "@/components/admin/AvailabilityEditor";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const [week, overrides] = await Promise.all([
    getWeeklySchedule(),
    getOverrides(),
  ]);
  return (
    <AvailabilityEditor initialWeek={week} initialOverrides={overrides} />
  );
}
