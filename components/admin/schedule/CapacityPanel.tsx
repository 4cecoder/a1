import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CapacitySnapshot } from "@/lib/scheduling/capacity";

type CapacityPanelProps = {
  snapshot: CapacitySnapshot;
};

function asHours(minutes: number): string {
  return `${(minutes / 60).toFixed(1)}h`;
}

function asPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export default function CapacityPanel({ snapshot }: CapacityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacity overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Total shift</p>
            <p className="text-lg font-semibold">{asHours(snapshot.totalShiftMinutes)}</p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Blocked</p>
            <p className="text-lg font-semibold">{asHours(snapshot.totalBlockedMinutes)}</p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Booked</p>
            <p className="text-lg font-semibold">{asHours(snapshot.totalBookedMinutes)}</p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Utilization</p>
            <p className="text-lg font-semibold">{asPercent(snapshot.overallUtilization)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Per staff</p>
          {snapshot.perStaff.map((item) => (
            <div key={item.staffId} className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.staffName}</p>
                <p className="text-muted-foreground">{asPercent(item.utilization)}</p>
              </div>
              <p className="text-muted-foreground">
                Available {asHours(item.availableMinutes)} · Booked {asHours(item.bookedMinutes)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
