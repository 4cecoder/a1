import { LeadFunnel } from "@/components/admin/crm/LeadFunnel"
import { LeadList } from "@/components/admin/crm/LeadList"
import { createLead, getLeads } from "@/lib/server-actions/leads/actions"
import {
  LEAD_STATUSES,
  type CRMOwner,
  type Lead,
  type LeadFilters,
  type LeadStatus,
} from "@/lib/types/crm"

type QueryValue = string | string[] | undefined

type SearchParamsInput = Promise<Record<string, QueryValue>> | Record<string, QueryValue> | undefined

const OWNERS: CRMOwner[] = ["Unassigned", "Marcus", "DeShawn", "Ray"]

function firstParam(value: QueryValue): string | undefined {
  if (!value) {
    return undefined
  }

  return Array.isArray(value) ? value[0] : value
}

function multiParam(value: QueryValue): string[] {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function parseFilters(params: Record<string, QueryValue>): LeadFilters {
  const rawStatus = firstParam(params.status)
  const rawOwner = firstParam(params.owner)

  const status: LeadFilters["status"] =
    rawStatus === "all" || LEAD_STATUSES.includes(rawStatus as LeadStatus)
      ? (rawStatus as LeadFilters["status"])
      : "all"

  const owner: LeadFilters["owner"] =
    rawOwner === "all" || OWNERS.includes(rawOwner as CRMOwner)
      ? (rawOwner as LeadFilters["owner"])
      : "all"

  const search = firstParam(params.q)?.trim() ?? ""
  const tags = [...new Set(multiParam(params.tags).map((tag) => tag.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  )

  return {
    search,
    status,
    owner,
    tags,
  }
}

function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  return leads.filter((lead) => {
    if (filters.status && filters.status !== "all" && lead.status !== filters.status) {
      return false
    }

    if (filters.owner && filters.owner !== "all" && lead.owner !== filters.owner) {
      return false
    }

    if (filters.tags?.length && !filters.tags.every((tag) => lead.tags.includes(tag))) {
      return false
    }

    if (!filters.search) {
      return true
    }

    const haystack = `${lead.fullName} ${lead.email} ${lead.phone}`.toLowerCase()
    return haystack.includes(filters.search.toLowerCase())
  })
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput
}) {
  const params = (await searchParams) ?? {}
  const filters = parseFilters(params)

  const leadsResult = await getLeads()
  const allLeads = leadsResult.ok ? leadsResult.data : []
  const leads = filterLeads(allLeads, filters)
  const tags = [...new Set(allLeads.flatMap((lead) => lead.tags))].sort((a, b) => a.localeCompare(b))

  async function createLeadAction(formData: FormData) {
    "use server"

    await createLead({
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      source: "website",
      owner: (String(formData.get("owner") ?? "Unassigned") as CRMOwner) || "Unassigned",
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      potentialService: String(formData.get("potentialService") ?? "Classic Cut"),
      notes: String(formData.get("notes") ?? "") || undefined,
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">CRM Leads</h1>
        <p className="text-sm text-muted-foreground">
          Lifecycle stage flow: new → qualified → converted → archived.
        </p>
      </header>

      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-sm font-medium">Quick create lead</h2>
        <form action={createLeadAction} className="grid gap-2 md:grid-cols-3">
          <input name="fullName" required placeholder="Full name" className="h-8 rounded-md border px-2 text-sm" />
          <input name="email" type="email" required placeholder="Email" className="h-8 rounded-md border px-2 text-sm" />
          <input name="phone" required placeholder="Phone" className="h-8 rounded-md border px-2 text-sm" />
          <input name="potentialService" placeholder="Service" className="h-8 rounded-md border px-2 text-sm" />
          <select name="owner" className="h-8 rounded-md border px-2 text-sm">
            {OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <input name="tags" placeholder="tags,comma,separated" className="h-8 rounded-md border px-2 text-sm" />
          <textarea
            name="notes"
            placeholder="Optional note"
            className="min-h-20 rounded-md border p-2 text-sm md:col-span-2"
          />
          <button type="submit" className="h-8 rounded-md border px-3 text-sm font-medium md:self-end">
            Create lead
          </button>
        </form>
      </section>

      <LeadFunnel leads={allLeads} />
      <LeadList leads={leads} filters={filters} availableTags={tags} />
    </main>
  )
}
