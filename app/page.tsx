"use client";
import Navbar from "./components/Navbar";
import {
  Scissors, MapPin, Phone, Clock, Star,
  ChevronRight, User
} from "lucide-react";

const SERVICES = [
  { name: "Classic Cut", price: "$25", desc: "Clean, sharp, timeless.", popular: false },
  { name: "Fade", price: "$30", desc: "Low, mid, or high — dialed in.", popular: true },
  { name: "Beard Trim", price: "$15", desc: "Lined up and looking right.", popular: false },
  { name: "Cut + Beard", price: "$40", desc: "The full treatment.", popular: true },
  { name: "Hot Towel Shave", price: "$35", desc: "Old school. The real deal.", popular: false },
  { name: "Kid's Cut", price: "$18", desc: "Ages 12 and under.", popular: false },
];

const BARBERS = [
  { name: "Marcus", title: "Master Barber", years: "12 yrs", specialty: "Fades & Tapers" },
  { name: "DeShawn", title: "Senior Barber", years: "8 yrs", specialty: "Beards & Lineups" },
  { name: "Ray", title: "Barber", years: "4 yrs", specialty: "Classic Cuts" },
];

const HOURS = [
  ["Mon – Fri", "9AM – 7PM"],
  ["Saturday", "9AM – 6PM"],
  ["Sunday", "Closed"],
];

const gold = "#C9A84C";
const goldDim = "#a8863a";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="hero" className="min-h-screen flex items-center pt-16"
        style={{ background: "linear-gradient(135deg, #0a0a0a 55%, #150000 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">

          <div className="flex items-start gap-4 mb-8">
            <div className="pole-stripe h-20 sm:h-28 mt-1 shrink-0" />
            <div>
              {/* Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["EST. 2010", "COLUMBIA, SC"].map(t => (
                  <span key={t} className="font-sans text-[10px] tracking-[0.2em] px-2 py-1 border"
                    style={{ borderColor: t === "EST. 2010" ? `${gold}44` : "#2a2a2a", color: t === "EST. 2010" ? gold : "#555" }}>
                    {t}
                  </span>
                ))}
              </div>
              {/* Headline */}
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(48px,12vw,104px)", lineHeight: 1, color: "#fff", fontWeight: "bold" }}>
                A1<br /><span style={{ color: gold }}>CUTS</span>
              </h1>
            </div>
          </div>

          <p className="font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-md" style={{ color: "#777" }}>
            Premium cuts. Classic craft. Walk in looking good, walk out looking great.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:8037832993" className="font-sans font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 px-8 py-4 transition-colors no-underline"
              style={{ background: gold, color: "#0a0a0a" }}
              onMouseEnter={e => (e.currentTarget.style.background = goldDim)}
              onMouseLeave={e => (e.currentTarget.style.background = gold)}>
              <Phone size={14} /> CALL TO BOOK
            </a>
            <a href="#services" className="font-sans text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 px-8 py-4 border transition-colors no-underline"
              style={{ borderColor: "#2a2a2a", color: "#777" }}>
              VIEW SERVICES <ChevronRight size={13} />
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 sm:gap-14 mt-12 pt-10 border-t" style={{ borderColor: "#1a1a1a" }}>
            {[["10+", "Years Open"], ["3", "Barbers"], ["5★", "Rated"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: gold, fontWeight: "bold" }}>{val}</div>
                <div className="font-sans text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: "#444" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-2">
            <Scissors size={13} style={{ color: gold }} />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase" style={{ color: gold }}>What We Do</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,5vw,40px)", color: "#fff", fontWeight: "bold", marginBottom: 40 }}>Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ border: "1px solid #1a1a1a", gap: 1, background: "#1a1a1a" }}>
            {SERVICES.map(s => (
              <div key={s.name} className="group transition-colors p-5 sm:p-7 flex flex-col justify-between" style={{ background: "#0d0d0d", minHeight: 140 }}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-sans font-semibold text-base transition-colors"
                      style={{ color: "#e8e8e8" }}>
                      {s.name}
                    </h3>
                    {s.popular && (
                      <span className="font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 shrink-0" style={{ color: gold, border: `1px solid ${gold}44`, background: `${gold}11` }}>
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm" style={{ color: "#555" }}>{s.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #1a1a1a" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: gold }}>{s.price}</span>
                  <Star size={12} style={{ color: "#2a2a2a" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BARBERS */}
      <section id="barbers" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-2">
            <User size={13} style={{ color: gold }} />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase" style={{ color: gold }}>The Team</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,5vw,40px)", color: "#fff", fontWeight: "bold", marginBottom: 40 }}>Your Barbers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {BARBERS.map(b => (
              <div key={b.name} className="text-center p-6 sm:p-8" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "#1a1a1a", border: `2px solid ${gold}44` }}>
                  <Scissors size={18} style={{ color: gold }} />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", fontWeight: "bold", marginBottom: 4 }}>{b.name}</h3>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: gold }}>{b.title}</p>
                <div style={{ height: 1, background: "#1e1e1e", marginBottom: 12 }} />
                <p className="font-sans text-xs" style={{ color: "#555" }}>{b.specialty}</p>
                <p className="font-sans text-xs mt-1" style={{ color: "#333" }}>{b.years} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={13} style={{ color: gold }} />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase" style={{ color: gold }}>Find Us</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,5vw,40px)", color: "#fff", fontWeight: "bold", marginBottom: 40 }}>Contact & Hours</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Location */}
            <div className="p-5 sm:p-7" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={13} style={{ color: gold }} />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase" style={{ color: gold }}>Location</span>
              </div>
              <p style={{ fontFamily: "Georgia, serif", color: "#e8e8e8", lineHeight: 1.7, marginBottom: 12 }}>
                1314 Leesburg Rd #D<br />Columbia, SC 29209
              </p>
              <a href="https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209"
                target="_blank" rel="noopener noreferrer"
                className="font-sans text-xs flex items-center gap-1 no-underline transition-colors"
                style={{ color: "#555" }}>
                Get Directions <ChevronRight size={11} />
              </a>
            </div>

            {/* Hours */}
            <div className="p-5 sm:p-7" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={13} style={{ color: gold }} />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase" style={{ color: gold }}>Hours</span>
              </div>
              <div className="flex flex-col gap-3">
                {HOURS.map(([day, hrs]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="font-sans text-sm" style={{ color: "#666" }}>{day}</span>
                    <span className="font-sans text-sm" style={{ color: hrs === "Closed" ? "#333" : "#e8e8e8" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book */}
            <div className="p-5 sm:p-7 sm:col-span-2 lg:col-span-1" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <div className="flex items-center gap-2 mb-4">
                <Phone size={13} style={{ color: gold }} />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase" style={{ color: gold }}>Book</span>
              </div>
              <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: "#555" }}>
                Walk-ins welcome.<br />Appointments recommended.
              </p>
              <a href="tel:8037832993"
                className="font-sans font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 w-full py-4 no-underline transition-colors"
                style={{ background: gold, color: "#0a0a0a" }}>
                <Phone size={13} /> (803) 783-2993
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid #141414" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="pole-stripe h-5" />
            <Scissors size={12} style={{ color: gold }} />
            <span className="font-sans text-xs tracking-[0.2em]" style={{ color: gold }}>A1 CUTS</span>
          </div>
          <p className="font-sans text-xs tracking-wide" style={{ color: "#2a2a2a" }}>© 2025 A1 Cuts · Columbia, SC</p>
        </div>
      </footer>
    </>
  );
}
