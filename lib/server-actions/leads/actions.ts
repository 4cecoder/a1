"use server"

import { api } from "@/convex/_generated/api"
import { runConvexQuery, runConvexMutation } from "@/lib/server-actions/convex-client"
import {
  type CRMActionResult,
  type Lead,
  type LeadStatus,
  MOCK_LEADS,
} from "@/lib/types/crm"

export type CreateLeadInput = Pick<
  Lead,
  "fullName" | "source" | "owner" | "tags" | "potentialService"
> & {
  email?: string
  phone?: string
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

export async function getLeads(): Promise<CRMActionResult<Lead[]>> {
  try {
    const data = await runConvexQuery(api.crm.listLeads, {})
    return { ok: true, data: data as Lead[] }
  } catch {
    return { ok: true, data: MOCK_LEADS }
  }
}

export async function getLeadById(leadId: string): Promise<CRMActionResult<Lead>> {
  try {
    const leads = await runConvexQuery(api.crm.listLeads, {})
    const list = leads as Lead[]
    const lead = list.find((item) => item.id === leadId)
    if (!lead) {
      return { ok: false, error: `Lead ${leadId} not found` }
    }
    return { ok: true, data: lead }
  } catch {
    const lead = MOCK_LEADS.find((item) => item.id === leadId)
    if (!lead) {
      return { ok: false, error: `Lead ${leadId} not found` }
    }
    return { ok: true, data: lead }
  }
}

export async function createLead(input: CreateLeadInput): Promise<CRMActionResult<Lead>> {
  const fullName = input.fullName?.trim() ?? ""

  if (!fullName) {
    return { ok: false, error: "fullName is required" }
  }

  try {
    const data = await runConvexMutation(api.crm.createLead, {
      fullName,
      phone: input.phone,
      email: input.email,
      source: input.source,
      tags: input.tags,
      notes: input.notes,
    })
    return { ok: true, message: "Lead created", data: data as Lead }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

async function lifecycleTransition(
  type: keyof typeof TRANSITION_TARGET,
  input: LeadLifecycleActionInput
): Promise<CRMActionResult<Lead>> {
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
  return { ok: true, data: updated, message: `Lead moved to ${targetStatus}` }
}

export async function qualifyLead(input: LeadLifecycleActionInput): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("qualify", input)
}

export async function convertLead(input: LeadLifecycleActionInput): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("convert", input)
}

export async function archiveLead(input: LeadLifecycleActionInput): Promise<CRMActionResult<Lead>> {
  return lifecycleTransition("archive", input)
}
