import { describe, expect, test } from "bun:test";

import {
  createBookingDateOptions,
  createSlotsForDate,
  findSlotById,
  validateBookingSelection,
} from "@/lib/services/booking/slots";
import {
  validateCheckoutConfirmPayload,
  validateCheckoutStartPayload,
  validateReceiptId,
} from "@/lib/server-actions/checkout/validation";

describe("booking flow helpers", () => {
  test("createBookingDateOptions builds consecutive date keys from a reference date", () => {
    const from = new Date("2026-05-30T12:00:00.000Z");

    const options = createBookingDateOptions(3, from);

    expect(options).toHaveLength(3);
    expect(options.map((item) => item.dateKey)).toEqual([
      "2026-05-30",
      "2026-05-31",
      "2026-06-01",
    ]);
    for (const option of options) {
      expect(option.label.length).toBeGreaterThan(0);
    }
  });

  test("createSlotsForDate returns deterministic slots and marks some unavailable", () => {
    const slots = createSlotsForDate({
      dateKey: "2026-05-30",
      serviceDurationMin: 45,
      barberId: "no_preference",
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]?.id).toBe("2026-05-30-no_preference-540");
    expect(slots[0]?.dateKey).toBe("2026-05-30");
    expect(slots[0]?.barberId).toBe("no_preference");

    const unavailableCount = slots.filter((slot) => slot.status === "unavailable").length;
    expect(unavailableCount).toBeGreaterThan(0);

    const lunchishSlot = slots.find((slot) => slot.id.endsWith("-720"));
    expect(lunchishSlot?.status).toBe("unavailable");
  });

  test("createSlotsForDate returns empty list for an invalid date key", () => {
    const slots = createSlotsForDate({
      dateKey: "not-a-date",
      serviceDurationMin: 30,
      barberId: "ray",
    });

    expect(slots).toEqual([]);
  });

  test("findSlotById and validateBookingSelection gate checkout step correctly", () => {
    const slots = createSlotsForDate({
      dateKey: "2026-05-30",
      serviceDurationMin: 35,
      barberId: "marcus",
    });

    const openSlot = slots.find((slot) => slot.status === "open");
    const blockedSlot = slots.find((slot) => slot.status === "unavailable");

    expect(findSlotById(slots, null)).toBeNull();
    expect(findSlotById(slots, "missing-id")).toBeNull();
    expect(openSlot).toBeTruthy();
    expect(blockedSlot).toBeTruthy();

    expect(
      validateBookingSelection({
        serviceId: null,
        barberId: "marcus",
        dateKey: "2026-05-30",
        slotId: openSlot!.id,
        slotsForSelectedDate: slots,
      })
    ).toBe("missing_service");

    expect(
      validateBookingSelection({
        serviceId: "classic-cut",
        barberId: null,
        dateKey: "2026-05-30",
        slotId: openSlot!.id,
        slotsForSelectedDate: slots,
      })
    ).toBe("missing_barber");

    expect(
      validateBookingSelection({
        serviceId: "classic-cut",
        barberId: "marcus",
        dateKey: null,
        slotId: openSlot!.id,
        slotsForSelectedDate: slots,
      })
    ).toBe("missing_date");

    expect(
      validateBookingSelection({
        serviceId: "classic-cut",
        barberId: "marcus",
        dateKey: "2026-05-30",
        slotId: null,
        slotsForSelectedDate: slots,
      })
    ).toBe("missing_slot");

    expect(
      validateBookingSelection({
        serviceId: "classic-cut",
        barberId: "marcus",
        dateKey: "2026-05-30",
        slotId: blockedSlot!.id,
        slotsForSelectedDate: slots,
      })
    ).toBe("slot_unavailable");

    expect(
      validateBookingSelection({
        serviceId: "classic-cut",
        barberId: "marcus",
        dateKey: "2026-05-30",
        slotId: openSlot!.id,
        slotsForSelectedDate: slots,
      })
    ).toBeNull();
  });
});

describe("checkout validation", () => {
  test("validateCheckoutStartPayload normalizes and accepts valid payload", () => {
    const result = validateCheckoutStartPayload({
      amountCents: 3000,
      currency: "USD",
      paymentMethodToken: " tok_123 ",
      customerName: " Jordan ",
      customerEmail: " JORDAN@EXAMPLE.COM ",
      serviceName: " Fade ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.paymentMethodToken).toBe("tok_123");
    expect(result.data.customerName).toBe("Jordan");
    expect(result.data.customerEmail).toBe("jordan@example.com");
    expect(result.data.serviceName).toBe("Fade");
    expect(result.data.simulation).toBe("none");
    expect(result.data.metadata).toEqual({});
  });

  test("validateCheckoutStartPayload rejects malformed inputs", () => {
    const badAmount = validateCheckoutStartPayload({
      amountCents: 0,
      currency: "USD",
      paymentMethodToken: "tok_123",
      customerName: "Jordan",
      customerEmail: "jordan@example.com",
      serviceName: "Fade",
    });
    expect(badAmount.ok).toBe(false);

    const badCurrency = validateCheckoutStartPayload({
      amountCents: 2500,
      currency: "USDX" as "USD",
      paymentMethodToken: "tok_123",
      customerName: "Jordan",
      customerEmail: "jordan@example.com",
      serviceName: "Fade",
    });
    expect(badCurrency.ok).toBe(false);

    const badEmail = validateCheckoutStartPayload({
      amountCents: 2500,
      currency: "USD",
      paymentMethodToken: "tok_123",
      customerName: "Jordan",
      customerEmail: "not-an-email",
      serviceName: "Fade",
    });
    expect(badEmail.ok).toBe(false);

    const badSimulation = validateCheckoutStartPayload({
      amountCents: 2500,
      currency: "USD",
      paymentMethodToken: "tok_123",
      customerName: "Jordan",
      customerEmail: "jordan@example.com",
      serviceName: "Fade",
      simulation: "boom" as "none",
    });
    expect(badSimulation.ok).toBe(false);
  });

  test("confirm payload and receipt id validations enforce required values", () => {
    const confirmOk = validateCheckoutConfirmPayload({ intentId: " pi_123 " });
    expect(confirmOk.ok).toBe(true);
    if (confirmOk.ok) {
      expect(confirmOk.data.intentId).toBe("pi_123");
      expect(confirmOk.data.simulation).toBe("none");
    }

    const confirmMissing = validateCheckoutConfirmPayload({ intentId: "" });
    expect(confirmMissing.ok).toBe(false);

    const receiptOk = validateReceiptId(" receipt_42 ");
    expect(receiptOk.ok).toBe(true);
    if (receiptOk.ok) {
      expect(receiptOk.data).toBe("receipt_42");
    }

    const receiptMissing = validateReceiptId("   ");
    expect(receiptMissing.ok).toBe(false);
  });
});
