"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, X, Star, Clock } from "lucide-react";
import { createRevealVariants, revealItemVariants } from "@/lib/motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type StaffRole = "admin" | "staff";

const ROLE_BADGE: Record<StaffRole, { bg: string; color: string; label: string }> = {
  admin: { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", label: "Admin" },
  staff: { bg: "rgba(180,180,180,0.12)", color: "#c0c0c0", label: "Staff" },
};

const containerVariants = createRevealVariants(0.07, 0);

export default function AdminStaffPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const staffList = useQuery(api.staff.listStaff);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "grid", gap: 20 }}>
      {/* Header */}
      <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Team</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "var(--t1)" }}>Staff Management</h1>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--gold)", color: "#080808", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <UserPlus size={14} />
          Invite Staff
        </button>
      </motion.div>

      {/* Staff cards */}
      <motion.div variants={revealItemVariants} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {staffList === undefined ? (
          <div style={{ color: "var(--t3)", fontSize: 13 }}>Loading staff…</div>
        ) : staffList.length === 0 ? (
          <div style={{ color: "var(--t3)", fontSize: 13 }}>No staff members found.</div>
        ) : (
          staffList.map((member) => {
            const role: StaffRole = (member.role === "admin" || member.role === "staff") ? member.role : "staff";
            const badge = ROLE_BADGE[role];
            const initial = (member.name ?? member.email ?? "?")[0]!.toUpperCase();
            return (
              <div
                key={member._id}
                style={{ background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}
              >
                <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg1)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "var(--gold)" }}>{initial}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--t1)" }}>{member.name ?? "Unnamed"}</p>
                      <span style={{ background: badge.bg, color: badge.color, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
                        {badge.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--t2)", marginTop: 2 }}>{member.email ?? "—"}</p>
                  </div>
                </div>

                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Commission", value: "50%", icon: Star },
                    { label: "This Week", value: "—" },
                    { label: "This Month", value: "—" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "0.06em", marginBottom: 4 }}>{stat.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", fontFamily: "var(--font-mono), monospace" }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Clock size={12} style={{ color: "var(--t2)" }} />
                    <p style={{ fontSize: 12, color: "var(--t2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Today&apos;s Schedule</p>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--t3)", fontStyle: "italic" }}>No appointments today</p>
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Staff Roster table */}
      <motion.div variants={revealItemVariants} style={{ border: "1px solid var(--line)", background: "var(--bg2)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "var(--t1)" }}>Staff Roster</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Staff Member", "Role", "Email", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "var(--t2)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList === undefined ? (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "var(--t3)", fontSize: 13 }}>Loading…</td></tr>
              ) : staffList.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "var(--t3)", fontSize: 13 }}>No staff found.</td></tr>
              ) : (
                staffList.map((m) => {
                  const role: StaffRole = (m.role === "admin" || m.role === "staff") ? m.role : "staff";
                  const badge = ROLE_BADGE[role];
                  return (
                    <tr key={m._id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "12px 20px", color: "var(--t1)", fontSize: 14, fontWeight: 600 }}>{m.name ?? "Unnamed"}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ background: badge.bg, color: badge.color, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{badge.label}</span>
                      </td>
                      <td style={{ padding: "12px 20px", color: "var(--t2)", fontSize: 13 }}>{m.email ?? "—"}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ background: m.isActive ? "rgba(34,197,94,0.1)" : "rgba(136,136,136,0.1)", color: m.isActive ? "#4ade80" : "#888", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--bg1)", border: "1px solid var(--line)", borderRadius: 16, padding: 28, width: "min(400px, 95vw)" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "var(--t1)" }}>Invite Staff Member</h2>
                <button onClick={() => setShowInvite(false)} style={{ background: "transparent", border: "none", color: "var(--t2)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>
              <p style={{ color: "var(--t2)", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Send an invitation email to a new staff member. They&apos;ll be prompted to create their profile.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: "0 12px" }}>
                  <Mail size={14} style={{ color: "var(--t2)", flexShrink: 0 }} />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@a1cuts.com"
                    style={{ flex: 1, background: "transparent", border: "none", color: "var(--t1)", fontSize: 13, padding: "10px 0", outline: "none" }}
                  />
                </div>
                <button
                  onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                  style={{ padding: "10px 16px", background: "var(--gold)", border: "none", borderRadius: 8, color: "#080808", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
