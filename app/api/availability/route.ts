import { NextResponse } from "next/server";
import { getWeeklySchedule, getOverrides, getSettings } from "@/lib/queries";
import { availableSlotsForDate, isDateAvailable } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Public: powers the customer booking calendar.
// ?date=YYYY-MM-DD → { date, available, slots }
// otherwise        → { weekly, overrides, settings }
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const [weekly, overrides, settings] = await Promise.all([
    getWeeklySchedule(),
    getOverrides(),
    getSettings(),
  ]);

  if (date) {
    return NextResponse.json({
      date,
      available: isDateAvailable(date, weekly, overrides),
      slots: availableSlotsForDate(date, weekly, overrides, settings),
    });
  }

  return NextResponse.json({ weekly, overrides, settings });
}
