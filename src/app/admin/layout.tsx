import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPendingCount } from "@/dal/applications";
import { getPendingPayoutsCount, getStuckPaymentsCount } from "@/dal/payments";
import { AdminShell } from "@/components/admin-shell/AdminShell";

// All admin pages show live operational data written by an external Express backend.
// There is no Next.js revalidatePath/revalidateTag trigger for those writes,
// so we must opt out of the full-route cache entirely for the whole /admin segment.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [pendingCount, pendingPayoutsCount, stuckPaymentsCount] = await Promise.all([
    getPendingCount(),
    getPendingPayoutsCount(),
    getStuckPaymentsCount(15),
  ]);

  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center bg-slate-50 text-slate-400 text-sm">Loading...</div>}>
      <AdminShell
        adminName={session.name}
        pendingCount={pendingCount}
        pendingPayoutsCount={pendingPayoutsCount}
        stuckPaymentsCount={stuckPaymentsCount}
      >
        {children}
      </AdminShell>
    </Suspense>
  );
}
