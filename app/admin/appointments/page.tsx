"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { createRevealVariants, revealItemVariants } from "@/lib/motion";

// TODO: Replace with Convex useQuery for real appointment data
type ApptStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

type Appointment = {
  id: string;
  client: string;
  service: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  startHour: number; // 9..20
  durationHours: number;
  status: ApptStatus;
  notes?: string;
};

const STATUS_COLORS: Record<ApptStatus, { bg: string; color: string; border: string }> = {
  scheduled: { bg: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "#C9A84C" },
  confirmed: { bg: "rgba(34,197,94,0.10)", color: "#4ade80", border: "#22c55e" },
  completed: { bg: "rgba(136,136,136,0.10)", color: "#888", border: "#444" },
  cancelled: { bg: "rgba(239,68,68,0.10)", color: "#f87171", border: "#ef4444" },
};

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "a1", client: "Jordan Miles", service: "Skin Fade", staffId: "marcus", staffName: "Marcus", date: "", startHour: 10, durationHours: 1, status: "confirmed" },
  { id: "a2", client: "Chris Bennett", service: "Cut + Beard", staffId: "deshawn", staffName: "DeShawn", date: "", startHour: 11, durationHours: 1.5, status: "scheduled" },
  { id: "a3", client: "Andre Cole", service: "Classic Cut", staffId: "ray", staffName: "Ray", date: "", startHour: 13, durationHours: 1, status: "completed" },
  { id: "a4", client: "Monica Reed", service: "Fade", staffId: "marcus", staffName: "Marcus", date: "", startHour: 14, durationHours: 1, status: "confirmed" },
  { id: "a5", client: "Sam Everett", service: "Hot Towel Shave", staffId: "deshawn", staffName: "DeShawn", date: "", startHour: 16, durationHours: 1, status: "cancelled" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 9); // 9am-8pm

