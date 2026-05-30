import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type CRMOwner,
  type Lead,
  type LeadFilters,
  LEAD_STATUSES,
} from "@/lib/types/crm"

type QueryValue = string | string[] | undefined
type QueryMap = Record<string, QueryValue>

type LeadListProps = {
  leads: Lead[]
  filters: LeadFilters
  availableTags: string[]
  basePath?: string
}

const OWNERS: Array<"all" | CRMOwner> = ["all", "Unassigned", "Marcus", "DeShawn", "Ray"]

function toQueryValue(value: QueryValue): string[] {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function buildHref(path: string, query: QueryMap): string {
  const params = new URLSearchParams()

  for (const key of Object.keys(query).sort()) {
    const values = toQueryValue(query[key])
      .map((value) => value.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))

    for (const value of values) {
      params.append(key, value)
    }
  }

  const encoded = params.toString()
  return encoded ? `${path}?${encoded}` : path
}

function statusBadgeVariant(status: Lead["status"]): "default" | "secondary" | "outline" {
  if (status === "converted") {
    return "default"
  }

  if (status === "qualified") {
    return "secondary"
  }

  return "outline"
}

export function LeadList({ leads, filters, availableTags, basePath = "/admin/leads" }: LeadListProps) {
  const activeTags = filters.tags ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={basePath} method="get" className="grid gap-3 md:grid-cols-4">
          <input
            name="q"
            defaultValue={filters.search ?? ""}
            placeholder="Search name/email/phone"
            className="h-8 rounded-md border bg-background px-2 text-sm"
          />
          <select
            name="status"
            defaultValue={filters.status ?? "all"}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="owner"
            defaultValue={filters.owner ?? "all"}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner === "all" ? "All owners" : owner}
              </option>
            ))}
          </select>
          <button type="submit" className="h-8 rounded-md border px-3 text-sm font-medium">
            Apply filters
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isActive = activeTags.includes(tag)
            const nextTags = isActive ? activeTags.filter((item) => item !== tag) : [...activeTags, tag]
            const href = buildHref(basePath, {
              q: filters.search,
              status: filters.status,
              owner: filters.owner,
              tags: nextTags,
            })

            return (
              <Link key={tag} href={href} className="inline-flex">
                <Badge variant={isActive ? "default" : "outline"}>#{tag}</Badge>
              </Link>
            )
          })}
        </div>

        <div className="space-y-2">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`${basePath}/${lead.id}`}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-medium">{lead.fullName}</p>
                <Badge variant={statusBadgeVariant(lead.status)}>{lead.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{lead.email} • {lead.phone}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Owner: {lead.owner}</span>
                <span>Service: {lead.potentialService}</span>
                <span>Source: {lead.source}</span>
              </div>
            </Link>
          ))}

          {leads.length === 0 ? (
            <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              No leads match these filters.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
