"use server"

import { api } from "@/convex/_generated/api"
import { runConvexQuery, runConvexMutation } from "@/lib/server-actions/convex-client"
import {
  type CRMActionResult,
  type Client,
  type CRMOwner,
  MOCK_CLIENTS,
} from "@/lib/types/crm"

export type CreateClientInput = {
  fullName: string
  email?: string
  phone?: string
  owner?: CRMOwner
  tags?: string[]
  preferredServices?: string[]
  notes?: string
}

export type ArchiveClientInput = {
  clientId: string
  reason?: string
  actorUserId?: string
}

export async function getClients(): Promise<CRMActionResult<Client[]>> {
  try {
    const data = await runConvexQuery(api.crm.listLeads, { status: "converted" })
    return { ok: true, data: data as Client[] }
  } catch {
    return { ok: true, data: MOCK_CLIENTS }
  }
}

export async function getClientById(clientId: string): Promise<CRMActionResult<Client>> {
  try {
    const clients = await runConvexQuery(api.crm.listLeads, { status: "converted" })
    const list = clients as Client[]
    const client = list.find((item) => item.id === clientId)
    if (!client) {
      return { ok: false, error: `Client ${clientId} not found` }
    }
    return { ok: true, data: client }
  } catch {
    const client = MOCK_CLIENTS.find((item) => item.id === clientId)
    if (!client) {
      return { ok: false, error: `Client ${clientId} not found` }
    }
    return { ok: true, data: client }
  }
}

export async function createClient(
  input: CreateClientInput
): Promise<CRMActionResult<Client>> {
  const fullName = input.fullName?.trim() ?? ""

  if (!fullName) {
    return { ok: false, error: "fullName is required" }
  }

  try {
    const data = await runConvexMutation(api.crm.createClient, {
      fullName,
      phone: input.phone,
      email: input.email,
      tags: input.tags,
      preferredServices: input.preferredServices,
      notes: input.notes,
    })
    return { ok: true, message: "Client created", data: data as Client }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function archiveClient(
  input: ArchiveClientInput
): Promise<CRMActionResult<Client>> {
  try {
    const data = await runConvexMutation(api.crm.archiveClient, {
      clientId: input.clientId as unknown as never,
      reason: input.reason,
      actorUserId: input.actorUserId,
    })
    return { ok: true, message: "Client archived", data: data as Client }
  } catch (err) {
    // Fallback to mock
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
}
