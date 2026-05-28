"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Scissors, MapPin, Phone, Clock, Star, ChevronRight, User, X } from "lucide-react";
import {
  cardInteraction,
  createRevealVariants,
  getReducedMotionProps,
  revealItemVariants,
  springTransition,
} from "../lib/motion";
import Navbar from "./components/Navbar";

/* ─── Data ─────────────────────────────────────────── */
const SERVICES = [
  { name: "Classic Cut",     price: "$25", desc: "Clean, sharp, timeless.",         duration: "35 min", popular: false },
  { name: "Fade",            price: "$30", desc: "Low, mid, or high — dialed in.",   duration: "45 min", popular: true  },
  { name: "Beard Trim",      price: "$15", desc: "Lined up and looking right.",      duration: "20 min", popular: false },
  { name: "Cut + Beard",     price: "$40", desc: "The full treatment.",              duration: "55 min", popular: true  },
  { name: "Hot Towel Shave", price: "$35", desc: "Old school. The real deal.",       duration: "40 min", popular: false },
  { name: "Kid's Cut",       price: "$18", desc: "Ages 12 and under.",               duration: "30 min", popular: false },
];

const BARBERS = [
  { name: "Marcus",  role: "Master Barber",  exp: "12 yrs", spec: "Fades & Tapers"   },
  { name: "DeShawn", role: "Senior Barber",  exp: "8 yrs",  spec: "Beards & Lineups" },
  { name: "Ray",     role: "Barber",         exp: "4 yrs",  spec: "Classic Cuts"     },
];

const HOURS = [
  ["Mon – Fri", "9AM – 7PM"],
  ["Saturday",  "9AM – 6PM"],
  ["Sunday",    "Closed"   ],
];

/* ─── Tiny helpers ─────────────────────────────────── */
const G = "var(--gold)";
const LINE = "1px solid var(--line)";

function Label({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <Icon size={13} style={{ color: G }} />
      <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: G, fontFamily: "system-ui,sans-serif" }}>
        {text}
      </span>
    </div>
  );
}

function SectionHead({ label, icon, title }: { label: string; icon: React.ElementType; title: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <Label icon={icon} text={label} />
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "var(--t1)", lineHeight: 1.1 }}>
        {title}
      </h2>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────── */
