"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, UserSquare2, Briefcase } from "lucide-react";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Appts", href: "/admin/appointments", icon: CalendarDays },
  { label: "Staff", href: "/admin/staff", icon: UserSquare2 },
  { label: "Leads", href: "/admin/leads", icon: Briefcase },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminMobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="admin-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(8,8,8,0.96)",
          borderTop: "1px solid var(--line)",
          backdropFilter: "blur(10px)",
          display: "none",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
        }}
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                padding: "4px 10px",
                color: active ? "var(--gold)" : "var(--t3)",
                transition: "color 0.15s",
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 10, letterSpacing: "0.04em", fontWeight: active ? 600 : 400 }}>{item.label}</span>
              {active && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--gold)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 767px) {
          .admin-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
