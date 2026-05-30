import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { archiveLead, convertLead, getLeadById, qualifyLead } from "@/lib/server-actions/leads/actions"
import { CRM_LIFECYCLE_FLOW } from "@/lib/types/crm"

type ParamsInput = Promise<{ id: string }> | { id: string }

function formatDate(input?: string): string {
  if (!input) {
    return "—"
  }

  return new Date(input).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function LeadDetailPage({ params }: { params: ParamsInput }) {
  const resolvedParams = await params
  const leadResult = await getLeadById(resolvedParams.id)

  if (!leadResult.ok) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-muted-foreground">Lead not found.</p>
        <Link href="/admin/leads" className="text-sm underline">
          Back to leads
        </Link>
      </main>
    )
  }

  const lead = leadResult.data

  async function qualifyAction(formData: FormData) {
    "use server"
    await qualifyLead({
      leadId: lead.id,
      note: String(formData.get("note") ?? "") || undefined,
    })
  }

  async function convertAction(formData: FormData) {
    "use server"
    await convertLead({
      leadId: lead.id,
      note: String(formData.get("note") ?? "") || undefined,
    })
  }

  async function archiveAction(formData: FormData) {
    "use server"
    await archiveLead({
      leadId: lead.id,
      note: String(formData.get("note") ?? "") || undefined,
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{lead.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            {lead.email} • {lead.phone}
          </p>
        </div>
        <Badge variant="outline">{lead.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lifecycle progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {CRM_LIFECYCLE_FLOW.map((stage) => (
              <div
                key={stage.key}
                className={`rounded-lg border p-3 ${lead.status === stage.key ? "border-primary" : ""}`}
              >
                <p className="text-xs uppercase text-muted-foreground">{stage.label}</p>
                <p className="font-medium">{lead.status === stage.key ? "Current" : "Pending"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-2">
          <p>Owner: {lead.owner}</p>
          <p>Source: {lead.source}</p>
          <p>Potential service: {lead.potentialService}</p>
          <p>Created: {formatDate(lead.createdAt)}</p>
          <p>Qualified: {formatDate(lead.qualifiedAt)}</p>
          <p>Converted: {formatDate(lead.convertedAt)}</p>
          <p>Archived: {formatDate(lead.archivedAt)}</p>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-3">
        <form action={qualifyAction} className="rounded-lg border p-3">
          <p className="mb-2 text-sm font-medium">Qualify</p>
          <textarea name="note" placeholder="Optional note" className="mb-2 min-h-20 w-full rounded-md border p-2 text-sm" />
          <button type="submit" className="h-8 rounded-md border px-3 text-sm">
            Move to qualified
          </button>
        </form>

        <form action={convertAction} className="rounded-lg border p-3">
          <p className="mb-2 text-sm font-medium">Convert</p>
          <textarea name="note" placeholder="Optional note" className="mb-2 min-h-20 w-full rounded-md border p-2 text-sm" />
          <button type="submit" className="h-8 rounded-md border px-3 text-sm">
            Move to converted
          </button>
        </form>

        <form action={archiveAction} className="rounded-lg border p-3">
          <p className="mb-2 text-sm font-medium">Archive</p>
          <textarea name="note" placeholder="Optional note" className="mb-2 min-h-20 w-full rounded-md border p-2 text-sm" />
          <button type="submit" className="h-8 rounded-md border px-3 text-sm">
            Move to archived
          </button>
        </form>
      </section>

      <Link href="/admin/leads" className="text-sm underline">
        Back to leads
      </Link>
    </main>
  )
}
