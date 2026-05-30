import ModuleState from "@/components/admin/ModuleState";

export default function AdminStaffPage() {
  return (
    <ModuleState
      title="Staff"
      description="Manage staff profiles, availability visibility, and assignment defaults for shop workflows."
      primaryCtaLabel="Back to overview"
      primaryCtaHref="/admin"
      secondaryNote="Staff module shell ready for role-based actions."
    />
  );
}
