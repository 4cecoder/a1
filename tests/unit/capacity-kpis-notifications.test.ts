import { afterEach, describe, expect, test } from "bun:test";

import {
  calculateCapacitySnapshot,
  findAppointmentConflicts,
  formatMinutesToTime,
  getRangeDurationMinutes,
  parseTimeToMinutes,
  rangeIntersectionMinutes,
  rangesOverlap,
  type AppointmentSlot,
  type BlockedSlot,
  type ShiftWindow,
} from "@/lib/scheduling/capacity";
import {
  calculateKpiSnapshot,
  filterBookingsByPeriod,
  formatCurrencyFromCents,
  formatPercent,
  periodToDays,
  type BookingRecord,
} from "@/lib/analytics/kpis";
import {
  buildNotificationDedupeKey,
  clearScheduledNotifications,
  listScheduledNotifications,
  scheduleNotification,
} from "@/lib/notifications/scheduler";

afterEach(() => {
  clearScheduledNotifications();
});

describe("capacity helpers", () => {
  const shifts: ShiftWindow[] = [
    {
      id: "shift-marcus",
      staffId: "marcus",
      staffName: "Marcus",
      range: { start: "09:00", end: "17:00" },
    },
    {
      id: "shift-ray",
      staffId: "ray",
      staffName: "Ray",
      range: { start: "10:00", end: "16:00" },
    },
  ];

  const blocked: BlockedSlot[] = [
    {
      id: "block-lunch-marcus",
      staffId: "marcus",
      label: "Lunch",
      reason: "Break",
      range: { start: "12:00", end: "13:00" },
    },
  ];

  const appointments: AppointmentSlot[] = [
    {
      id: "a1",
      staffId: "marcus",
      clientName: "Jordan",
      service: "Fade",
      status: "booked",
      range: { start: "10:00", end: "10:45" },
    },
    {
      id: "a2",
      staffId: "marcus",
      clientName: "Chris",
      service: "Beard",
      status: "booked",
      range: { start: "10:30", end: "11:00" },
    },
    {
      id: "a3",
      staffId: "ray",
      clientName: "Alex",
      service: "Classic",
      status: "booked",
      range: { start: "09:30", end: "10:15" },
    },
    {
      id: "a4",
      staffId: "marcus",
      clientName: "Noon",
      service: "Cut",
      status: "booked",
      range: { start: "12:10", end: "12:40" },
    },
    {
      id: "a5",
      staffId: "ray",
      clientName: "Cancelled",
      service: "Cut",
      status: "cancelled",
      range: { start: "11:00", end: "11:30" },
    },
  ];

  test("time utility helpers compute expected values", () => {
    expect(parseTimeToMinutes("09:30")).toBe(570);
    expect(() => parseTimeToMinutes("bad")).toThrow("Invalid time value");

    expect(formatMinutesToTime(570)).toBe("09:30");
    expect(formatMinutesToTime(-4)).toBe("00:00");

    expect(getRangeDurationMinutes({ start: "09:00", end: "09:45" })).toBe(45);
    expect(rangesOverlap({ start: "09:00", end: "10:00" }, { start: "09:59", end: "11:00" })).toBe(true);
    expect(rangesOverlap({ start: "09:00", end: "10:00" }, { start: "10:00", end: "11:00" })).toBe(false);
    expect(rangeIntersectionMinutes({ start: "09:00", end: "10:00" }, { start: "09:30", end: "10:30" })).toBe(30);
  });

  test("findAppointmentConflicts detects outside-shift, blocked overlap, and double-booking", () => {
    const conflicts = findAppointmentConflicts(appointments, shifts, blocked);

    expect(conflicts.some((item) => item.appointmentId === "a3" && item.type === "outside_shift")).toBe(true);
    expect(conflicts.some((item) => item.appointmentId === "a4" && item.type === "blocked_overlap")).toBe(true);
    expect(conflicts.some((item) => item.appointmentId === "a1" && item.type === "double_booked")).toBe(true);
    expect(conflicts.some((item) => item.appointmentId === "a2" && item.type === "double_booked")).toBe(true);
    expect(conflicts.some((item) => item.appointmentId === "a5")).toBe(false);
  });

  test("calculateCapacitySnapshot returns per-staff and aggregate utilization", () => {
    const snapshot = calculateCapacitySnapshot(shifts, appointments, blocked);

    expect(snapshot.totalShiftMinutes).toBe(840);
    expect(snapshot.totalBlockedMinutes).toBe(60);
    expect(snapshot.totalAvailableMinutes).toBe(780);
    expect(snapshot.totalBookedMinutes).toBe(120);
    expect(snapshot.overallUtilization).toBeCloseTo(120 / 780, 8);

    const marcus = snapshot.perStaff.find((item) => item.staffId === "marcus");
    const ray = snapshot.perStaff.find((item) => item.staffId === "ray");

    expect(marcus).toBeTruthy();
    expect(marcus?.shiftMinutes).toBe(480);
    expect(marcus?.blockedMinutes).toBe(60);
    expect(marcus?.availableMinutes).toBe(420);
    expect(marcus?.bookedMinutes).toBe(105);

    expect(ray).toBeTruthy();
    expect(ray?.shiftMinutes).toBe(360);
    expect(ray?.blockedMinutes).toBe(0);
    expect(ray?.availableMinutes).toBe(360);
    expect(ray?.bookedMinutes).toBe(15);
  });
});

