export type ReportPeriod = "7d" | "30d" | "90d";

export type BookingRecord = {
  id: string;
  createdAt: string;
  scheduledAt: string;
  status: "completed" | "no_show" | "cancelled";
  amountCents: number;
};

export type KpiSnapshot = {
  bookings: number;
  conversionRate: number;
  noShowRate: number;
  revenueCents: number;
  averageTicketCents: number;
  completedBookings: number;
};

export function periodToDays(period: ReportPeriod): number {
  if (period === "7d") return 7;
  if (period === "30d") return 30;
  return 90;
}

export function filterBookingsByPeriod(
  records: BookingRecord[],
  period: ReportPeriod,
  referenceDate = new Date()
): BookingRecord[] {
  const dayCount = periodToDays(period);
  const startDate = new Date(referenceDate);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (dayCount - 1));

  return records.filter((record) => {
    const scheduled = new Date(record.scheduledAt);
    return scheduled >= startDate && scheduled <= referenceDate;
  });
}

export function calculateKpiSnapshot(records: BookingRecord[], totalLeads: number): KpiSnapshot {
  const bookings = records.length;
  const completedBookings = records.filter((record) => record.status === "completed").length;
  const noShows = records.filter((record) => record.status === "no_show").length;
  const revenueCents = records
    .filter((record) => record.status === "completed")
    .reduce((sum, record) => sum + record.amountCents, 0);

  return {
    bookings,
    conversionRate: totalLeads > 0 ? bookings / totalLeads : 0,
    noShowRate: bookings > 0 ? noShows / bookings : 0,
    revenueCents,
    averageTicketCents: completedBookings > 0 ? Math.round(revenueCents / completedBookings) : 0,
    completedBookings,
  };
}

export function formatCurrencyFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
