import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentConflict, AppointmentSlot, BlockedSlot, ShiftWindow } from "@/lib/scheduling/capacity";

type ScheduleBoardProps = {
  shiftWindows: ShiftWindow[];
  blockedSlots: BlockedSlot[];
  appointments: AppointmentSlot[];
  conflicts: AppointmentConflict[];
};

function getStatusVariant(status: AppointmentSlot["status"]): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "secondary";
  if (status === "no_show") return "destructive";
  if (status === "cancelled") return "outline";
  return "default";
}

export default function ScheduleBoard({ shiftWindows, blockedSlots, appointments, conflicts }: ScheduleBoardProps) {
  const staff = Array.from(new Set(shiftWindows.map((shift) => shift.staffId))).map((staffId) => {
    const staffName = shiftWindows.find((shift) => shift.staffId === staffId)?.staffName ?? staffId;
    return { staffId, staffName };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {staff.map((member) => {
        const memberShifts = shiftWindows.filter((shift) => shift.staffId === member.staffId);
        const memberBlocked = blockedSlots.filter((slot) => slot.staffId === member.staffId);
        const memberAppointments = appointments.filter((appointment) => appointment.staffId === member.staffId);

        return (
          <Card key={member.staffId}>
            <CardHeader>
              <CardTitle>{member.staffName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Shift windows</p>
                {memberShifts.map((shift) => (
                  <div key={shift.id} className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm">
                    {shift.range.start} - {shift.range.end}
                  </div>
                ))}
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Blocked slots</p>
                {memberBlocked.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No blocked slots</p>
                ) : (
                  memberBlocked.map((slot) => (
                    <div key={slot.id} className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
                      <p className="font-medium">{slot.label}</p>
                      <p className="text-muted-foreground">{slot.range.start} - {slot.range.end}</p>
                      <p className="text-muted-foreground">{slot.reason}</p>
                    </div>
                  ))
                )}
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Appointments</p>
                {memberAppointments.map((appointment) => {
                  const appointmentConflicts = conflicts.filter((conflict) => conflict.appointmentId === appointment.id);

                  return (
                    <div key={appointment.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="font-medium">{appointment.clientName}</p>
                        <Badge variant={getStatusVariant(appointment.status)}>{appointment.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-muted-foreground">{appointment.service}</p>
                      <p className="text-muted-foreground">{appointment.range.start} - {appointment.range.end}</p>
                      {appointmentConflicts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {appointmentConflicts.map((conflict) => (
                            <Badge key={`${appointment.id}-${conflict.type}`} variant="destructive">
                              {conflict.type.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
