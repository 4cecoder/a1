import type { BarberPreference, BookingService, BarberPreferenceId } from "@/lib/types/booking";

type ServicePickerProps = {
  services: BookingService[];
  barbers: BarberPreference[];
  selectedServiceId: string | null;
  selectedBarberId: BarberPreferenceId | null;
  onSelectService: (serviceId: string) => void;
  onSelectBarber: (barberId: BarberPreferenceId) => void;
  errorMessage?: string | null;
};

export default function ServicePicker({
  services,
  barbers,
  selectedServiceId,
  selectedBarberId,
  onSelectService,
  onSelectBarber,
  errorMessage,
}: ServicePickerProps) {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, marginBottom: 6 }}>Choose a service</h2>
        <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6 }}>
          Select what you need first, then choose barber preference.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {services.map((service) => {
          const selected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              style={{
                width: "100%",
                textAlign: "left",
                border: selected ? "1px solid var(--gold)" : "1px solid var(--line)",
                background: selected ? "rgba(201,168,76,0.08)" : "var(--bg2)",
                color: "var(--t1)",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <strong style={{ fontSize: 16 }}>{service.name}</strong>
                <span style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.06em" }}>
                  ${service.priceCents / 100}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.5 }}>{service.description}</p>
              <span style={{ fontSize: 12, color: "var(--t3)" }}>{service.durationMin} min</span>
            </button>
          );
        })}
      </div>

      <div>
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: 22, marginBottom: 8 }}>Barber preference</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {barbers.map((barber) => {
            const selected = selectedBarberId === barber.id;
            return (
              <button
                key={barber.id}
                type="button"
                onClick={() => onSelectBarber(barber.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: selected ? "1px solid var(--gold)" : "1px solid var(--line)",
                  background: selected ? "rgba(201,168,76,0.08)" : "var(--bg2)",
                  color: "var(--t1)",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontSize: 15 }}>{barber.label}</strong>
                <span style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5 }}>{barber.bio}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage ? (
        <p style={{ border: "1px solid #5a2626", background: "#281111", color: "#ffb4b4", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