function getWeekDays(referenceDate: Date): Date[] {
  const start = new Date(referenceDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtDay(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
}

function fmtHour(h: number) {
  return h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
}

const containerVariants = createRevealVariants(0.05, 0);

export default function AdminAppointmentsPage() {
  const today = new Date();
  const [weekRef, setWeekRef] = useState(new Date());
  const weekDays = getWeekDays(weekRef);

  // Assign demo appointments to days around today
  const appointments: Appointment[] = MOCK_APPOINTMENTS.map((a, i) => ({
    ...a,
    date: fmt(weekDays[i % 5] ?? weekDays[0]),
  }));

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ client: "", service: "", date: fmt(today), hour: "10", staff: "Marcus" });
  const [mobile, setMobile] = useState(false);

  // detect mobile
  if (typeof window !== "undefined" && window.innerWidth < 768 && !mobile) {
    setMobile(true);
  }

  function prevWeek() {
    const d = new Date(weekRef);
    d.setDate(d.getDate() - 7);
    setWeekRef(d);
  }

  function nextWeek() {
    const d = new Date(weekRef);
    d.setDate(d.getDate() + 7);
    setWeekRef(d);
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "grid", gap: 20 }}>
      {/* Header */}
      <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
            Calendar
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "var(--t1)" }}>Appointments</h1>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--gold)", color: "#080808", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={14} />
          New Appointment
        </button>
      </motion.div>

      {/* Week nav */}
      <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={prevWeek} style={{ background: "var(--bg2)", border: "1px solid var(--line)", color: "var(--t1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ color: "var(--t1)", fontSize: 14, fontWeight: 500 }}>
          {fmtDay(weekDays[0])} – {fmtDay(weekDays[6])}
        </span>
        <button onClick={nextWeek} style={{ background: "var(--bg2)", border: "1px solid var(--line)", color: "var(--t1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => setWeekRef(new Date())} style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
          Today
        </button>
      </motion.div>

      {/* Calendar Grid — desktop */}
      <motion.div variants={revealItemVariants} className="appt-calendar-desktop" style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "auto", background: "var(--bg2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", minWidth: 700 }}>
          {/* Header row */}
          <div style={{ padding: "10px 8px", borderBottom: "1px solid var(--line)", borderRight: "1px solid var(--line)" }} />
          {weekDays.map((d) => {
            const isToday = fmt(d) === fmt(today);
            return (
              <div key={fmt(d)} style={{ padding: "10px 8px", borderBottom: "1px solid var(--line)", borderRight: "1px solid var(--line)", textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "var(--t2)", letterSpacing: "0.06em" }}>{d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: isToday ? "var(--gold)" : "var(--t1)", marginTop: 2 }}>{d.getDate()}</p>
              </div>
            );
          })}

          {/* Time rows */}
          {HOURS.map((hour) => (
            <>
              <div key={`hour-${hour}`} style={{ padding: "0 8px", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)", height: 64, display: "flex", alignItems: "flex-start", paddingTop: 6 }}>
                <span style={{ fontSize: 11, color: "var(--t3)" }}>{fmtHour(hour)}</span>
              </div>
              {weekDays.map((d) => {
                const dayAppts = appointments.filter((a) => a.date === fmt(d) && a.startHour === hour);
                return (
                  <div
                    key={`${fmt(d)}-${hour}`}
                    style={{ borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)", height: 64, padding: 4, position: "relative" }}
                  >
                    {dayAppts.map((appt) => {
                      const s = STATUS_COLORS[appt.status];
                      return (
                        <button
                          key={appt.id}
                          onClick={() => setSelected(appt)}
                          style={{ width: "100%", background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.border}`, borderRadius: 6, padding: "3px 6px", cursor: "pointer", textAlign: "left", marginBottom: 2 }}
                        >
                          <p style={{ fontSize: 11, color: s.color, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{appt.client}</p>
                          <p style={{ fontSize: 10, color: "var(--t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{appt.service}</p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </motion.div>

      {/* Mobile list view */}
      <motion.div variants={revealItemVariants} className="appt-calendar-mobile">
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "var(--t1)", marginBottom: 12 }}>This Week</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {appointments.map((appt) => {
            const s = STATUS_COLORS[appt.status];
            return (
              <button
                key={appt.id}
                onClick={() => setSelected(appt)}
                style={{ background: "var(--bg2)", border: `1px solid var(--line)`, borderLeft: `3px solid ${s.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", width: "100%" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--t1)" }}>{appt.client}</p>
                  <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600 }}>{appt.status}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--t2)" }}>{appt.service} · {fmtHour(appt.startHour)} · {appt.staffName}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Appointment detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--bg1)", border: "1px solid var(--line)", borderRadius: 16, padding: 28, width: "min(480px, 95vw)" }}
            >
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Appointment Details</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "var(--t1)", marginTop: 4 }}>{selected.client}</h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "var(--t2)", cursor: "pointer", padding: 4 }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                {[
                  ["Service", selected.service],
                  ["Staff", selected.staffName],
                  ["Time", `${fmtHour(selected.startHour)} (${selected.durationHours}h)`],
                  ["Status", selected.status],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                    <span style={{ color: "var(--t2)", fontSize: 13 }}>{k}</span>
                    <span style={{ color: "var(--t1)", fontSize: 13, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {selected.status !== "confirmed" && selected.status !== "completed" && (
                  <button style={{ flex: 1, padding: "10px 14px", background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", color: "#4ade80", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Check size={14} /> Confirm
                  </button>
                )}
                {selected.status !== "completed" && (
                  <button style={{ flex: 1, padding: "10px 14px", background: "rgba(136,136,136,0.10)", border: "1px solid #444", color: "#888", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Complete
                  </button>
                )}
                {selected.status !== "cancelled" && selected.status !== "completed" && (
                  <button style={{ flex: 1, padding: "10px 14px", background: "rgba(239,68,68,0.10)", border: "1px solid #ef4444", color: "#f87171", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Appointment modal */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--bg1)", border: "1px solid var(--line)", borderRadius: 16, padding: 28, width: "min(440px, 95vw)" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "var(--t1)" }}>New Appointment</h2>
                <button onClick={() => setShowNewForm(false)} style={{ background: "transparent", border: "none", color: "var(--t2)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "Client Name", key: "client", type: "text", placeholder: "Full name" },
                  { label: "Service", key: "service", type: "text", placeholder: "e.g. Skin Fade" },
                  { label: "Date", key: "date", type: "date", placeholder: "" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.type}
                      value={newAppt[field.key as keyof typeof newAppt]}
                      onChange={(e) => setNewAppt({ ...newAppt, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", color: "var(--t1)", fontSize: 13, outline: "none" }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>Time</label>
                  <select
                    value={newAppt.hour}
                    onChange={(e) => setNewAppt({ ...newAppt, hour: e.target.value })}
                    style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", color: "var(--t1)", fontSize: 13 }}
                  >
                    {HOURS.map((h) => <option key={h} value={String(h)}>{fmtHour(h)}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>Staff</label>
                  <select
                    value={newAppt.staff}
                    onChange={(e) => setNewAppt({ ...newAppt, staff: e.target.value })}
                    style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", color: "var(--t1)", fontSize: 13 }}
                  >
                    {["Marcus", "DeShawn", "Ray"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => setShowNewForm(false)}
                  style={{ marginTop: 8, width: "100%", padding: "12px", background: "var(--gold)", border: "none", borderRadius: 10, color: "#080808", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Create Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .appt-calendar-mobile { display: none; }
        @media (max-width: 767px) {
          .appt-calendar-desktop { display: none; }
          .appt-calendar-mobile { display: block; }
        }
      `}</style>
    </motion.div>
  );
}
