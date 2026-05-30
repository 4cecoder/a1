import type { BookingDateOption, BookingSlot } from "@/lib/types/booking";

type SlotPickerProps = {
  dates: BookingDateOption[];
  slots: BookingSlot[];
  selectedDateKey: string | null;
  selectedSlotId: string | null;
  onSelectDate: (dateKey: string) => void;
  onSelectSlot: (slotId: string) => void;
  errorMessage?: string | null;
  unavailableMessage?: string | null;
};

export default function SlotPicker({
  dates,
  slots,
  selectedDateKey,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
  errorMessage,
  unavailableMessage,
}: SlotPickerProps) {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, marginBottom: 6 }}>Pick date and time</h2>
        <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6 }}>
          Slots update based on service length and barber preference.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {dates.map((date) => {
          const selected = selectedDateKey === date.dateKey;
          return (
            <button
              key={date.dateKey}
              type="button"
              onClick={() => onSelectDate(date.dateKey)}
              style={{
                border: selected ? "1px solid var(--gold)" : "1px solid var(--line)",
                background: selected ? "rgba(201,168,76,0.08)" : "var(--bg2)",
                color: selected ? "var(--gold)" : "var(--t2)",
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 12,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {date.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 8 }}>
        {slots.map((slot) => {
          const selected = selectedSlotId === slot.id;
          const unavailable = slot.status !== "open";
          return (
            <button
              key={slot.id}
              type="button"
              disabled={unavailable}
              onClick={() => onSelectSlot(slot.id)}
              style={{
                border: selected ? "1px solid var(--gold)" : "1px solid var(--line)",
                background: unavailable ? "#181818" : selected ? "rgba(201,168,76,0.08)" : "var(--bg2)",
                color: unavailable ? "var(--t3)" : selected ? "var(--gold)" : "var(--t1)",
                borderRadius: 10,
                padding: "10px 8px",
                fontSize: 12,
                cursor: unavailable ? "not-allowed" : "pointer",
                opacity: unavailable ? 0.65 : 1,
              }}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      {unavailableMessage ? (
        <p style={{ border: "1px solid #5a2626", background: "#281111", color: "#ffb4b4", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
          {unavailableMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p style={{ border: "1px solid #5a2626", background: "#281111", color: "#ffb4b4", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
