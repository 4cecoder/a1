import Link from "next/link"

import { ClientProfileCard } from "@/components/admin/crm/ClientProfileCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { archiveClient } from "@/lib/server-actions/clients/actions"
import { MOCK_CLIENTS } from "@/lib/types/crm"

type ParamsInput = Promise<{ id: string }> | { id: string }

export default async function ClientDetailPage({ params }: { params: ParamsInput }) {
  const resolvedParams = await params
  const client = MOCK_CLIENTS.find((item) => item.id === resolvedParams.id)

  if (!client) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-muted-foreground">Client not found.</p>
        <Link href="/admin/clients" className="text-sm underline">
          Back to clients
        </Link>
      </main>
    )
  }

  const resolvedClient = client as (typeof MOCK_CLIENTS)[number]

  async function archiveAction(formData: FormData) {
    "use server"
    await archiveClient({
      clientId: resolvedClient.id,
      reason: String(formData.get("reason") ?? "") || undefined,
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Client profile</h1>
        <p className="text-sm text-muted-foreground">
          Lifecycle details and visit timeline for admin CRM workflows.
        </p>
      </header>

      <ClientProfileCard client={client} />

      <Card>
        <CardHeader>
          <CardTitle>Lifecycle action</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={archiveAction} className="grid gap-2">
            <textarea
              name="reason"
              placeholder="Optional archive reason"
              className="min-h-24 rounded-md border p-2 text-sm"
            />
            <button type="submit" className="h-8 w-fit rounded-md border px-3 text-sm">
              Archive client
            </button>
          </form>
        </CardContent>
      </Card>

      <Link href="/admin/clients" className="text-sm underline">
        Back to clients
      </Link>
    </main>
  )
}
