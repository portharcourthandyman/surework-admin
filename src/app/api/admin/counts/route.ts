import { NextResponse } from "next/server";
import { getPendingCount } from "@/dal/applications";
import { getPendingPayoutsCount, getStuckPaymentsCount } from "@/dal/payments";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [pendingApplications, pendingPayouts, stuckPayments] = await Promise.all([
      getPendingCount(),
      getPendingPayoutsCount(),
      getStuckPaymentsCount(15),
    ]);

    return NextResponse.json({
      pendingApplications,
      pendingPayouts,
      stuckPayments,
    });
  } catch (error: any) {
    console.error("[api/admin/counts] Error:", error);
    return NextResponse.json({ error: "Failed to fetch counts" }, { status: 500 });
  }
}
