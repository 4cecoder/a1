"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Scissors, MapPin, Phone, Clock, Star, ChevronRight, User } from "lucide-react";
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
  { name: "Classic Cut",     price: "$25", desc: "Clean, sharp, timeless.",         popular: false },
  { name: "Fade",            price: "$30", desc: "Low, mid, or high — dialed in.",   popular: true  },
  { name: "Beard Trim",      price: "$15", desc: "Lined up and looking right.",      popular: false },
  { name: "Cut + Beard",     price: "$40", desc: "The full treatment.",              popular: true  },
  { name: "Hot Towel Shave", price: "$35", desc: "Old school. The real deal.",       popular: false },
  { name: "Kid's Cut",       price: "$18", desc: "Ages 12 and under.",               popular: false },
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
            <motion.a
              href="tel:8037832993"
              whileHover={!reducedMotion ? cardInteraction.whileHover : undefined}
              whileTap={!reducedMotion ? cardInteraction.whileTap : undefined}
              transition={springTransition}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", background: G, color: "#080808",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
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
                padding: "13px 28px", border: LINE,
                color: "var(--t2)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
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
