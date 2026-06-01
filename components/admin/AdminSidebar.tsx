"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, CreditCard, LayoutDashboard, Settings, Users, UserSquare2, Briefcase, Scissors, Clock3 } from "lucide-react";
import type { AdminRole } from "@/lib/admin/auth";
import type { ComponentType } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type AdminSidebarProps = {
  role: AdminRole;
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Leads", href: "/admin/leads", icon: Briefcase, badge: true },
  { label: "Staff", href: "/admin/staff", icon: UserSquare2 },
  { label: "Services", href: "/admin/services", icon: Scissors },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Schedule", href: "/admin/schedule", icon: Clock3 },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  const [baseHref] = href.split("#");
  return baseHref !== undefined && pathname.startsWith(baseHref);
}

function SidebarContent({ role, onClose }: { role: AdminRole; onClose: () => void }) {
  const pathname = usePathname();
  const newLeadsCount = useQuery(api.dashboard.getNewLeadsCount);

  return (
    <>
      <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid var(--line)" }}>
        <p style={{ color: "var(--gold)", letterSpacing: "0.18em", fontSize: 11, textTransform: "uppercase" }}>A1 Cuts</p>
        <h1 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 20, marginTop: 4 }}>Admin</h1>
        <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 4 }}>Signed in as {role}</p>
      </div>

      <nav style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 4 }} aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          const showBadge = item.badge && newLeadsCount !== undefined && newLeadsCount > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                textDecoration: "none",
                color: active ? "var(--gold)" : "var(--t2)",
                background: active ? "rgba(201,168,76,0.10)" : "transparent",
                border: active ? "1px solid rgba(201,168,76,0.30)" : "1px solid transparent",
                fontSize: 13,
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {showBadge && (
                <span
                  style={{
                    background: "var(--gold)",
                    color: "#080808",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 6px",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {newLeadsCount! > 99 ? "99+" : newLeadsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function AdminSidebar({ role, open, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside
        style={{
          width: 260,
          borderRight: "1px solid var(--line)",
          background: "var(--bg1)",
          minHeight: "100dvh",
        }}
        className="admin-sidebar-desktop"
      >
        <SidebarContent role={role} onClose={onClose} />
      </aside>

      {open ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.64)",
            display: "flex",
          }}
          className="admin-sidebar-mobile"
          onClick={onClose}
        >
          <aside
            style={{
              width: 276,
              maxWidth: "85vw",
              background: "var(--bg1)",
              borderRight: "1px solid var(--line)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <SidebarContent role={role} onClose={onClose} />
          </aside>
        </div>
      ) : null}

      <style>{`
        @media (max-width: 980px) {
          .admin-sidebar-desktop { display: none; }
        }

        @media (min-width: 981px) {
          .admin-sidebar-mobile { display: none; }
        }
      `}</style>
    </>
  );
}
