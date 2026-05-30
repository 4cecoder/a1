import ModuleState from "@/components/admin/ModuleState";

export default function AdminBillingPage() {
  return (
    <ModuleState
      title="Billing"
      description="Review payments, reconciliation status, and billing records across completed appointments."
      primaryCtaLabel="Back to overview"
      primaryCtaHref="/admin"
      secondaryNote="Billing module shell ready for financial data connections."
    />
  );
}
