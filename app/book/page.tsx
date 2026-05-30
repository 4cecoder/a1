import BookingWizard from "@/components/booking/BookingWizard";

export default function BookPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
      <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 18 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <span style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Appointment booking
          </span>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 8vw, 48px)", lineHeight: 1 }}>
            Reserve your chair
          </h1>
          <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7, maxWidth: 580 }}>
            Mobile-first checkout flow foundation. Service and slot selection are mocked on the frontend and ready for backend wiring.
          </p>
        </header>

        <BookingWizard />
      </div>
    </main>
  );
}
