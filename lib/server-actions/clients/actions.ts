"use server"

import { api } from "@/convex/_generated/api"
import { runConvexQuery } from "@/lib/server-actions/convex-client"
import {
  type CRMActionResult,
  type Client,
  type CRMOwner,
  MOCK_CLIENTS,
} from "@/lib/types/crm"

export type CreateClientInput = {
  fullName: string
  email: string
  phone: string
  owner: CRMOwner
  tags?: string[]
  preferredServices?: string[]
  notes?: string
}

export type ArchiveClientInput = {
  clientId: string
  reason?: string
  actorUserId?: string
}

async function pingConvex(): Promise<void> {
  try {
    await runConvexQuery(api.users.current, {})
  } catch {
    // Gracefully degrade to local CRM fixtures when Convex is unavailable.
  }
}

export async function getClients(): Promise<CRMActionResult<Client[]>> {
  await pingConvex()
  return { ok: true, data: MOCK_CLIENTS }
}

export async function getClientById(clientId: string): Promise<CRMActionResult<Client>> {
  await pingConvex()

  const client = MOCK_CLIENTS.find((item) => item.id === clientId)
  if (!client) {
    return { ok: false, error: `Client ${clientId} not found` }
  }

  return { ok: true, data: client }
}

export async function createClient(
  input: CreateClientInput
): Promise<CRMActionResult<Client>> {
  await pingConvex()

  const fullName = input.fullName.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()

  if (!fullName || !email || !phone) {
    return { ok: false, error: "fullName, email, and phone are required" }
  }

  const now = new Date().toISOString()

  return {
    ok: true,
    message: "Client created",
    data: {
      id: `client-${Date.now()}`,
      fullName,
      email,
      phone,
      owner: input.owner,
      tags: [...new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))],
      preferredServices: input.preferredServices?.filter(Boolean) ?? [],
      notes: input.notes,
      joinedAt: now,
      totalVisits: 0,
      lifetimeValueUsd: 0,
      status: "active",
      timeline: [
        {
          id: `ev-${Date.now()}`,
          at: now,
          label: "Client created",
          detail: "Created through admin CRM action",
          type: "lifecycle",
        },
      ],
    },
  }
}

export async function archiveClient(
  input: ArchiveClientInput
): Promise<CRMActionResult<Client>> {
  await pingConvex()

  const client = MOCK_CLIENTS.find((item) => item.id === input.clientId)

  if (!client) {
    return { ok: false, error: `Client ${input.clientId} not found` }
  }

  const now = new Date().toISOString()

  return {
    ok: true,
    message: "Client archived",
    data: {
      ...client,
      status: "archived",
      notes: input.reason ? `${client.notes ?? ""}\nArchive reason: ${input.reason}`.trim() : client.notes,
      timeline: [
        {
          id: `ev-${Date.now()}`,
          at: now,
          label: "Client archived",
          detail: input.reason ?? "Archived by admin",
          type: "lifecycle",
        },
        ...client.timeline,
      ],
    },
  }
}
