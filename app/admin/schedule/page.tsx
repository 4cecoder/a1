import CapacityPanel from "@/components/admin/schedule/CapacityPanel";
import ScheduleBoard from "@/components/admin/schedule/ScheduleBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateCapacitySnapshot,
  findAppointmentConflicts,
  type AppointmentSlot,
  type BlockedSlot,
  type ShiftWindow,
} from "@/lib/scheduling/capacity";

const shiftWindows: ShiftWindow[] = [
  { id: "shift-1", staffId: "marcus", staffName: "Marcus", range: { start: "09:00", end: "17:00" } },
  { id: "shift-2", staffId: "deshawn", staffName: "DeShawn", range: { start: "10:00", end: "18:00" } },
  { id: "shift-3", staffId: "ray", staffName: "Ray", range: { start: "09:30", end: "16:30" } },
];

const blockedSlots: BlockedSlot[] = [
  { id: "block-1", staffId: "marcus", label: "Team huddle", reason: "Daily standup", range: { start: "12:00", end: "12:30" } },
  { id: "block-2", staffId: "deshawn", label: "Break", reason: "Lunch", range: { start: "14:00", end: "14:30" } },
  { id: "block-3", staffId: "ray", label: "Walk-in reserve", reason: "Hold for overflow", range: { start: "15:00", end: "15:30" } },
];

const appointments: AppointmentSlot[] = [
  {
    id: "appt-1",
    staffId: "marcus",
    clientName: "Jordan K.",
    service: "Fade",
    status: "booked",
    range: { start: "11:30", end: "12:15" },
  },
  {
    id: "appt-2",
    staffId: "deshawn",
    clientName: "Myles R.",
    service: "Cut + Beard",
    status: "booked",
    range: { start: "13:45", end: "14:30" },
  },
  {
    id: "appt-3",
    staffId: "ray",
    clientName: "Amari T.",
    service: "Classic Cut",
    status: "booked",
    range: { start: "16:15", end: "17:00" },
  },
  {
    id: "appt-4",
    staffId: "deshawn",
    clientName: "Chris L.",
    service: "Hot Towel Shave",
    status: "booked",
    range: { start: "13:55", end: "14:20" },
  },
];

export default function AdminSchedulePage() {
  const conflicts = findAppointmentConflicts(appointments, shiftWindows, blockedSlots);
  const snapshot = calculateCapacitySnapshot(shiftWindows, appointments, blockedSlots);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Admin · Schedule</h1>
        <p className="text-sm text-muted-foreground">Shift windows, blocked slots, and conflict indicators (demo data)</p>
      </header>

      <CapacityPanel snapshot={snapshot} />

      <Card>
        <CardHeader>
          <CardTitle>Conflict feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {conflicts.length === 0 ? (
            <p className="text-muted-foreground">No conflicts detected.</p>
          ) : (
            conflicts.map((conflict) => (
              <p key={`${conflict.appointmentId}-${conflict.type}`} className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2">
                {conflict.message}
              </p>
            ))
          )}
        </CardContent>
      </Card>

      <ScheduleBoard
        appointments={appointments}
        blockedSlots={blockedSlots}
        conflicts={conflicts}
        shiftWindows={shiftWindows}
      />
    </main>
  );
}
