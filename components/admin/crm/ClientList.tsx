import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CLIENT_STATUSES,
  type CRMOwner,
  type Client,
  type ClientFilters,
} from "@/lib/types/crm"

type QueryValue = string | string[] | undefined
type QueryMap = Record<string, QueryValue>

type ClientListProps = {
  clients: Client[]
  filters: ClientFilters
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

export function ClientList({ clients, filters, availableTags, basePath = "/admin/clients" }: ClientListProps) {
  const activeTags = filters.tags ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
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
            {CLIENT_STATUSES.map((status) => (
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
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`${basePath}/${client.id}`}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-medium">{client.fullName}</p>
                <Badge variant={client.status === "active" ? "secondary" : "outline"}>
                  {client.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{client.email} • {client.phone}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Owner: {client.owner}</span>
                <span>Visits: {client.totalVisits}</span>
                <span>LTV: ${client.lifetimeValueUsd}</span>
              </div>
            </Link>
          ))}

          {clients.length === 0 ? (
            <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              No clients match these filters.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