describe("kpi helpers", () => {
  const referenceDate = new Date("2026-05-30T12:00:00.000Z");

  const records: BookingRecord[] = [
    {
      id: "r1",
      createdAt: "2026-05-20T10:00:00.000Z",
      scheduledAt: "2026-05-29T09:00:00.000Z",
      status: "completed",
      amountCents: 3000,
    },
    {
      id: "r2",
      createdAt: "2026-05-21T10:00:00.000Z",
      scheduledAt: "2026-05-28T09:00:00.000Z",
      status: "no_show",
      amountCents: 2500,
    },
    {
      id: "r3",
      createdAt: "2026-04-02T10:00:00.000Z",
      scheduledAt: "2026-04-03T09:00:00.000Z",
      status: "completed",
      amountCents: 4500,
    },
  ];

  test("period helpers and filtering include only in-window scheduled records", () => {
    expect(periodToDays("7d")).toBe(7);
    expect(periodToDays("30d")).toBe(30);
    expect(periodToDays("90d")).toBe(90);

    const in7d = filterBookingsByPeriod(records, "7d", referenceDate);
    expect(in7d.map((item) => item.id)).toEqual(["r1", "r2"]);

    const in30d = filterBookingsByPeriod(records, "30d", referenceDate);
    expect(in30d.map((item) => item.id)).toEqual(["r1", "r2"]);

    const in90d = filterBookingsByPeriod(records, "90d", referenceDate);
    expect(in90d).toHaveLength(3);
  });

  test("calculateKpiSnapshot and formatters return expected outputs", () => {
    const snapshot = calculateKpiSnapshot(records, 10);

    expect(snapshot.bookings).toBe(3);
    expect(snapshot.completedBookings).toBe(2);
    expect(snapshot.conversionRate).toBeCloseTo(0.3, 8);
    expect(snapshot.noShowRate).toBeCloseTo(1 / 3, 8);
    expect(snapshot.revenueCents).toBe(7500);
    expect(snapshot.averageTicketCents).toBe(3750);

    expect(formatCurrencyFromCents(7500)).toBe("$75");
    expect(formatPercent(snapshot.noShowRate)).toBe("33.3%");
  });
});

describe("notification scheduler dedupe/idempotency", () => {
  test("buildNotificationDedupeKey is stable for equivalent normalized payloads", () => {
    const base = {
      eventType: "reminder" as const,
      channel: "sms" as const,
      recipient: { id: "  USER-42  ", phone: "8035550100" },
      scheduledFor: "2026-06-01T15:00:00.000Z",
      context: { firstName: "Jordan" },
      templateId: "tpl-reminder",
      templateVersion: 2,
      dedupeScope: "  daily-window  ",
    };

    const keyA = buildNotificationDedupeKey(base);
    const keyB = buildNotificationDedupeKey({
      ...base,
      recipient: { id: "user-42", phone: "8035550100" },
      dedupeScope: "daily-window",
      context: { firstName: "Someone Else" },
      metadata: { ignored: "for dedupe" },
    });

    expect(keyA).toMatch(/^notif:[0-9a-f]{8}$/);
    expect(keyA).toBe(keyB);
  });

  test("scheduleNotification dedupes duplicate requests and preserves first job", () => {
    const request = {
      eventType: "confirmation" as const,
      channel: "email" as const,
      recipient: { id: "client-1", email: "client@example.com" },
      scheduledFor: "2026-06-02T13:00:00.000Z",
      context: { firstName: "Taylor" },
      templateId: "tpl-confirm",
      templateVersion: 1,
      dedupeScope: "booking-abc",
    };

    const first = scheduleNotification(request);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.deduped).toBe(false);

    const second = scheduleNotification({ ...request, context: { firstName: "Changed" } });
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.deduped).toBe(true);
    expect(second.job.id).toBe(first.job.id);
    expect(second.job.context).toEqual({ firstName: "Taylor" });

    const jobs = listScheduledNotifications();
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.dedupeKey).toBe(first.job.dedupeKey);

    const invalid = scheduleNotification({ ...request, recipient: { id: "   " } });
    expect(invalid.ok).toBe(false);
  });
});
