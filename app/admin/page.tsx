import Link from "next/link";
import ModuleState from "@/components/admin/ModuleState";

const quickModules: Array<{ label: string; href: string }> = [
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Services", href: "/admin/services" },
  { label: "Billing", href: "/admin/billing" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminOverviewPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ModuleState
        title="Admin Overview"
        description="Welcome to the A1 operations dashboard. Use the navigation to manage appointments, team members, and services."
        primaryCtaLabel="View appointments"
        primaryCtaHref="/admin/appointments"
        secondaryNote="Wave 2 shell is live; module-specific data wiring comes next."
      />

      <section style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 12 }}>Quick modules</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {quickModules.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                border: "1px solid var(--line)",
                background: "var(--bg1)",
                color: "var(--t2)",
                textDecoration: "none",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="clients" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Clients</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>Client management is queued for upcoming waves and will include profiles, notes, and retention insights.</p>
      </section>

      <section id="reports" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Reports</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>Reporting views will surface revenue, utilization, and service mix performance over time.</p>
      </section>

      <section id="schedule" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Schedule</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>Advanced schedule planning, availability controls, and conflict handling will land in a dedicated module.</p>
      </section>

      <section id="leads" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Leads</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>Lead tracking will support campaign attribution, follow-up pipelines, and conversion monitoring.</p>
      </section>
    </div>
  );
}
