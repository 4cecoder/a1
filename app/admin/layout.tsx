import type { ReactNode } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminAccessContext } from "@/lib/admin/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

function AccessDenied() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--bg0)",
        color: "var(--t1)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "min(560px, 100%)",
          border: "1px solid var(--line)",
          background: "var(--bg1)",
          borderRadius: 14,
          padding: "28px 24px",
        }}
      >
        <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
          Access denied
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 34, color: "var(--t1)", lineHeight: 1.1, marginBottom: 10 }}>
          You do not have access to the admin dashboard.
        </h1>
        <p style={{ color: "var(--t2)", lineHeight: 1.7, marginBottom: 22 }}>
          This area is available to staff and admins only. If you believe this is an error, contact an administrator.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            border: "1px solid var(--gold)",
            color: "var(--gold)",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Return home
        </Link>
      </section>
    </main>
  );
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const access = await getAdminAccessContext();

  if (!access.canAccessAdmin) {
    return <AccessDenied />;
  }

  return <AdminShell role={access.role}>{children}</AdminShell>;
}
