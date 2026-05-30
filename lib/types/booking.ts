export type BookingStep = "service" | "barber" | "slot" | "checkout";

export type BarberPreferenceId = "no_preference" | "marcus" | "deshawn" | "ray";

export type SlotStatus = "open" | "unavailable";

export type BookingValidationError =
  | "missing_service"
  | "missing_barber"
  | "missing_date"
  | "missing_slot"
  | "slot_unavailable";

export type BookingService = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
  popular?: boolean;
};

export type BarberPreference = {
  id: BarberPreferenceId;
  label: string;
  bio: string;
};

export type BookingDateOption = {
  dateKey: string;
  label: string;
};

export type BookingSlot = {
  id: string;
  dateKey: string;
  startIso: string;
  endIso: string;
  label: string;
  status: SlotStatus;
  barberId: BarberPreferenceId;
};

export type BookingSelection = {
  serviceId: string | null;
  barberId: BarberPreferenceId | null;
  dateKey: string | null;
  slotId: string | null;
};

export type BookingCheckoutPayload = {
  serviceId: string;
  barberId: BarberPreferenceId;
  dateKey: string;
  slotId: string;
  note?: string;
};

export const BOOKING_SERVICES: BookingService[] = [
  {
    id: "classic-cut",
    name: "Classic Cut",
    description: "Clean, sharp, and timeless.",
    durationMin: 35,
    priceCents: 2500,
  },
  {
    id: "fade",
    name: "Fade",
    description: "Low, mid, or high fade dialed to your style.",
    durationMin: 45,
    priceCents: 3000,
    popular: true,
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Shape, lineup, and detail cleanup.",
    durationMin: 20,
    priceCents: 1500,
  },
  {
    id: "cut-and-beard",
    name: "Cut + Beard",
    description: "Complete package for hair + beard care.",
    durationMin: 55,
    priceCents: 4000,
    popular: true,
  },
];

export const BARBER_PREFERENCES: BarberPreference[] = [
  {
    id: "no_preference",
    label: "No preference",
    bio: "First available barber for your selected time.",
  },
  {
    id: "marcus",
    label: "Marcus",
    bio: "Master barber — precision fades and tapers.",
  },
  {
    id: "deshawn",
    label: "DeShawn",
    bio: "Senior barber — beard sculpting and lineups.",
  },
  {
    id: "ray",
    label: "Ray",
    bio: "Barber — classic cuts and dependable detail.",
  },
];

export function formatBookingPrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function getBookingService(serviceId: string | null): BookingService | null {
  if (!serviceId) return null;
  return BOOKING_SERVICES.find((service) => service.id === serviceId) ?? null;
}

export function getBarberPreference(barberId: BarberPreferenceId | null): BarberPreference | null {
  if (!barberId) return null;
  return BARBER_PREFERENCES.find((barber) => barber.id === barberId) ?? null;
}

export function isBookingPayloadComplete(
  selection: BookingSelection
): selection is BookingCheckoutPayload {
  return Boolean(selection.serviceId && selection.barberId && selection.dateKey && selection.slotId);
}
