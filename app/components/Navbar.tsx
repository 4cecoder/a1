"use client";
import { useState } from "react";
import { Scissors, Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", inset: "0 0 auto 0", zIndex: 100,
      background: "rgba(8,8,8,0.94)", borderBottom: "1px solid var(--line)",
      backdropFilter: "blur(12px)"
    }}>
      <div className="wrap" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Brand */}
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div className="pole" style={{ height: 28 }} />
          <Scissors size={14} style={{ color: "var(--gold)" }} />
          <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 16, color: "var(--gold)", letterSpacing: "0.2em" }}>
            A1 CUTS
          </span>
        </a>

        {/* Desktop links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="d-nav">
          {["Services", "Barbers", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--t2)", textDecoration: "none", fontFamily: "system-ui,sans-serif"
            }}>{l}</a>
          ))}
          <a href="tel:8037832993" style={{
            fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "8px 18px", border: "1px solid var(--gold)",
            color: "var(--gold)", textDecoration: "none", fontFamily: "system-ui,sans-serif",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Phone size={11} /> Book
          </a>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(o => !o)} className="m-toggle" style={{
          background: "none", border: "none", cursor: "pointer", color: "var(--gold)", display: "none"
        }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: "var(--bg1)", borderTop: "1px solid var(--line)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18
        }}>
          {["Services", "Barbers", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} style={{
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--t2)", textDecoration: "none"
            }}>{l}</a>
          ))}
          <a href="tel:8037832993" onClick={() => setOpen(false)} style={{
            fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            color: "var(--gold)", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Phone size={11} /> Book Now
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .d-nav  { display: none !important; }
          .m-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
