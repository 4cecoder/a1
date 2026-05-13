"use client";
import { useState } from "react";

const NAV_LINKS = ["Services", "Barbers", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #222",
      backdropFilter: "blur(8px)"
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64
      }}>
        {/* Logo */}
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div className="pole-stripe" style={{ height: 32, borderRadius: 2 }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 20, color: "#C9A84C", letterSpacing: 2 }}>
            A1 CUTS
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32 }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: "#ccc", textDecoration: "none", fontSize: 13,
              letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif"
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
            >{l}</a>
          ))}
          <a href="#contact" style={{
            padding: "8px 20px", border: "1px solid #C9A84C",
            color: "#C9A84C", textDecoration: "none", fontSize: 12,
            letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif"
          }}>Book Now</a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{
          display: "none", background: "none", border: "none",
          color: "#C9A84C", fontSize: 24, cursor: "pointer"
        }} className="hamburger">☰</button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "#111", padding: "16px 24px",
          display: "flex", flexDirection: "column", gap: 16
        }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{ color: "#ccc", textDecoration: "none", letterSpacing: 2, fontSize: 13, fontFamily: "sans-serif" }}>
              {l.toUpperCase()}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} style={{
            color: "#C9A84C", letterSpacing: 2, fontSize: 13, fontFamily: "sans-serif"
          }}>BOOK NOW</a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
