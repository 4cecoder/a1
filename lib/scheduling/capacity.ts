export type TimeRange = {
  start: string;
  end: string;
};

export type ShiftWindow = {
  id: string;
  staffId: string;
  staffName: string;
  range: TimeRange;
};

export type BlockedSlot = {
  id: string;
  staffId: string;
  label: string;
  reason: string;
  range: TimeRange;
};

export type AppointmentSlot = {
  id: string;
  staffId: string;
  clientName: string;
  service: string;
  status: "booked" | "completed" | "no_show" | "cancelled";
  range: TimeRange;
};

export type ConflictType = "outside_shift" | "blocked_overlap" | "double_booked";

export type AppointmentConflict = {
  appointmentId: string;
  type: ConflictType;
  message: string;
};

export type StaffCapacitySummary = {
  staffId: string;
  staffName: string;
  shiftMinutes: number;
  blockedMinutes: number;
  availableMinutes: number;
  bookedMinutes: number;
  utilization: number;
};

export type CapacitySnapshot = {
  totalShiftMinutes: number;
  totalBlockedMinutes: number;
  totalAvailableMinutes: number;
  totalBookedMinutes: number;
  overallUtilization: number;
  perStaff: StaffCapacitySummary[];
};

export function parseTimeToMinutes(value: string): number {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number.parseInt(hoursRaw ?? "", 10);
  const minutes = Number.parseInt(minutesRaw ?? "", 10);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new Error(`Invalid time value: ${value}`);
  }

  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const bounded = Math.max(0, totalMinutes);
  const hours = Math.floor(bounded / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(bounded % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getRangeDurationMinutes(range: TimeRange): number {
  return Math.max(0, parseTimeToMinutes(range.end) - parseTimeToMinutes(range.start));
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return parseTimeToMinutes(a.start) < parseTimeToMinutes(b.end) && parseTimeToMinutes(b.start) < parseTimeToMinutes(a.end);
}

export function rangeIntersectionMinutes(a: TimeRange, b: TimeRange): number {
  const start = Math.max(parseTimeToMinutes(a.start), parseTimeToMinutes(b.start));
  const end = Math.min(parseTimeToMinutes(a.end), parseTimeToMinutes(b.end));

  return Math.max(0, end - start);
}

export function isRangeInside(inner: TimeRange, outer: TimeRange): boolean {
  return parseTimeToMinutes(inner.start) >= parseTimeToMinutes(outer.start) && parseTimeToMinutes(inner.end) <= parseTimeToMinutes(outer.end);
}

export function findAppointmentConflicts(
  appointments: AppointmentSlot[],
  shiftWindows: ShiftWindow[],
  blockedSlots: BlockedSlot[]
): AppointmentConflict[] {
  const conflicts: AppointmentConflict[] = [];

  for (const appointment of appointments) {
    if (appointment.status === "cancelled") {
      continue;
    }

    const staffShifts = shiftWindows.filter((shift) => shift.staffId === appointment.staffId);
    const insideAnyShift = staffShifts.some((shift) => isRangeInside(appointment.range, shift.range));

    if (!insideAnyShift) {
      conflicts.push({
        appointmentId: appointment.id,
        type: "outside_shift",
        message: `${appointment.clientName} is outside shift hours`,
      });
    }

    const blockingHit = blockedSlots.some((slot) => slot.staffId === appointment.staffId && rangesOverlap(slot.range, appointment.range));
    if (blockingHit) {
      conflicts.push({
        appointmentId: appointment.id,
        type: "blocked_overlap",
        message: `${appointment.clientName} overlaps a blocked slot`,
      });
    }

    const overlappingAppointment = appointments.some(
      (candidate) =>
        candidate.id !== appointment.id &&
        candidate.staffId === appointment.staffId &&
        candidate.status !== "cancelled" &&
        rangesOverlap(candidate.range, appointment.range)
    );

    if (overlappingAppointment) {
      conflicts.push({
        appointmentId: appointment.id,
        type: "double_booked",
        message: `${appointment.clientName} conflicts with another booking`,
      });
    }
  }

  return conflicts;
}

export function calculateCapacitySnapshot(
  shiftWindows: ShiftWindow[],
  appointments: AppointmentSlot[],
  blockedSlots: BlockedSlot[]
): CapacitySnapshot {
  const staffIds = Array.from(new Set(shiftWindows.map((shift) => shift.staffId)));

  const perStaff = staffIds.map((staffId) => {
    const staffShifts = shiftWindows.filter((shift) => shift.staffId === staffId);
    const staffName = staffShifts[0]?.staffName ?? staffId;

    const shiftMinutes = staffShifts.reduce((sum, shift) => sum + getRangeDurationMinutes(shift.range), 0);

    const blockedMinutes = blockedSlots
      .filter((slot) => slot.staffId === staffId)
      .reduce((sum, slot) => {
        const overlapMinutes = staffShifts.reduce((overlapSum, shift) => overlapSum + rangeIntersectionMinutes(shift.range, slot.range), 0);
        return sum + overlapMinutes;
      }, 0);

    const availableMinutes = Math.max(0, shiftMinutes - blockedMinutes);

    const bookedMinutes = appointments
      .filter((appointment) => appointment.staffId === staffId && appointment.status !== "cancelled")
      .reduce((sum, appointment) => {
        const overlapInShift = staffShifts.reduce(
          (overlapSum, shift) => overlapSum + rangeIntersectionMinutes(appointment.range, shift.range),
          0
        );
        return sum + overlapInShift;
      }, 0);

    const utilization = availableMinutes > 0 ? bookedMinutes / availableMinutes : 0;

    return {
      staffId,
      staffName,
      shiftMinutes,
      blockedMinutes,
      availableMinutes,
      bookedMinutes,
      utilization,
    };
  });

  const totalShiftMinutes = perStaff.reduce((sum, item) => sum + item.shiftMinutes, 0);
  const totalBlockedMinutes = perStaff.reduce((sum, item) => sum + item.blockedMinutes, 0);
  const totalAvailableMinutes = perStaff.reduce((sum, item) => sum + item.availableMinutes, 0);
  const totalBookedMinutes = perStaff.reduce((sum, item) => sum + item.bookedMinutes, 0);

  return {
    totalShiftMinutes,
    totalBlockedMinutes,
    totalAvailableMinutes,
    totalBookedMinutes,
    overallUtilization: totalAvailableMinutes > 0 ? totalBookedMinutes / totalAvailableMinutes : 0,
    perStaff,
  };
}
