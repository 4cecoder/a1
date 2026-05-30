import ModuleState from "@/components/admin/ModuleState";

export default function AdminAppointmentsPage() {
  return (
    <ModuleState
      title="Appointments"
      description="Track and organize bookings, review upcoming slots, and manage appointment outcomes."
      primaryCtaLabel="Back to overview"
      primaryCtaHref="/admin"
      secondaryNote="Appointments module shell ready for integration."
    />
  );
}
