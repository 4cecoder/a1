import Link from "next/link";
import { getBarberPreference, getBookingService } from "@/lib/types/booking";

type ConfirmPageProps = {
  searchParams: Promise<{
    service?: string;
    barber?: string;
    date?: string;
    slot?: string;
  }>;
};

export default async function BookingConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = await searchParams;

  const service = getBookingService(params.service ?? null);
  const barber = getBarberPreference((params.barber as Parameters<typeof getBarberPreference>[0]) ?? null);

  return (
    <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
      <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 16 }}>
        <span style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Booking submitted
        </span>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 8vw, 48px)", lineHeight: 1 }}>
          You are all set
        </h1>

        <div style={{ border: "1px solid var(--line)", background: "var(--bg1)", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>
            Final persistence and notifications will be wired in next waves.
          </p>
          <p style={{ fontSize: 13 }}>
            <strong>Service:</strong> {service?.name ?? "Unknown"}
          </p>
          <p style={{ fontSize: 13 }}>
            <strong>Barber:</strong> {barber?.label ?? "Unknown"}
          </p>
          <p style={{ fontSize: 13 }}>
            <strong>Date:</strong> {params.date ?? "Unknown"}
          </p>
          <p style={{ fontSize: 13 }}>
            <strong>Slot ID:</strong> {params.slot ?? "Unknown"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/book"
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              color: "var(--t2)",
              textDecoration: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
            }}
          >
            Book another appointment
          </Link>
          <Link
            href="/"
            style={{
              border: "1px solid var(--gold)",
              background: "var(--gold)",
              color: "#080808",
              textDecoration: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
