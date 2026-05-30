import ModuleState from "@/components/admin/ModuleState";

export default function AdminSettingsPage() {
  return (
    <ModuleState
      title="Settings"
      description="Configure shop defaults, operational preferences, and administrative controls for the dashboard."
      primaryCtaLabel="Back to overview"
      primaryCtaHref="/admin"
      secondaryNote="Settings module shell ready for system configuration features."
    />
  );
}
