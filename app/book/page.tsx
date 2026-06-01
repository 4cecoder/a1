"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Scissors } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

type Step = "service" | "slot" | "details" | "done";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9am-7pm

function createDateOptions(n: number): Array<{ dateKey: string; label: string; dayLabel: string }> {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
    const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS[d.getDay()]!;
    result.push({ dateKey, label, dayLabel });
  }
  return result;
}

export default function BookPage() {
  const services = useQuery(api.services.listServicesPublic);
  const createAppointment = useMutation(api.booking.createPublicAppointment);

  const [step, setStep] = useState<Step>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dateOptions = useMemo(() => createDateOptions(7), []);

  const selectedService = useMemo(
    () => services?.find((s) => s._id === selectedServiceId),
    [services, selectedServiceId]
  );

  function onSelectService(id: string) {
    setSelectedServiceId(id);
    setError(null);
  }

  function onContinueToSlot() {
    if (!selectedServiceId) {
      setError("Please select a service.");
      return;
    }
    setError(null);
    if (!selectedDateKey) setSelectedDateKey(dateOptions[0]?.dateKey ?? null);
    setStep("slot");
  }

  function onContinueToDetails() {
    if (!selectedDateKey || selectedHour === null) {
      setError("Please select a date and time.");
      return;
    }
    setError(null);
    setStep("details");
  }

  function onSubmit() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!selectedServiceId || !selectedDateKey || selectedHour === null || !selectedService) {
      setError("Booking details are incomplete.");
      return;
    }

    const [year, month, day] = selectedDateKey.split("-").map(Number);
    const startAt = new Date(year!, month! - 1, day!, selectedHour, 0, 0).getTime();
    const endAt = startAt + selectedService.durationMinutes * 60 * 1000;

    setError(null);
    startTransition(async () => {
      try {
        const result = await createAppointment({
          serviceId: selectedServiceId as Id<"services">,
          startAt,
          endAt,
          customerName: name.trim(),
          customerEmail: email.trim() || undefined,
          customerPhone: phone.trim() || undefined,
        });
        setConfirmationId(result.appointmentId);
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  }

  const inputStyle = {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "var(--t1)",
    fontSize: 14,
    outline: "none",
  };

  return (
    <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
      <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 18, maxWidth: 600, margin: "0 auto", padding: "28px 20px" }}>
        <header style={{ display: "grid", gap: 8 }}>
          <Link href="/" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
            ← A1 Cuts
          </Link>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 7vw, 42px)", lineHeight: 1 }}>
            Reserve your chair
          </h1>
          <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7 }}>
            Book your appointment online. Quick, easy, no account needed.
          </p>
        </header>

        {/* Progress steps */}
        <div style={{ display: "flex", gap: 0 }}>
          {(["service", "slot", "details"] as Step[]).map((s, i) => {
            const stepOrder: Step[] = ["service", "slot", "details", "done"];
            const currentIdx = stepOrder.indexOf(step);
            const sIdx = stepOrder.indexOf(s);
            const done = currentIdx > sIdx;
            const active = step === s;
            return (
              <div key={s} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `2px solid ${done || active ? "var(--gold)" : "var(--line)"}`,
                    background: done ? "var(--gold)" : active ? "rgba(201,168,76,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: done ? "#080808" : active ? "var(--gold)" : "var(--t3)",
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {done ? <Check size={13} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 10, color: active ? "var(--gold)" : done ? "var(--t2)" : "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {s === "service" ? "Service" : s === "slot" ? "Date & Time" : "Your Info"}
                  </span>
                </div>
                {i < 2 && <div style={{ height: 2, flex: 0.5, background: done ? "var(--gold)" : "var(--line)", marginBottom: 18 }} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Service */}
          {step === "service" && (
            <motion.div key="service" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "grid", gap: 16 }}>
              <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg1)", padding: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, marginBottom: 14 }}>Choose a service</h2>
                {services === undefined ? (
                  <p style={{ color: "var(--t3)", fontSize: 13 }}>Loading services…</p>
                ) : services.length === 0 ? (
                  <p style={{ color: "var(--t3)", fontSize: 13 }}>No services available. Check back soon.</p>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {services.map((svc) => {
                      const sel = selectedServiceId === svc._id;
                      return (
                        <button
                          key={svc._id}
                          onClick={() => onSelectService(svc._id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 16px",
                            borderRadius: 10,
                            border: sel ? "1px solid var(--gold)" : "1px solid var(--line)",
                            background: sel ? "rgba(201,168,76,0.08)" : "var(--bg2)",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Scissors size={16} style={{ color: sel ? "var(--gold)" : "var(--t3)" }} />
                            <div>
                              <p style={{ color: sel ? "var(--gold)" : "var(--t1)", fontWeight: 600, fontSize: 14 }}>{svc.name}</p>
                              {svc.description && <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 2 }}>{svc.description}</p>}
                              <p style={{ color: "var(--t3)", fontSize: 11, marginTop: 2 }}>{svc.durationMinutes} min</p>
                            </div>
                          </div>
                          <span style={{ color: "var(--gold)", fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: 15 }}>
                            ${(svc.priceCents / 100).toFixed(0)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
              <button
                onClick={onContinueToSlot}
                disabled={!selectedServiceId}
                style={{ padding: "14px", background: selectedServiceId ? "var(--gold)" : "var(--bg2)", border: "1px solid var(--line)", borderRadius: 10, color: selectedServiceId ? "#080808" : "var(--t3)", fontSize: 14, fontWeight: 700, cursor: selectedServiceId ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Date + Slot */}
          {step === "slot" && (
            <motion.div key="slot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "grid", gap: 16 }}>
              <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg1)", padding: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, marginBottom: 14 }}>Pick a date</h2>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {dateOptions.map((d) => {
                    const sel = selectedDateKey === d.dateKey;
                    return (
                      <button
                        key={d.dateKey}
                        onClick={() => { setSelectedDateKey(d.dateKey); setSelectedHour(null); }}
                        style={{
                          flexShrink: 0,
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: sel ? "1px solid var(--gold)" : "1px solid var(--line)",
                          background: sel ? "rgba(201,168,76,0.10)" : "var(--bg2)",
                          cursor: "pointer",
                          textAlign: "center",
                          minWidth: 64,
                        }}
                      >
                        <p style={{ color: sel ? "var(--gold)" : "var(--t2)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.dayLabel}</p>
                        <p style={{ color: sel ? "var(--gold)" : "var(--t1)", fontWeight: 600, fontSize: 13, marginTop: 2 }}>{d.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg1)", padding: 20 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, marginBottom: 14 }}>Pick a time</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                  {HOURS.map((h) => {
                    const sel = selectedHour === h;
                    const label = h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
                    return (
                      <button
                        key={h}
                        onClick={() => setSelectedHour(h)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: 8,
                          border: sel ? "1px solid var(--gold)" : "1px solid var(--line)",
                          background: sel ? "rgba(201,168,76,0.10)" : "var(--bg2)",
                          color: sel ? "var(--gold)" : "var(--t2)",
                          fontSize: 12,
                          fontWeight: sel ? 600 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
              <div style={{ display: "grid", gap: 8 }}>
                <button onClick={onContinueToDetails} style={{ padding: "14px", background: "var(--gold)", border: "none", borderRadius: 10, color: "#080808", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continue <ChevronRight size={16} />
                </button>
                <button onClick={() => setStep("service")} style={{ padding: "12px", background: "transparent", border: "1px solid var(--line)", borderRadius: 10, color: "var(--t2)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <ChevronLeft size={14} /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "grid", gap: 16 }}>
              {/* Summary */}
              <div style={{ border: "1px solid rgba(201,168,76,0.3)", borderRadius: 14, background: "rgba(201,168,76,0.06)", padding: "14px 18px" }}>
                <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Booking summary</p>
                <p style={{ color: "var(--t1)", fontWeight: 600, fontSize: 15 }}>{selectedService?.name}</p>
                <p style={{ color: "var(--t2)", fontSize: 13, marginTop: 2 }}>
                  {dateOptions.find((d) => d.dateKey === selectedDateKey)?.label} at{" "}
                  {selectedHour !== null ? (selectedHour < 12 ? `${selectedHour}:00 AM` : selectedHour === 12 ? "12:00 PM" : `${selectedHour - 12}:00 PM`) : ""}
                  {" · "}{selectedService?.durationMinutes} min
                  {" · "}${selectedService ? (selectedService.priceCents / 100).toFixed(0) : ""}
                </p>
              </div>

              <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg1)", padding: 20, display: "grid", gap: 14 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20 }}>Your info</h2>
                {[
                  { label: "Full name *", value: name, onChange: setName, type: "text", placeholder: "Jordan Miles" },
                  { label: "Email", value: email, onChange: setEmail, type: "email", placeholder: "jordan@example.com" },
                  { label: "Phone", value: phone, onChange: setPhone, type: "tel", placeholder: "+1 (555) 000-0000" },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
              <div style={{ display: "grid", gap: 8 }}>
                <button
                  onClick={onSubmit}
                  disabled={isPending}
                  style={{ padding: "14px", background: "var(--gold)", border: "none", borderRadius: 10, color: "#080808", fontSize: 14, fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}
                >
                  {isPending ? "Booking…" : "Confirm Booking"}
                </button>
                <button onClick={() => setStep("slot")} style={{ padding: "12px", background: "transparent", border: "1px solid var(--line)", borderRadius: 10, color: "var(--t2)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <ChevronLeft size={14} /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Done */}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "grid", gap: 16 }}>
              <div style={{ border: "1px solid rgba(34,197,94,0.3)", borderRadius: 14, background: "rgba(34,197,94,0.06)", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check size={24} style={{ color: "#4ade80" }} />
                </div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "var(--t1)", marginBottom: 8 }}>You&apos;re booked!</h2>
                <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7 }}>
                  Your appointment has been confirmed. We&apos;ll see you soon.
                </p>
                {confirmationId && (
                  <p style={{ color: "var(--t3)", fontSize: 11, marginTop: 10, fontFamily: "var(--font-mono), monospace" }}>
                    Ref: {String(confirmationId).slice(-8).toUpperCase()}
                  </p>
                )}
              </div>

              <div style={{ border: "1px solid rgba(201,168,76,0.3)", borderRadius: 14, background: "rgba(201,168,76,0.06)", padding: "14px 18px" }}>
                <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Your appointment</p>
                <p style={{ color: "var(--t1)", fontWeight: 600 }}>{selectedService?.name}</p>
                <p style={{ color: "var(--t2)", fontSize: 13, marginTop: 2 }}>
                  {dateOptions.find((d) => d.dateKey === selectedDateKey)?.label} at{" "}
                  {selectedHour !== null ? (selectedHour < 12 ? `${selectedHour}:00 AM` : selectedHour === 12 ? "12:00 PM" : `${selectedHour - 12}:00 PM`) : ""}
                </p>
                <p style={{ color: "var(--t2)", fontSize: 13 }}>Name: {name}</p>
              </div>

              <Link
                href="/"
                style={{ display: "block", padding: "12px", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--t2)", fontSize: 13, textDecoration: "none", textAlign: "center" }}
              >
                Back to home
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
