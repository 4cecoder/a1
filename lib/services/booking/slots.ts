import type {
  BarberPreferenceId,
  BookingDateOption,
  BookingSlot,
  BookingValidationError,
} from "@/lib/types/booking";

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const SLOT_INTERVAL_MIN = 30;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, dayCount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + dayCount);
  return next;
}

function hashKey(input: string): number {
  return [...input].reduce((acc, current) => acc + current.charCodeAt(0), 0);
}

function withMinutes(base: Date, minutesFromMidnight: number): Date {
  const copy = new Date(base);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  copy.setHours(hours, minutes, 0, 0);
  return copy;
}

function formatTimeLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function createBookingDateOptions(days = 7, fromDate = new Date()): BookingDateOption[] {
  return Array.from({ length: days }, (_, index) => {
    const day = addDays(fromDate, index);
    const dateKey = toDateKey(day);

    const label = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(day);

    return { dateKey, label };
  });
}

export function createSlotsForDate(params: {
  dateKey: string;
  serviceDurationMin: number;
  barberId: BarberPreferenceId;
}): BookingSlot[] {
  const { dateKey, serviceDurationMin, barberId } = params;
  const baseDate = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(baseDate.getTime())) {
    return [];
  }

  const openMinute = OPEN_HOUR * 60;
  const closeMinute = CLOSE_HOUR * 60;
  const serviceSpacing = Math.max(serviceDurationMin, SLOT_INTERVAL_MIN);
  const lastStartMinute = closeMinute - serviceDurationMin;
  const unavailabilitySeed = hashKey(`${dateKey}:${barberId}`);

  const slots: BookingSlot[] = [];

  for (let startMinute = openMinute; startMinute <= lastStartMinute; startMinute += SLOT_INTERVAL_MIN) {
    const start = withMinutes(baseDate, startMinute);
    const end = withMinutes(baseDate, startMinute + serviceSpacing);

    const index = slots.length;
    const lunchBlock = startMinute >= 12 * 60 && startMinute < 13 * 60;
    const stochasticBlock = (index + unavailabilitySeed) % 5 === 0;
    const isUnavailable = lunchBlock || stochasticBlock;

    slots.push({
      id: `${dateKey}-${barberId}-${startMinute}`,
      dateKey,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      label: `${formatTimeLabel(start)} - ${formatTimeLabel(end)}`,
      status: isUnavailable ? "unavailable" : "open",
      barberId,
    });
  }

  return slots;
}

export function findSlotById(slots: BookingSlot[], slotId: string | null): BookingSlot | null {
  if (!slotId) return null;
  return slots.find((slot) => slot.id === slotId) ?? null;
}

export function validateBookingSelection(params: {
  serviceId: string | null;
  barberId: BarberPreferenceId | null;
  dateKey: string | null;
  slotId: string | null;
  slotsForSelectedDate: BookingSlot[];
}): BookingValidationError | null {
  const { serviceId, barberId, dateKey, slotId, slotsForSelectedDate } = params;

  if (!serviceId) return "missing_service";
  if (!barberId) return "missing_barber";
  if (!dateKey) return "missing_date";
  if (!slotId) return "missing_slot";

  const slot = findSlotById(slotsForSelectedDate, slotId);
  if (!slot || slot.status !== "open") {
    return "slot_unavailable";
  }

  return null;
}
