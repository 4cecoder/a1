import type { BookingSlot, BookingStep } from "@/lib/types/booking";
import { formatBookingPrice, type BarberPreference, type BookingService } from "@/lib/types/booking";

type CheckoutPanelProps = {
  service: BookingService | null;
  barber: BarberPreference | null;
  slot: BookingSlot | null;
  onBack: (step: BookingStep) => void;
  onConfirm: () => void;
  errorMessage?: string | null;
  pending?: boolean;
};

export default function CheckoutPanel({
  service,
  barber,
  slot,
  onBack,
  onConfirm,
  errorMessage,
  pending,
}: CheckoutPanelProps) {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, marginBottom: 6 }}>Checkout summary</h2>
        <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6 }}>
          Confirm your details. Final submit will be wired to server actions/Convex next.
        </p>
      </div>

      <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--bg2)", padding: 14, display: "grid", gap: 10 }}>
        <SummaryRow label="Service" value={service ? `${service.name} (${service.durationMin} min)` : "—"} />
        <SummaryRow label="Barber" value={barber?.label ?? "—"} />
        <SummaryRow label="When" value={slot?.label ?? "—"} />
        <SummaryRow label="Total" value={service ? formatBookingPrice(service.priceCents) : "—"} valueEmphasis />
      </div>

      {errorMessage ? (
        <p style={{ border: "1px solid #5a2626", background: "#281111", color: "#ffb4b4", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
          {errorMessage}
        </p>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        <button
          type="button"
          onClick={() => onBack("slot")}
          style={{
            border: "1px solid var(--line)",
            background: "transparent",
            color: "var(--t2)",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Back to slots
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          style={{
            border: "1px solid var(--gold)",
            background: pending ? "rgba(201,168,76,0.3)" : "var(--gold)",
            color: "#080808",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
          }}
        >
          {pending ? "Confirming..." : "Confirm booking"}
        </button>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  valueEmphasis,
}: {
  label: string;
  value: string;
  valueEmphasis?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span style={{ color: "var(--t3)", fontSize: 13 }}>{label}</span>
      <span style={{ color: valueEmphasis ? "var(--gold)" : "var(--t1)", fontSize: 13, fontWeight: valueEmphasis ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}
