"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { createRevealVariants, revealItemVariants } from "@/lib/motion";

// TODO: Replace with Convex mutations for real CRUD
type Service = {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // USD
  active: boolean;
  description?: string;
};

const INITIAL_SERVICES: Service[] = [
  { id: "s1", name: "Classic Cut", duration: 45, price: 35, active: true, description: "Traditional haircut with clippers and scissors." },
  { id: "s2", name: "Skin Fade", duration: 60, price: 45, active: true, description: "High skin fade with detailed blending." },
  { id: "s3", name: "Cut + Beard", duration: 75, price: 55, active: true, description: "Full haircut with beard shape-up and line." },
  { id: "s4", name: "Hot Towel Shave", duration: 45, price: 40, active: true, description: "Relaxing straight-razor shave with hot towel." },
  { id: "s5", name: "Lineup", duration: 20, price: 20, active: true, description: "Edge-up and shape with straight razor." },
  { id: "s6", name: "Kids Cut", duration: 30, price: 25, active: false, description: "Haircut for clients under 12." },
];

const containerVariants = createRevealVariants(0.05, 0);

type EditState = Partial<Omit<Service, "id">>;

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState<Omit<Service, "id">>({ name: "", duration: 45, price: 35, active: true, description: "" });

  function startEdit(svc: Service) {
    setEditId(svc.id);
    setEditState({ name: svc.name, duration: svc.duration, price: svc.price, active: svc.active, description: svc.description });
  }

  function saveEdit(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, ...editState } : s));
    setEditId(null);
    setEditState({});
  }

  function cancelEdit() {
    setEditId(null);
    setEditState({});
  }

  function toggleActive(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  function deleteService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function addService() {
    if (!newSvc.name.trim()) return;
    setServices((prev) => [...prev, { ...newSvc, id: `s${Date.now()}` }]);
    setNewSvc({ name: "", duration: 45, price: 35, active: true, description: "" });
    setShowAdd(false);
  }

  const inputStyle = { background: "var(--bg0)", border: "1px solid var(--line)", borderRadius: 6, padding: "5px 8px", color: "var(--t1)", fontSize: 13, outline: "none", width: "100%" };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "grid", gap: 20 }}>
      {/* Header */}
      <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Catalog</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "var(--t1)" }}>Services</h1>
          <p style={{ color: "var(--t2)", fontSize: 14, marginTop: 4 }}>Manage your service offerings, durations, and pricing.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--gold)", color: "#080808", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={14} />
          Add Service
        </button>
      </motion.div>

      {/* Services table */}
      <motion.div variants={revealItemVariants} style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg2)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Service", "Duration", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "var(--t2)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => {
                const isEditing = editId === svc.id;
                return (
                  <tr key={svc.id} style={{ borderBottom: "1px solid var(--line)", background: isEditing ? "rgba(201,168,76,0.04)" : "transparent" }}>
                    <td style={{ padding: "12px 20px" }}>
                      {isEditing ? (
                        <input value={editState.name ?? ""} onChange={(e) => setEditState({ ...editState, name: e.target.value })} style={inputStyle} />
                      ) : (
                        <div>
                          <p style={{ color: "var(--t1)", fontSize: 14, fontWeight: 500 }}>{svc.name}</p>
                          {svc.description && <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 2 }}>{svc.description}</p>}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {isEditing ? (
                        <input type="number" value={editState.duration ?? ""} onChange={(e) => setEditState({ ...editState, duration: Number(e.target.value) })} style={{ ...inputStyle, width: 70 }} />
                      ) : (
                        <span style={{ color: "var(--t1)", fontSize: 14 }}>{svc.duration} min</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {isEditing ? (
                        <input type="number" value={editState.price ?? ""} onChange={(e) => setEditState({ ...editState, price: Number(e.target.value) })} style={{ ...inputStyle, width: 80 }} />
                      ) : (
                        <span style={{ color: "var(--gold)", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono), monospace" }}>${svc.price}</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <button onClick={() => toggleActive(svc.id)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        {svc.active
                          ? <ToggleRight size={20} style={{ color: "var(--gold)" }} />
                          : <ToggleLeft size={20} style={{ color: "var(--t3)" }} />}
                        <span style={{ fontSize: 12, color: svc.active ? "var(--gold)" : "var(--t3)", fontWeight: 500 }}>{svc.active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(svc.id)} style={{ background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", color: "#4ade80", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>
                              <Check size={14} />
                            </button>
                            <button onClick={cancelEdit} style={{ background: "rgba(136,136,136,0.10)", border: "1px solid var(--line)", color: "var(--t2)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(svc)} style={{ background: "var(--bg1)", border: "1px solid var(--line)", color: "var(--t2)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => deleteService(svc.id)} style={{ background: "rgba(239,68,68,0.10)", border: "1px solid #ef4444", color: "#f87171", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Service modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--bg1)", border: "1px solid var(--line)", borderRadius: 16, padding: 28, width: "min(440px, 95vw)" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "var(--t1)" }}>Add Service</h2>
                <button onClick={() => setShowAdd(false)} style={{ background: "transparent", border: "none", color: "var(--t2)", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { label: "Service Name", field: "name", type: "text", placeholder: "e.g. Classic Cut" },
                  { label: "Duration (minutes)", field: "duration", type: "number", placeholder: "45" },
                  { label: "Price (USD)", field: "price", type: "number", placeholder: "35" },
                  { label: "Description", field: "description", type: "text", placeholder: "Brief description..." },
                ].map((f) => (
                  <div key={f.field}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={String(newSvc[f.field as keyof typeof newSvc] ?? "")}
                      onChange={(e) => setNewSvc({ ...newSvc, [f.field]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                      style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", color: "var(--t1)", fontSize: 13, outline: "none" }}
                    />
                  </div>
                ))}
                <button onClick={addService} style={{ marginTop: 4, width: "100%", padding: "12px", background: "var(--gold)", border: "none", borderRadius: 10, color: "#080808", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Add Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
