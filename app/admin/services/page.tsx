import ModuleState from "@/components/admin/ModuleState";

export default function AdminServicesPage() {
  return (
    <ModuleState
      title="Services"
      description="Define and maintain service offerings, durations, and pricing for consistent booking behavior."
      primaryCtaLabel="Back to overview"
      primaryCtaHref="/admin"
      secondaryNote="Services module shell ready for catalog management."
    />
  );
}
