"use client";
import { useState } from "react";
import { Scissors, Menu, X, Phone } from "lucide-react";

const gold = "#C9A84C";
const NAV_LINKS = ["Services", "Barbers", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.96)", borderBottom: "1px solid #1a1a1a", backdropFilter: "blur(10px)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 no-underline">
          <div className="pole-stripe h-7" />
          <Scissors size={15} style={{ color: gold }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", color: gold, letterSpacing: "0.2em", fontSize: 17 }}>
            A1 CUTS
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="font-sans text-xs tracking-[0.2em] uppercase no-underline transition-colors"
              style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = gold)}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
              {l}
            </a>
          ))}
          <a href="tel:8037832993"
            className="font-sans font-bold text-xs tracking-[0.15em] uppercase flex items-center gap-2 px-5 py-2 no-underline transition-colors"
            style={{ border: `1px solid ${gold}`, color: gold }}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = "#0a0a0a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = gold; }}>
            <Phone size={12} /> Book Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden bg-transparent border-none cursor-pointer p-1"
          style={{ color: gold }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#0f0f0f", borderTop: "1px solid #1a1a1a" }}
          className="md:hidden px-4 py-5 flex flex-col gap-5">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              className="font-sans text-xs tracking-[0.2em] uppercase no-underline"
              style={{ color: "#666" }}>
              {l}
            </a>
          ))}
          <a href="tel:8037832993" onClick={() => setOpen(false)}
            className="font-sans font-bold text-xs tracking-[0.15em] uppercase flex items-center gap-2 no-underline"
            style={{ color: gold }}>
            <Phone size={12} /> BOOK NOW
          </a>
        </div>
      )}
    </nav>
  );
}
