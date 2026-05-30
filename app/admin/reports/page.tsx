"use client";

import { useMemo, useState } from "react";
import KpiCards from "@/components/admin/reports/KpiCards";
import RevenueChartPlaceholder from "@/components/admin/reports/RevenueChartPlaceholder";
import { Button } from "@/components/ui/button";
import {
  calculateKpiSnapshot,
  filterBookingsByPeriod,
  type BookingRecord,
  type ReportPeriod,
} from "@/lib/analytics/kpis";

const demoBookings: BookingRecord[] = [
  { id: "b-1", createdAt: "2026-05-01T09:00:00.000Z", scheduledAt: "2026-05-24T10:00:00.000Z", status: "completed", amountCents: 3500 },
  { id: "b-2", createdAt: "2026-05-02T11:00:00.000Z", scheduledAt: "2026-05-26T13:00:00.000Z", status: "completed", amountCents: 4200 },
  { id: "b-3", createdAt: "2026-05-03T12:00:00.000Z", scheduledAt: "2026-05-27T14:00:00.000Z", status: "no_show", amountCents: 0 },
  { id: "b-4", createdAt: "2026-05-04T09:30:00.000Z", scheduledAt: "2026-05-28T15:30:00.000Z", status: "completed", amountCents: 3000 },
  { id: "b-5", createdAt: "2026-04-20T09:00:00.000Z", scheduledAt: "2026-05-10T16:00:00.000Z", status: "cancelled", amountCents: 0 },
  { id: "b-6", createdAt: "2026-03-14T09:00:00.000Z", scheduledAt: "2026-04-04T16:00:00.000Z", status: "completed", amountCents: 4500 },
];

const periodOptions: { value: ReportPeriod; label: string }[] = [
  { value: "7d", label: "Last 7d" },
  { value: "30d", label: "Last 30d" },
  { value: "90d", label: "Last 90d" },
];

const leadsByPeriod: Record<ReportPeriod, number> = {
  "7d": 14,
  "30d": 48,
  "90d": 120,
};

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("30d");

  const filtered = useMemo(
    () => filterBookingsByPeriod(demoBookings, period, new Date("2026-05-30T23:59:59.000Z")),
    [period]
  );

  const snapshot = useMemo(() => calculateKpiSnapshot(filtered, leadsByPeriod[period]), [filtered, period]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Reports</h1>
          <p className="text-sm text-muted-foreground">KPI baseline with period selector and chart placeholders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={period === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(option.value)}
              type="button"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </header>

      <KpiCards snapshot={snapshot} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChartPlaceholder
          title="Revenue trend"
          description="Placeholder chart block for revenue over time (Convex query + chart lib later)."
        />
        <RevenueChartPlaceholder
          title="Booking funnel"
          description="Placeholder chart block for lead-to-booking conversion trend by period."
        />
      </div>
    </main>
  );
}