export default function Home() {
  const reducedMotion = useReducedMotion();
  const motionSafe = getReducedMotionProps(Boolean(reducedMotion));
  const heroReveal = createRevealVariants(0.07, 0.05);
  const sectionReveal = createRevealVariants(0.05, 0.02);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    service: SERVICES[0]?.name ?? "",
    barber: "No preference",
    timeWindow: "No preference",
    notes: "",
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  const selectedService = useMemo(
    () => SERVICES.find((service) => service.name === bookingForm.service) ?? SERVICES[0],
    [bookingForm.service]
  );

  useEffect(() => {
    if (!isBookingOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 40);

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBookingOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isBookingOpen]);

  function updateBookingField<K extends keyof typeof bookingForm>(field: K, value: (typeof bookingForm)[K]) {
    setBookingForm((current) => ({ ...current, [field]: value }));
  }

  function openBookingDrawer() {
    setIsBookingOpen(true);
    setBookingStep(1);
    setBookingSubmitted(false);
  }

  function closeBookingDrawer() {
    setIsBookingOpen(false);
  }

  function handleBookingNext() {
    if (bookingForm.name.trim() && bookingForm.phone.trim() && bookingForm.service) {
      setBookingStep(2);
    }
  }

  function handleBookingBack() {
    setBookingStep(1);
  }

  function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim() || !bookingForm.service) {
      setBookingStep(1);
      return;
    }

    setBookingSubmitted(true);
    setBookingStep(1);
  }

  return (
    <>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100svh", display: "flex", alignItems: "center", paddingTop: 64,
        background: "linear-gradient(160deg, var(--bg0) 60%, #130000 100%)"
      }}>
        <motion.div
          className="wrap"
          style={{ paddingBlock: "80px 72px" }}
          variants={heroReveal}
          initial={motionSafe.initial}
          animate={motionSafe.animate}
        >
          {/* Headline block */}
          <motion.div variants={revealItemVariants} style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
            <div className="pole" style={{ height: 100 }} />
            <div>
              {/* Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {["EST. 2010", "COLUMBIA, SC"].map((t, i) => (
                  <motion.span
                    key={t}
                    variants={revealItemVariants}
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      padding: "4px 10px",
                      border: `1px solid ${i === 0 ? "rgba(201,168,76,.35)" : "var(--line)"}`,
                      color: i === 0 ? G : "var(--t3)",
                      fontFamily: "system-ui,sans-serif",
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
              {/* Big type */}
              <h1 style={{
                fontFamily: "Georgia,serif", lineHeight: 0.92, fontWeight: 700,
                fontSize: "clamp(56px,13vw,112px)", color: "var(--t1)"
              }}>
                A1<br /><span style={{ color: G }}>CUTS</span>
              </h1>
            </div>
          </motion.div>

          {/* Subline */}
          <motion.p variants={revealItemVariants} style={{ fontSize: 16, color: "var(--t2)", maxWidth: 420, lineHeight: 1.7, marginBottom: 20 }}>
            Premium cuts. Classic craft.<br />Walk in looking good, walk out looking great.
          </motion.p>

          <motion.div variants={revealItemVariants} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", border: `1px solid rgba(201,168,76,.3)`, background: "rgba(201,168,76,.08)", marginBottom: 24, maxWidth: "100%" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: G, flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: G, fontFamily: "system-ui,sans-serif" }}>
              Walk-ins welcome today
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={revealItemVariants} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            <motion.button
              type="button"
              data-testid="booking-open"
              onClick={openBookingDrawer}
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
              transition={springTransition}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", background: G, color: "#080808",
                border: "none",
                cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                textDecoration: "none", fontFamily: "system-ui,sans-serif"
              }}
            >
              <Scissors size={13} /> BOOK APPOINTMENT
            </motion.button>
            <motion.a
              href="tel:8037832993"
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
              transition={springTransition}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", border: LINE,
                color: "var(--t2)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
                textDecoration: "none", fontFamily: "system-ui,sans-serif"
              }}
            >
              <Phone size={13} /> CALL TO BOOK
            </motion.a>
            <motion.a
              href="#services"
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
              transition={springTransition}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 20px", border: LINE,
                color: "var(--t3)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
                textDecoration: "none", fontFamily: "system-ui,sans-serif"
              }}
            >
              VIEW SERVICES <ChevronRight size={13} />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={revealItemVariants} style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", paddingTop: 28, borderTop: LINE }}>
            {[["10+","Years Open"], ["3","Expert Barbers"], ["5★","Rated"]].map(([n, l]) => (
              <motion.div key={l} variants={revealItemVariants}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, color: G }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--t3)", marginTop: 3 }}>{l}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={revealItemVariants} style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.65, marginTop: 18, maxWidth: 520 }}>
            Trusted by Columbia regulars for consistent cuts, clean service, and a no-rush chair experience.
          </motion.p>
        </motion.div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════ */}
      <section id="services" style={{ background: "var(--bg1)", borderTop: LINE, borderBottom: LINE }}>
        <motion.div
          className="wrap"
          style={{ paddingBlock: "80px" }}
          variants={sectionReveal}
          initial={motionSafe.initial}
          animate={motionSafe.animate}
        >
          <motion.div variants={revealItemVariants}>
            <SectionHead label="What We Do" icon={Scissors} title="Services" />
          </motion.div>

          <motion.div
            variants={revealItemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 1,
              background: "var(--line)",
            }}
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.name}
                variants={revealItemVariants}
                whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
                transition={springTransition}
                style={{
                  background: "var(--bg1)",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minWidth: 0,
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 600, color: "var(--t1)" }}>
                    {s.name}
                  </h3>
                  {s.popular && (
                    <span style={{
                      fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
                      padding: "3px 8px", border: `1px solid rgba(201,168,76,.3)`,
                      color: G, background: "rgba(201,168,76,.07)", flexShrink: 0,
                      fontFamily: "system-ui,sans-serif"
                    }}>POPULAR</span>
                  )}
                </div>
                {/* Desc */}
                <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.6 }}>{s.desc}</p>
                {/* Price row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: LINE, marginTop: "auto" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: 22, color: G }}>{s.price}</span>
                  <Star size={11} style={{ color: "var(--line)" }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ BARBERS ═══════════════════════════════════ */}
      <section id="barbers" style={{ background: "var(--bg0)", borderTop: LINE, borderBottom: LINE }}>
        <motion.div
          className="wrap"
          style={{ paddingBlock: "80px" }}
          variants={sectionReveal}
          initial={motionSafe.initial}
          animate={motionSafe.animate}
        >
          <motion.div variants={revealItemVariants}>
            <SectionHead label="Meet The Team" icon={User} title="Our Barbers" />
          </motion.div>

          <motion.div
            variants={revealItemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {BARBERS.map((b) => (
              <motion.article
                key={b.name}
                variants={revealItemVariants}
                whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
                transition={springTransition}
                style={{
                  background: "var(--bg2)",
                  border: LINE,
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "var(--t1)" }}>{b.name}</h3>
                  <span style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: G,
                    fontFamily: "system-ui,sans-serif",
                    whiteSpace: "nowrap"
                  }}>{b.exp}</span>
                </div>

                <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t3)" }}>
                  {b.role}
                </p>

                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: LINE, display: "flex", alignItems: "center", gap: 8 }}>
                  <Scissors size={12} style={{ color: "var(--line)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--t2)" }}>{b.spec}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════ */}
      <section id="contact" style={{ background: "var(--bg1)" }}>
        <motion.div
          className="wrap"
          style={{ paddingBlock: "80px" }}
          variants={sectionReveal}
          initial={motionSafe.initial}
          animate={motionSafe.animate}
        >
          <motion.div variants={revealItemVariants}>
            <SectionHead label="Find Us" icon={MapPin} title="Contact & Hours" />
          </motion.div>

          <motion.div
            variants={revealItemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Location */}
            <motion.div
              variants={revealItemVariants}
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              transition={springTransition}
              style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px", minWidth: 0 }}
            >
              <Label icon={MapPin} text="Location" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "var(--t1)", lineHeight: 1.7, marginBottom: 16 }}>
                1314 Leesburg Rd #D<br />Columbia, SC 29209
              </p>
              <motion.a
                href="https://maps.app.goo.gl/wB2TWPoKvvPeR5Lb9"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
                whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
                transition={springTransition}
                style={{
                  fontSize: 11,
                  color: "var(--t3)",
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  maxWidth: "100%",
                }}
              >
                Get Directions <ChevronRight size={11} />
              </motion.a>
              <p style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.65, marginTop: 16 }}>
                Easy parking and quick in-and-out access right off Leesburg Rd.
              </p>
            </motion.div>

            {/* Hours */}
            <motion.div
              variants={revealItemVariants}
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              transition={springTransition}
              style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px", minWidth: 0 }}
            >
              <Label icon={Clock} text="Hours" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", border: `1px solid rgba(201,168,76,.24)`, marginBottom: 16, maxWidth: "100%" }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: G, flexShrink: 0 }} />
                <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: G, fontFamily: "system-ui,sans-serif" }}>
                  Walk-ins welcome
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {HOURS.map(([day, hrs]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--t2)" }}>{day}</span>
                    <span style={{ fontSize: 13, color: hrs === "Closed" ? "var(--t3)" : "var(--t1)", textAlign: "right" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Book */}
            <motion.div
              variants={revealItemVariants}
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              transition={springTransition}
              style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px", minWidth: 0 }}
            >
              <Label icon={Phone} text="Book" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7, marginBottom: 16 }}>
                Walk-ins welcome.<br />Appointments recommended.
              </p>
              <p style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.65, marginBottom: 20 }}>
                Local favorite for reliable fades, beard work, and sharp finishing details.
              </p>
              <motion.a
                href="tel:8037832993"
                whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
                whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
                transition={springTransition}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px 0", background: G, color: "#080808",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                  textDecoration: "none", fontFamily: "system-ui,sans-serif", width: "100%"
                }}
              >
                <Phone size={13} /> (803) 783-2993
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ BOOKING DRAWER ═════════════════════════════ */}
      {isBookingOpen && (
        <div
          data-testid="booking-drawer"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflowX: "hidden",
          }}
        >
          <button
            type="button"
            aria-label="Close booking drawer"
            onClick={closeBookingDrawer}
            style={{
              position: "absolute",
              inset: 0,
              border: "none",
              background: "rgba(0, 0, 0, 0.62)",
              cursor: "pointer",
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-drawer-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springTransition}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 620,
              maxHeight: "90svh",
              overflowY: "auto",
              overflowX: "hidden",
              borderTop: LINE,
              borderLeft: LINE,
              borderRight: LINE,
              background: "var(--bg1)",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: "22px 18px 24px",
              boxShadow: "0 -12px 40px rgba(0,0,0,.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: G, marginBottom: 4 }}>Book Appointment</p>
                <h3 id="booking-drawer-title" style={{ fontFamily: "Georgia,serif", fontSize: 26, color: "var(--t1)", lineHeight: 1.05 }}>
                  Quick Booking
                </h3>
              </div>

              <button
                type="button"
                onClick={closeBookingDrawer}
                aria-label="Close"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: LINE,
                  background: "var(--bg2)",
                  color: "var(--t2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ border: LINE, background: "var(--bg2)", padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 8 }}>
                Selected Service
              </p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 20, color: G, marginBottom: 6 }}>
                {selectedService?.name}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", color: "var(--t2)", fontSize: 13 }}>
                <span>Duration: <strong>{selectedService?.duration}</strong></span>
                <span>Starting at: <strong>{selectedService?.price}</strong></span>
              </div>
            </div>

            {bookingSubmitted ? (
              <div data-testid="booking-success" style={{ border: `1px solid rgba(201,168,76,.35)`, background: "rgba(201,168,76,.08)", padding: "16px 14px" }}>
                <p style={{ color: G, fontFamily: "Georgia,serif", fontSize: 22, marginBottom: 8 }}>Request Received</p>
                <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.7, marginBottom: 14 }}>
                  Thanks, {bookingForm.name || "there"}. We&apos;ll reach out at {bookingForm.phone || "your number"} to confirm your appointment.
                </p>
                <button
                  type="button"
                  onClick={closeBookingDrawer}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 16px",
                    border: LINE,
                    background: "var(--bg1)",
                    color: "var(--t1)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "system-ui,sans-serif",
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {bookingStep === 1 ? (
                  <div data-testid="booking-step-1" style={{ display: "grid", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Name *</span>
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={bookingForm.name}
                        onChange={(event) => updateBookingField("name", event.target.value)}
                        required
                        style={{ width: "100%", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Phone *</span>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(event) => updateBookingField("phone", event.target.value)}
                        required
                        style={{ width: "100%", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Service *</span>
                      <select
                        value={bookingForm.service}
                        onChange={(event) => updateBookingField("service", event.target.value)}
                        required
                        style={{ width: "100%", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      >
                        {SERVICES.map((service) => (
                          <option key={service.name} value={service.name}>
                            {service.name} ({service.duration}) · {service.price}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                      <button
                        type="button"
                        data-testid="booking-next"
                        onClick={handleBookingNext}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 18px",
                          background: G,
                          border: "none",
                          color: "#080808",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          fontFamily: "system-ui,sans-serif",
                        }}
                      >
                        Next <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div data-testid="booking-step-2" style={{ display: "grid", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Preferred barber</span>
                      <select
                        value={bookingForm.barber}
                        onChange={(event) => updateBookingField("barber", event.target.value)}
                        style={{ width: "100%", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      >
                        <option value="No preference">No preference</option>
                        {BARBERS.map((barber) => (
                          <option key={barber.name} value={barber.name}>
                            {barber.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Preferred time window</span>
                      <select
                        value={bookingForm.timeWindow}
                        onChange={(event) => updateBookingField("timeWindow", event.target.value)}
                        style={{ width: "100%", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      >
                        <option value="No preference">No preference</option>
                        <option value="Morning (9AM–12PM)">Morning (9AM–12PM)</option>
                        <option value="Afternoon (12PM–4PM)">Afternoon (12PM–4PM)</option>
                        <option value="Evening (4PM–7PM)">Evening (4PM–7PM)</option>
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--t2)" }}>Notes</span>
                      <textarea
                        value={bookingForm.notes}
                        onChange={(event) => updateBookingField("notes", event.target.value)}
                        rows={4}
                        style={{ width: "100%", resize: "vertical", padding: "11px 12px", border: LINE, background: "var(--bg0)", color: "var(--t1)", fontSize: 14 }}
                      />
                    </label>

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={handleBookingBack}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px 16px",
                          border: LINE,
                          background: "var(--bg2)",
                          color: "var(--t1)",
                          fontSize: 11,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          fontFamily: "system-ui,sans-serif",
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        data-testid="booking-submit"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px 18px",
                          background: G,
                          border: "none",
                          color: "#080808",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          fontFamily: "system-ui,sans-serif",
                        }}
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* ══ FOOTER ════════════════════════════════════ */}
      <footer style={{ background: "var(--bg0)", borderTop: LINE, padding: "20px 0" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="pole" style={{ height: 18 }} />
            <Scissors size={12} style={{ color: G }} />
            <span style={{ fontFamily: "Georgia,serif", fontSize: 13, color: G, letterSpacing: "0.2em" }}>A1 CUTS</span>
          </div>
          <span style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "0.05em" }}>© {new Date().getFullYear()} A1 Cuts · Columbia, SC</span>
        </div>
      </footer>
    </>
  );
}
