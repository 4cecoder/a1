import Navbar from "./components/Navbar";

const SERVICES = [
  { name: "Classic Cut", price: "$25", desc: "Clean, sharp, timeless." },
  { name: "Fade", price: "$30", desc: "Low, mid, or high — dialed in." },
  { name: "Beard Trim", price: "$15", desc: "Lined up and looking right." },
  { name: "Cut + Beard", price: "$40", desc: "The full treatment." },
  { name: "Hot Towel Shave", price: "$35", desc: "Old school. The real deal." },
  { name: "Kid's Cut", price: "$18", desc: "Ages 12 and under." },
];

const BARBERS = [
  { name: "Marcus", title: "Master Barber", years: "12 yrs" },
  { name: "DeShawn", title: "Senior Barber", years: "8 yrs" },
  { name: "Ray", title: "Barber", years: "4 yrs" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #0a0a0a 60%, #1a0000 100%)",
        borderBottom: "1px solid #222", paddingTop: 64
      }}>
        <div className="section" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div className="pole-stripe" style={{ height: 80, borderRadius: 2 }} />
            <div>
              <p style={{
                fontFamily: "sans-serif", fontSize: 11, letterSpacing: 4,
                color: "#C9A84C", textTransform: "uppercase", marginBottom: 8
              }}>Est. 2010 · Columbia, SC</p>
              <h1 style={{
                fontSize: "clamp(48px, 10vw, 96px)", fontFamily: "Georgia, serif",
                fontWeight: "bold", lineHeight: 1, color: "#fff"
              }}>
A1<br />
              <span style={{ color: "#C9A84C" }}>CUTS</span>
              </h1>
            </div>
          </div>
          <p style={{
            fontSize: 18, color: "#888", maxWidth: 480,
            lineHeight: 1.7, fontFamily: "sans-serif", marginBottom: 40
          }}>
            Premium cuts. Classic craft. Walk in looking good, walk out looking great.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#contact" style={{
              padding: "14px 32px", background: "#C9A84C", color: "#0a0a0a",
              textDecoration: "none", fontFamily: "sans-serif", fontWeight: "bold",
              fontSize: 13, letterSpacing: 2, textTransform: "uppercase"
            }}>Book Appointment</a>
            <a href="#services" style={{
              padding: "14px 32px", border: "1px solid #333", color: "#ccc",
              textDecoration: "none", fontFamily: "sans-serif",
              fontSize: 13, letterSpacing: 2, textTransform: "uppercase"
            }}>Our Services</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "#111", borderBottom: "1px solid #222" }}>
        <div className="section">
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 4, color: "#C9A84C", textTransform: "uppercase", marginBottom: 8 }}>What We Do</p>
          <h2 style={{ fontSize: 40, fontFamily: "Georgia, serif", color: "#fff", marginBottom: 48 }}>Services</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 1, background: "#222"
          }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{
                background: "#111", padding: "32px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", marginBottom: 6 }}>{s.name}</h3>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#666" }}>{s.desc}</p>
                </div>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#C9A84C", marginLeft: 16, flexShrink: 0 }}>{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BARBERS */}
      <section id="barbers" style={{ background: "#0a0a0a", borderBottom: "1px solid #222" }}>
        <div className="section">
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 4, color: "#C9A84C", textTransform: "uppercase", marginBottom: 8 }}>The Team</p>
          <h2 style={{ fontSize: 40, fontFamily: "Georgia, serif", color: "#fff", marginBottom: 48 }}>Your Barbers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {BARBERS.map(b => (
              <div key={b.name} style={{
                border: "1px solid #222", padding: "40px 32px",
                background: "#111", textAlign: "center"
              }}>
                {/* Avatar placeholder */}
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a1a, #333)",
                  border: "2px solid #C9A84C", margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, color: "#C9A84C"
                }}>✂</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#fff", marginBottom: 4 }}>{b.name}</h3>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{b.title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#555" }}>{b.years} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "#111" }}>
        <div className="section">
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 4, color: "#C9A84C", textTransform: "uppercase", marginBottom: 8 }}>Find Us</p>
          <h2 style={{ fontSize: 40, fontFamily: "Georgia, serif", color: "#fff", marginBottom: 48 }}>Contact & Hours</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 48 }}>
            <div>
              <h4 style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3, color: "#C9A84C", textTransform: "uppercase", marginBottom: 16 }}>Location</h4>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#fff", lineHeight: 1.6 }}>1314 Leesburg Rd #D<br />Columbia, SC 29209</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#666", marginTop: 12 }}>(803) 555-0199</p>
            </div>
            <div>
              <h4 style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3, color: "#C9A84C", textTransform: "uppercase", marginBottom: 16 }}>Hours</h4>
              {[
                ["Mon – Fri", "9AM – 7PM"],
                ["Saturday", "9AM – 6PM"],
                ["Sunday", "Closed"],
              ].map(([day, hours]) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, maxWidth: 280 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#888" }}>{day}</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#fff" }}>{hours}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3, color: "#C9A84C", textTransform: "uppercase", marginBottom: 16 }}>Book Online</h4>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                Walk-ins welcome. Appointments recommended.
              </p>
              <a href="tel:8035550199" style={{
                display: "inline-block", padding: "12px 28px",
                background: "#C9A84C", color: "#0a0a0a",
                textDecoration: "none", fontFamily: "sans-serif",
                fontWeight: "bold", fontSize: 12, letterSpacing: 2, textTransform: "uppercase"
              }}>Call to Book</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        padding: "24px", textAlign: "center"
      }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#444", letterSpacing: 1 }}>
          © 2025 A1 Cuts · Columbia, SC 29209
        </p>
      </footer>
    </>
  );
}
