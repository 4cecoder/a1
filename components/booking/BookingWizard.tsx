"use client";

import { useMemo, useState, useTransition, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import CheckoutPanel from "@/components/booking/CheckoutPanel";
import ServicePicker from "@/components/booking/ServicePicker";
import SlotPicker from "@/components/booking/SlotPicker";
import {
  BARBER_PREFERENCES,
  BOOKING_SERVICES,
  getBarberPreference,
  getBookingService,
  isBookingPayloadComplete,
  type BookingSelection,
  type BookingStep,
} from "@/lib/types/booking";
import {
  createBookingDateOptions,
  createSlotsForDate,
  findSlotById,
  validateBookingSelection,
} from "@/lib/services/booking/slots";

const STEP_ORDER: BookingStep[] = ["service", "barber", "slot", "checkout"];

export default function BookingWizard() {
  const router = useRouter();
  const [selection, setSelection] = useState<BookingSelection>({
    serviceId: null,
    barberId: null,
    dateKey: null,
    slotId: null,
  });
  const [step, setStep] = useState<BookingStep>("service");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const service = useMemo(() => getBookingService(selection.serviceId), [selection.serviceId]);
  const barber = useMemo(() => getBarberPreference(selection.barberId), [selection.barberId]);

  const dateOptions = useMemo(() => createBookingDateOptions(7), []);

  const slots = useMemo(() => {
    if (!selection.dateKey || !barber || !service) return [];
    return createSlotsForDate({
      dateKey: selection.dateKey,
      barberId: barber.id,
      serviceDurationMin: service.durationMin,
    });
  }, [selection.dateKey, barber, service]);

  const selectedSlot = useMemo(() => findSlotById(slots, selection.slotId), [selection.slotId, slots]);

  function patchSelection(next: Partial<BookingSelection>) {
    setSelection((current) => ({ ...current, ...next }));
  }

  function onContinueFromService() {
    if (!selection.serviceId) {
      setErrorMessage("Please choose a service to continue.");
      return;
    }
    setErrorMessage(null);
    setStep("barber");
  }

  function onContinueFromBarber() {
    if (!selection.barberId) {
      setErrorMessage("Please choose a barber preference to continue.");
      return;
    }

    setErrorMessage(null);
    patchSelection({ dateKey: selection.dateKey ?? dateOptions[0]?.dateKey ?? null, slotId: null });
    setStep("slot");
  }

  function onContinueFromSlots() {
    const validationError = validateBookingSelection({
      serviceId: selection.serviceId,
      barberId: selection.barberId,
      dateKey: selection.dateKey,
      slotId: selection.slotId,
      slotsForSelectedDate: slots,
    });

    if (validationError === "missing_date") {
      setErrorMessage("Please select a date.");
      return;
    }

    if (validationError === "missing_slot") {
      setErrorMessage("Please select a time slot.");
      return;
    }

    if (validationError === "slot_unavailable") {
      setUnavailableMessage("That slot is no longer available. Please pick another time.");
      patchSelection({ slotId: null });
      return;
    }

    setErrorMessage(null);
    setUnavailableMessage(null);
    setStep("checkout");
  }

  function backTo(target: BookingStep) {
    setErrorMessage(null);
    setUnavailableMessage(null);
    setStep(target);
  }

  function onConfirmBooking() {
    const validationError = validateBookingSelection({
      serviceId: selection.serviceId,
      barberId: selection.barberId,
      dateKey: selection.dateKey,
      slotId: selection.slotId,
      slotsForSelectedDate: slots,
    });

    if (validationError === "slot_unavailable") {
      setUnavailableMessage("That slot was just taken. Choose another slot to continue.");
      setStep("slot");
      patchSelection({ slotId: null });
      return;
    }

    if (validationError) {
      setErrorMessage("Please complete all required fields before confirming.");
      return;
    }

    if (!isBookingPayloadComplete(selection)) {
      setErrorMessage("Booking details are incomplete. Please review and try again.");
      return;
    }

    // Placeholder for server action / Convex mutation call.
    startTransition(() => {
      const params = new URLSearchParams({
        service: selection.serviceId,
        barber: selection.barberId,
        date: selection.dateKey,
        slot: selection.slotId,
      });
      router.push(`/book/confirm?${params.toString()}`);
    });
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <WizardProgress step={step} />

      <div style={{ border: "1px solid var(--line)", background: "var(--bg1)", borderRadius: 16, padding: 14 }}>
        {step === "service" ? (
          <>
            <ServicePicker
              services={BOOKING_SERVICES}
              barbers={BARBER_PREFERENCES}
              selectedServiceId={selection.serviceId}
              selectedBarberId={selection.barberId}
              onSelectService={(serviceId) => patchSelection({ serviceId })}
              onSelectBarber={(barberId) => patchSelection({ barberId })}
              errorMessage={errorMessage}
            />
            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                onClick={onContinueFromService}
                style={ctaButtonStyle}
              >
                Continue to barber preference
              </button>
            </div>
          </>
        ) : null}

        {step === "barber" ? (
          <>
            <ServicePicker
              services={BOOKING_SERVICES}
              barbers={BARBER_PREFERENCES}
              selectedServiceId={selection.serviceId}
              selectedBarberId={selection.barberId}
              onSelectService={(serviceId) => patchSelection({ serviceId })}
              onSelectBarber={(barberId) => patchSelection({ barberId })}
              errorMessage={errorMessage}
            />
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button type="button" onClick={() => backTo("service")} style={ghostButtonStyle}>
                Back
              </button>
              <button type="button" onClick={onContinueFromBarber} style={ctaButtonStyle}>
                Continue to date & slot
              </button>
            </div>
          </>
        ) : null}

        {step === "slot" ? (
          <>
            <SlotPicker
              dates={dateOptions}
              slots={slots}
              selectedDateKey={selection.dateKey}
              selectedSlotId={selection.slotId}
              onSelectDate={(dateKey) => patchSelection({ dateKey, slotId: null })}
              onSelectSlot={(slotId) => {
                setErrorMessage(null);
                setUnavailableMessage(null);
                patchSelection({ slotId });
              }}
              errorMessage={errorMessage}
              unavailableMessage={unavailableMessage}
            />
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button type="button" onClick={() => backTo("barber")} style={ghostButtonStyle}>
                Back
              </button>
              <button type="button" onClick={onContinueFromSlots} style={ctaButtonStyle}>
                Review checkout
              </button>
            </div>
          </>
        ) : null}

        {step === "checkout" ? (
          <CheckoutPanel
            service={service}
            barber={barber}
            slot={selectedSlot}
            onBack={backTo}
            onConfirm={onConfirmBooking}
            errorMessage={errorMessage ?? unavailableMessage}
            pending={isPending}
          />
        ) : null}
      </div>
    </div>
  );
}

function WizardProgress({ step }: { step: BookingStep }) {
  return (
    <ol style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, listStyle: "none" }}>
      {STEP_ORDER.map((entry, index) => {
        const active = entry === step;
        return (
          <li
            key={entry}
            style={{
              border: "1px solid var(--line)",
              background: active ? "rgba(201,168,76,0.08)" : "var(--bg2)",
              color: active ? "var(--gold)" : "var(--t3)",
              borderRadius: 999,
              padding: "8px 10px",
              fontSize: 11,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            {index + 1}. {entry}
          </li>
        );
      })}
    </ol>
  );
}

const ctaButtonStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--gold)",
  background: "var(--gold)",
  color: "#080808",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const ghostButtonStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--t2)",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 13,
  cursor: "pointer",
};
