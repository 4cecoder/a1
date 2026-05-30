import Link from "next/link";
import { getBarberPreference, getBookingService } from "@/lib/types/booking";
import { confirmCheckout } from "@/lib/server-actions/checkout/actions";

type ConfirmPageProps = {
  searchParams: Promise<{
    service?: string;
    barber?: string;
    date?: string;
    slot?: string;
    intent?: string;
    simulation?: "none" | "intent_failure" | "capture_failure";
  }>;
};

export default async function BookingConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = await searchParams;

  const service = getBookingService(params.service ?? null);
  const barber = getBarberPreference((params.barber as Parameters<typeof getBarberPreference>[0]) ?? null);
  const intentId = params.intent?.trim() ?? "";

  if (!intentId) {
    return (
      <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
        <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 16 }}>
          <span style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Booking checkout
          </span>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 8vw, 48px)", lineHeight: 1 }}>
            Missing payment intent
          </h1>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>
            We could not find your payment intent. Please return to booking and confirm again.
          </p>
          <Link
            href="/book"
            style={{
              border: "1px solid var(--gold)",
              background: "var(--gold)",
              color: "#080808",
              textDecoration: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Return to booking
          </Link>
        </div>
      </main>
    );
  }

  const result = await confirmCheckout({
    intentId,
    simulation: params.simulation ?? "none",
  });

  const retryParams = new URLSearchParams({
    service: params.service ?? "",
    barber: params.barber ?? "",
    date: params.date ?? "",
    slot: params.slot ?? "",
    intent: intentId,
  });

  if (!result.ok) {
    const recoverable =
      result.code === "capture_failed" ||
      result.code === "intent_failed" ||
      result.code === "intent_not_found" ||
      result.code === "validation_error";

    return (
      <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
        <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 16 }}>
          <span style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Booking submitted
          </span>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 8vw, 48px)", lineHeight: 1 }}>
            We could not finalize payment
          </h1>

          <div style={{ border: "1px solid #5a2626", background: "#281111", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
            <p style={{ color: "#ffb4b4", fontSize: 14 }}>{result.error}</p>
            <p style={{ color: "#ffb4b4", opacity: 0.8, fontSize: 12 }}>Reference: {result.code}</p>
          </div>

          <div style={{ border: "1px solid var(--line)", background: "var(--bg1)", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
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
            {recoverable ? (
              <Link
                href={`/book/confirm?${retryParams.toString()}`}
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
                Try payment again
              </Link>
            ) : null}
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
              Pick a different slot
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--t1)" }}>
      <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 16 }}>
        <span style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Booking submitted
        </span>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 8vw, 48px)", lineHeight: 1 }}>
          Payment confirmed
        </h1>

        <div style={{ border: "1px solid var(--line)", background: "var(--bg1)", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
          <p style={{ fontSize: 13 }}>
            <strong>Service:</strong> {service?.name ?? result.data.receipt.serviceName}
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
          <p style={{ fontSize: 13 }}>
            <strong>Receipt ID:</strong> {result.data.receipt.id}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={`/book/receipt/${result.data.receipt.id}`}
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
            View receipt
          </Link>
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
        </div>
      </div>
    </main>
  );
}
