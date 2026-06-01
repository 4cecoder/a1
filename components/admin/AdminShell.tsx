"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { AdminRole } from "@/lib/admin/auth";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileBottomNav from "./AdminMobileBottomNav";

type AdminShellProps = {
  role: AdminRole;
  children: ReactNode;
};

export default function AdminShell({ role, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)", display: "flex" }}>
      <AdminSidebar role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <AdminTopbar role={role} onOpenMobileNav={() => setMobileOpen(true)} />
        <main style={{ padding: 20, paddingBottom: 80 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
        </main>
      </div>

      <AdminMobileBottomNav />
    </div>
  );
}
