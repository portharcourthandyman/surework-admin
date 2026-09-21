"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Briefcase,
  Grid3X3,
  Star,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  CreditCard,
  AlertTriangle,
  Settings,
  MessageSquare,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/payments", label: "Payments & Payouts", icon: CreditCard },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/admin/categories", label: "Categories", icon: Grid3X3 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/communications", label: "Communications", icon: MessageSquare },
  { href: "/admin/legal", label: "Legal Documents", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function formatAdminBadge(count: number): string | null {
  if (!count || count <= 0) return null;
  return count > 9 ? "9+" : String(count);
}

interface SidebarProps {
  adminName: string;
  pendingCount?: number;
  pendingPayoutsCount?: number;
  stuckPaymentsCount?: number;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  adminName,
  pendingCount = 0,
  pendingPayoutsCount = 0,
  stuckPaymentsCount = 0,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    pendingApplications: pendingCount,
    pendingPayouts: pendingPayoutsCount,
    stuckPayments: stuckPaymentsCount,
  });

  useEffect(() => {
    setCounts({
      pendingApplications: pendingCount,
      pendingPayouts: pendingPayoutsCount,
      stuckPayments: stuckPaymentsCount,
    });
  }, [pendingCount, pendingPayoutsCount, stuckPaymentsCount]);

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/admin/counts");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setCounts({
              pendingApplications: data.pendingApplications ?? 0,
              pendingPayouts: data.pendingPayouts ?? 0,
              stuckPayments: data.stuckPayments ?? 0,
            });
          }
        }
      } catch {}
    };

    const interval = setInterval(fetchCounts, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex flex-col h-full bg-slate-900 text-white transition-all duration-300 ease-in-out",
          // Mobile positions: overlay drawer that slides in/out
          "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full md:translate-x-0",
          mobileOpen && "translate-x-0",
          // Desktop positions: static sidebar
          "md:static md:flex md:flex-shrink-0",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/images/surework-logo.png"
              alt="Surework logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className={cn("block", collapsed && "md:hidden")}>
            <span className="font-bold text-sm text-white">Surework</span>
            <span className="block text-xs text-slate-400">Admin Panel</span>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden md:block ml-auto p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="block md:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const appBadge = item.href === "/admin/applications"
              ? formatAdminBadge(counts.pendingApplications)
              : null;
            const payoutBadge = item.href === "/admin/payments"
              ? formatAdminBadge(counts.pendingPayouts)
              : null;
            const stuckBadge = item.href === "/admin/payments"
              ? formatAdminBadge(counts.stuckPayments)
              : null;
            const hasAttention = Boolean(appBadge || payoutBadge || stuckBadge);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Auto-close sidebar on link click on mobile viewports
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="relative flex-shrink-0">
                  <item.icon
                    size={18}
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  {collapsed && hasAttention && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ring-slate-900",
                        stuckBadge ? "bg-rose-500" : "bg-amber-500"
                      )}
                    />
                  )}
                </div>
                <span className={cn("block", collapsed && "md:hidden", "flex-1 truncate")}>
                  {item.label}
                </span>

                {/* Handyman Applications Badge */}
                {appBadge && (
                  <span
                    className={cn(
                      "flex-shrink-0 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                      collapsed && "md:hidden"
                    )}
                    title={`${counts.pendingApplications} pending application(s)`}
                  >
                    {appBadge}
                  </span>
                )}

                {/* Payments & Payouts Badges */}
                {item.href === "/admin/payments" && (payoutBadge || stuckBadge) && (
                  <div className={cn("flex items-center gap-1 flex-shrink-0", collapsed && "md:hidden")}>
                    {payoutBadge && (
                      <span
                        className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                        title={`${counts.pendingPayouts} pending payout request(s)`}
                      >
                        {payoutBadge}
                      </span>
                    )}
                    {stuckBadge && (
                      <span
                        className="bg-rose-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                        title={`${counts.stuckPayments} stuck payment(s) pending >15 mins`}
                      >
                        {stuckBadge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-slate-700/50 p-3">
          <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl", collapsed && "md:justify-center")}>
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className={cn("flex-1 min-w-0", collapsed && "md:hidden")}>
              <p className="text-sm font-medium text-white truncate">{adminName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <form action="/api/auth/logout" method="POST" className={cn("block", collapsed && "md:hidden")}>
              <button
                type="submit"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
