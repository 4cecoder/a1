"use client";
import Navbar from "./components/Navbar";
import { Scissors, MapPin, Phone, Clock, Star, ChevronRight, User } from "lucide-react";

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
  return (
    <>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100svh", display: "flex", alignItems: "center", paddingTop: 64,
        background: "linear-gradient(160deg, var(--bg0) 60%, #130000 100%)"
      }}>
        <div className="wrap" style={{ paddingBlock: "80px 72px" }}>

          {/* Headline block */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
            <div className="pole" style={{ height: 100 }} />
            <div>
              {/* Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {["EST. 2010", "COLUMBIA, SC"].map((t, i) => (
                  <span key={t} style={{
                    fontSize: 10, letterSpacing: "0.2em", padding: "4px 10px",
                    border: `1px solid ${i === 0 ? "rgba(201,168,76,.35)" : "var(--line)"}`,
                    color: i === 0 ? G : "var(--t3)", fontFamily: "system-ui,sans-serif"
                  }}>{t}</span>
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
          </div>

          {/* Subline */}
          <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 420, lineHeight: 1.7, marginBottom: 36 }}>
            Premium cuts. Classic craft.<br />Walk in looking good, walk out looking great.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            <a href="tel:8037832993" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", background: G, color: "#080808",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none", fontFamily: "system-ui,sans-serif"
            }}>
              <Phone size={13} /> CALL TO BOOK
            </a>
            <a href="#services" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", border: LINE,
              color: "var(--t2)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none", fontFamily: "system-ui,sans-serif"
            }}>
              VIEW SERVICES <ChevronRight size={13} />
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", paddingTop: 28, borderTop: LINE }}>
            {[["10+","Years Open"], ["3","Expert Barbers"], ["5★","Rated"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, color: G }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--t3)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════ */}
      <section id="services" style={{ background: "var(--bg1)", borderTop: LINE, borderBottom: LINE }}>
        <div className="wrap" style={{ paddingBlock: "80px" }}>
          <SectionHead label="What We Do" icon={Scissors} title="Services" />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 1, background: "var(--line)"
          }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{
                background: "var(--bg1)", padding: "28px 24px",
                display: "flex", flexDirection: "column", gap: 12
              }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BARBERS ═══════════════════════════════════ */}
      <section id="barbers" style={{ background: "var(--bg0)", borderBottom: LINE }}>
        <div className="wrap" style={{ paddingBlock: "80px" }}>
          <SectionHead label="The Team" icon={User} title="Your Barbers" />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16
          }}>
            {BARBERS.map(b => (
              <div key={b.name} style={{
                background: "var(--bg2)", border: LINE,
                padding: "36px 24px", textAlign: "center"
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "var(--bg1)", border: `1px solid rgba(201,168,76,.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px"
                }}>
                  <Scissors size={18} style={{ color: G }} />
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>{b.name}</h3>
                <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: G, marginBottom: 16 }}>{b.role}</p>
                <div style={{ height: 1, background: "var(--line)", marginBottom: 14 }} />
                <p style={{ fontSize: 12, color: "var(--t2)" }}>{b.spec}</p>
                <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 4 }}>{b.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════ */}
      <section id="contact" style={{ background: "var(--bg1)" }}>
        <div className="wrap" style={{ paddingBlock: "80px" }}>
          <SectionHead label="Find Us" icon={MapPin} title="Contact & Hours" />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}>
            {/* Location */}
            <div style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px" }}>
              <Label icon={MapPin} text="Location" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "var(--t1)", lineHeight: 1.7, marginBottom: 16 }}>
                1314 Leesburg Rd #D<br />Columbia, SC 29209
              </p>
              <a href="https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209"
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "var(--t3)", textDecoration: "none", letterSpacing: "0.1em",
                  display: "inline-flex", alignItems: "center", gap: 4 }}>
                Get Directions <ChevronRight size={11} />
              </a>
            </div>

            {/* Hours */}
            <div style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px" }}>
              <Label icon={Clock} text="Hours" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {HOURS.map(([day, hrs]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--t2)" }}>{day}</span>
                    <span style={{ fontSize: 13, color: hrs === "Closed" ? "var(--t3)" : "var(--t1)" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book */}
            <div style={{ background: "var(--bg2)", border: LINE, padding: "28px 24px" }}>
              <Label icon={Phone} text="Book" />
              <div style={{ height: 1, background: "var(--line)", marginBottom: 20 }} />
              <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7, marginBottom: 24 }}>
                Walk-ins welcome.<br />Appointments recommended.
              </p>
              <a href="tel:8037832993" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 0", background: G, color: "#080808",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                textDecoration: "none", fontFamily: "system-ui,sans-serif", width: "100%"
              }}>
                <Phone size={13} /> (803) 783-2993
              </a>
            </div>
          </div>
        </div>
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
