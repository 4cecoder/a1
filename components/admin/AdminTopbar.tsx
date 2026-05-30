"use client";

import { Bell, Menu, Search } from "lucide-react";
import type { AdminRole } from "@/lib/admin/auth";

type AdminTopbarProps = {
  role: AdminRole;
  onOpenMobileNav: () => void;
};

export default function AdminTopbar({ role, onOpenMobileNav }: AdminTopbarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(8,8,8,0.92)",
        borderBottom: "1px solid var(--line)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="admin-mobile-menu"
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              color: "var(--t1)",
              borderRadius: 8,
              height: 34,
              width: 34,
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Open admin navigation"
          >
            <Menu size={16} />
          </button>

          <div>
            <p style={{ color: "var(--t3)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Dashboard</p>
            <p style={{ color: "var(--t1)", fontSize: 14 }}>Operations workspace</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            aria-label="Search"
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              color: "var(--t2)",
              borderRadius: 8,
              height: 34,
              width: 34,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={15} />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              color: "var(--t2)",
              borderRadius: 8,
              height: 34,
              width: 34,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={15} />
          </button>

          <div
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 999,
              padding: "6px 10px",
              color: "var(--gold)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {role}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .admin-mobile-menu {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
