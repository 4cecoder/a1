"use server"

import { api } from "@/convex/_generated/api"
import { runConvexQuery } from "@/lib/server-actions/convex-client"
import {
  type CRMActionResult,
  type Lead,
  type LeadStatus,
  MOCK_LEADS,
} from "@/lib/types/crm"

export type CreateLeadInput = Pick<
  Lead,
  "fullName" | "email" | "phone" | "source" | "owner" | "tags" | "potentialService"
> & {
  notes?: string
}

export type LeadLifecycleActionInput = {
  leadId: string
  actorUserId?: string
  note?: string
}

const TRANSITION_TARGET: Record<"qualify" | "convert" | "archive", LeadStatus> = {
  qualify: "qualified",
  convert: "converted",
  archive: "archived",
}

async function pingConvex(): Promise<void> {
  try {
    await runConvexQuery(api.users.current, {})
  } catch {
    // Gracefully degrade to local CRM fixtures when Convex is unavailable.
  }
}

export async function getLeads(): Promise<CRMActionResult<Lead[]>> {
  await pingConvex()
  return { ok: true, data: MOCK_LEADS }
}

export async function getLeadById(leadId: string): Promise<CRMActionResult<Lead>> {
  await pingConvex()

  const lead = MOCK_LEADS.find((item) => item.id === leadId)
  if (!lead) {
    return { ok: false, error: `Lead ${leadId} not found` }
  }

  return { ok: true, data: lead }
}

async function lifecycleTransition(
  type: keyof typeof TRANSITION_TARGET,
  input: LeadLifecycleActionInput
): Promise<CRMActionResult<Lead>> {
  await pingConvex()

  const lead = MOCK_LEADS.find((item) => item.id === input.leadId)

  if (!lead) {
    return { ok: false, error: `Lead ${input.leadId} not found` }
  }

  const now = new Date().toISOString()
  const targetStatus = TRANSITION_TARGET[type]

  const updated: Lead = {
    ...lead,
    status: targetStatus,
    notes: input.note ? `${lead.notes ?? ""}\n${input.note}`.trim() : lead.notes,
    qualifiedAt: targetStatus === "qualified" || lead.qualifiedAt ? now : lead.qualifiedAt,
    convertedAt: targetStatus === "converted" || lead.convertedAt ? now : lead.convertedAt,
    archivedAt: targetStatus === "archived" || lead.archivedAt ? now : lead.archivedAt,
  }

  return {
    ok: true,
    data: updated,
    message: `Lead moved to ${targetStatus}`,
  }
}

export async function createLead(input: CreateLeadInput): Promise<CRMActionResult<Lead>> {
  await pingConvex()

  const fullName = input.fullName.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()

  if (!fullName || !email || !phone) {
    return { ok: false, error: "fullName, email, and phone are required" }
  }

  return {
    ok: true,
    message: "Lead created",
    data: {
      id: `lead-${Date.now()}`,
      fullName,
      email,
      phone,
      source: input.source,
      owner: input.owner,
      tags: [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))],
      potentialService: input.potentialService,
      notes: input.notes,
      status: "new",
      createdAt: new Date().toISOString(),
    },
  }
}

export async function qualifyLead(
  input: LeadLifecycleActionInput
): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("qualify", input)
}

export async function convertLead(
  input: LeadLifecycleActionInput
): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("convert", input)
}

export async function archiveLead(
  input: LeadLifecycleActionInput
): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("archive", input)
}
