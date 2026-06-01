"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Users, TrendingUp, Briefcase, Plus, UserPlus, ArrowRight } from "lucide-react";
import { createRevealVariants, revealItemVariants } from "@/lib/motion";

// TODO: Replace mock data with Convex useQuery hooks when backend queries are wired
const MOCK_KPI = {
  todayRevenue: 68500, // cents
  upcomingAppointments: 7,
  activeClients: 142,
  newLeadsThisWeek: 11,
};

const MOCK_APPOINTMENTS = [
  { id: "a1", client: "Jordan Miles", service: "Skin Fade", time: "10:00 AM", status: "confirmed" },
  { id: "a2", client: "Chris Bennett", service: "Cut + Beard", time: "11:30 AM", status: "scheduled" },
  { id: "a3", client: "Andre Cole", service: "Classic Cut", time: "1:00 PM", status: "completed" },
  { id: "a4", client: "Monica Reed", service: "Fade", time: "2:30 PM", status: "confirmed" },
  { id: "a5", client: "Sam Everett", service: "Hot Towel Shave", time: "4:00 PM", status: "cancelled" },
];

type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

const STATUS_STYLES: Record<AppointmentStatus, { bg: string; color: string; label: string }> = {
  scheduled: { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", label: "Scheduled" },
  confirmed: { bg: "rgba(34,197,94,0.12)", color: "#4ade80", label: "Confirmed" },
  completed: { bg: "rgba(136,136,136,0.15)", color: "#888", label: "Completed" },
  cancelled: { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "Cancelled" },
};

const containerVariants = createRevealVariants(0.07, 0);

const quickModules: Array<{ label: string; href: string }> = [
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Services", href: "/admin/services" },
  { label: "Billing", href: "/admin/billing" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminOverviewPage() {
  const revenueFormatted = `$${(MOCK_KPI.todayRevenue / 100).toFixed(2)}`;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ display: "grid", gap: 20 }}
    >
      {/* Header */}
      <motion.div variants={revealItemVariants}>
        <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
          A1 Cuts — Operations
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 32, color: "var(--t1)", lineHeight: 1.1 }}>
          Admin Overview
        </h1>
        <p style={{ color: "var(--t2)", fontSize: 14, marginTop: 6 }}>
          Welcome to the A1 operations dashboard. Use the navigation to manage appointments, team members, and services.
        </p>
      </motion.div>

      {/* KPI Bento Grid */}
      <motion.div
        variants={revealItemVariants}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}
      >
        {[
          { icon: TrendingUp, label: "Today's Revenue", value: revenueFormatted, accent: true },
          { icon: CalendarDays, label: "Upcoming Appointments", value: String(MOCK_KPI.upcomingAppointments), accent: false },
          { icon: Users, label: "Active Clients", value: String(MOCK_KPI.activeClients), accent: false },
          { icon: Briefcase, label: "New Leads This Week", value: String(MOCK_KPI.newLeadsThisWeek), accent: false },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "20px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <kpi.icon size={14} style={{ color: "var(--t2)" }} />
              <span style={{ color: "var(--t2)", fontSize: 12, letterSpacing: "0.06em" }}>{kpi.label}</span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 30,
                fontWeight: 700,
                color: kpi.accent ? "var(--gold)" : "var(--t1)",
                lineHeight: 1,
              }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={revealItemVariants}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 18, marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "Add Appointment", href: "/admin/appointments", icon: Plus },
            { label: "New Client", href: "/admin/clients", icon: UserPlus },
            { label: "View Leads", href: "/admin/leads", icon: ArrowRight },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "var(--bg2)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                textDecoration: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <action.icon size={14} />
              {action.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Appointments */}
      <motion.div
        variants={revealItemVariants}
        style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 14, overflow: "hidden" }}
      >
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 18 }}>Recent Appointments</h2>
          <Link href="/admin/appointments" style={{ color: "var(--gold)", fontSize: 12, textDecoration: "none" }}>
            View all →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Client", "Service", "Time", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "var(--t2)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_APPOINTMENTS.map((appt) => {
                const s = STATUS_STYLES[appt.status as AppointmentStatus] ?? STATUS_STYLES.scheduled;
                return (
                  <tr key={appt.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 20px", color: "var(--t1)", fontSize: 14 }}>{appt.client}</td>
                    <td style={{ padding: "12px 20px", color: "var(--t2)", fontSize: 13 }}>{appt.service}</td>
                    <td style={{ padding: "12px 20px", color: "var(--t2)", fontSize: 13 }}>{appt.time}</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Module quick links */}
      <motion.div variants={revealItemVariants} style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
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
      </motion.div>

      {/* Placeholder sections (keep for tests) */}
      <motion.div variants={revealItemVariants} id="clients" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Clients</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6, fontSize: 14 }}>
          Client management with profiles, notes, and retention insights.{" "}
          <Link href="/admin/clients" style={{ color: "var(--gold)", textDecoration: "none" }}>Open CRM →</Link>
        </p>
      </motion.div>

      <motion.div variants={revealItemVariants} id="schedule" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Schedule</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6, fontSize: 14 }}>
          Advanced schedule planning, availability controls, and conflict handling.{" "}
          <Link href="/admin/schedule" style={{ color: "var(--gold)", textDecoration: "none" }}>View schedule →</Link>
        </p>
      </motion.div>

      <motion.div variants={revealItemVariants} id="reports" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Reports</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6, fontSize: 14 }}>
          Revenue, utilization, and service mix performance over time.{" "}
          <Link href="/admin/reports" style={{ color: "var(--gold)", textDecoration: "none" }}>View reports →</Link>
        </p>
      </motion.div>

      <motion.div variants={revealItemVariants} id="leads" style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--t1)", fontSize: 22, marginBottom: 8 }}>Leads</h2>
        <p style={{ color: "var(--t2)", lineHeight: 1.6, fontSize: 14 }}>
          Lead tracking, follow-up pipelines, and conversion monitoring.{" "}
          <Link href="/admin/leads" style={{ color: "var(--gold)", textDecoration: "none" }}>Open leads →</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
