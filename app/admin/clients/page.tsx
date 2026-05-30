import { ClientList } from "@/components/admin/crm/ClientList"
import { createClient, getClients } from "@/lib/server-actions/clients/actions"
import {
  CLIENT_STATUSES,
  type CRMOwner,
  type Client,
  type ClientFilters,
  type ClientStatus,
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

function parseFilters(params: Record<string, QueryValue>): ClientFilters {
  const rawStatus = firstParam(params.status)
  const rawOwner = firstParam(params.owner)

  const status: ClientFilters["status"] =
    rawStatus === "all" || CLIENT_STATUSES.includes(rawStatus as ClientStatus)
      ? (rawStatus as ClientFilters["status"])
      : "all"

  const owner: ClientFilters["owner"] =
    rawOwner === "all" || OWNERS.includes(rawOwner as CRMOwner)
      ? (rawOwner as ClientFilters["owner"])
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

function filterClients(clients: Client[], filters: ClientFilters): Client[] {
  return clients.filter((client) => {
    if (filters.status && filters.status !== "all" && client.status !== filters.status) {
      return false
    }

    if (filters.owner && filters.owner !== "all" && client.owner !== filters.owner) {
      return false
    }

    if (filters.tags?.length && !filters.tags.every((tag) => client.tags.includes(tag))) {
      return false
    }

    if (!filters.search) {
      return true
    }

    const haystack = `${client.fullName} ${client.email} ${client.phone}`.toLowerCase()
    return haystack.includes(filters.search.toLowerCase())
  })
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput
}) {
  const params = (await searchParams) ?? {}
  const filters = parseFilters(params)

  const clientsResult = await getClients()
  const allClients = clientsResult.ok ? clientsResult.data : []
  const clients = filterClients(allClients, filters)
  const tags = [...new Set(allClients.flatMap((client) => client.tags))].sort((a, b) => a.localeCompare(b))

  async function createClientAction(formData: FormData) {
    "use server"

    await createClient({
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      owner: (String(formData.get("owner") ?? "Unassigned") as CRMOwner) || "Unassigned",
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      preferredServices: String(formData.get("preferredServices") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      notes: String(formData.get("notes") ?? "") || undefined,
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">CRM Clients</h1>
        <p className="text-sm text-muted-foreground">
          Client lifecycle support with active/archived management and profile drill-down.
        </p>
      </header>

      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-sm font-medium">Quick create client</h2>
        <form action={createClientAction} className="grid gap-2 md:grid-cols-3">
          <input name="fullName" required placeholder="Full name" className="h-8 rounded-md border px-2 text-sm" />
          <input name="email" type="email" required placeholder="Email" className="h-8 rounded-md border px-2 text-sm" />
          <input name="phone" required placeholder="Phone" className="h-8 rounded-md border px-2 text-sm" />
          <select name="owner" className="h-8 rounded-md border px-2 text-sm">
            {OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <input name="tags" placeholder="tags,comma,separated" className="h-8 rounded-md border px-2 text-sm" />
          <input
            name="preferredServices"
            placeholder="services,comma,separated"
            className="h-8 rounded-md border px-2 text-sm"
          />
          <textarea
            name="notes"
            placeholder="Optional note"
            className="min-h-20 rounded-md border p-2 text-sm md:col-span-2"
          />
          <button type="submit" className="h-8 rounded-md border px-3 text-sm font-medium md:self-end">
            Create client
          </button>
        </form>
      </section>

      <ClientList clients={clients} filters={filters} availableTags={tags} />
    </main>
  )
}
