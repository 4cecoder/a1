export const LEAD_STATUSES = ["new", "qualified", "converted", "archived"] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const CLIENT_STATUSES = ["active", "archived"] as const

export type ClientStatus = (typeof CLIENT_STATUSES)[number]

export type CRMOwner = "Unassigned" | "Marcus" | "DeShawn" | "Ray"

export type Lead = {
  id: string
  fullName: string
  email: string
  phone: string
  source: "walk-in" | "website" | "referral" | "instagram"
  status: LeadStatus
  owner: CRMOwner
  tags: string[]
  notes?: string
  createdAt: string
  qualifiedAt?: string
  convertedAt?: string
  archivedAt?: string
  potentialService: string
}

export type VisitTimelineItem = {
  id: string
  at: string
  label: string
  detail: string
  type: "visit" | "note" | "lifecycle"
}

export type Client = {
  id: string
  fullName: string
  email: string
  phone: string
  status: ClientStatus
  owner: CRMOwner
  tags: string[]
  joinedAt: string
  lastVisitAt?: string
  preferredServices: string[]
  totalVisits: number
  lifetimeValueUsd: number
  notes?: string
  timeline: VisitTimelineItem[]
}

export type LeadFilters = {
  search?: string
  status?: LeadStatus | "all"
  owner?: CRMOwner | "all"
  tags?: string[]
}

export type ClientFilters = {
  search?: string
  status?: ClientStatus | "all"
  owner?: CRMOwner | "all"
  tags?: string[]
}

export type CRMActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string }

export const CRM_LIFECYCLE_FLOW: Array<{ key: LeadStatus; label: string }> = [
  { key: "new", label: "New" },
  { key: "qualified", label: "Qualified" },
  { key: "converted", label: "Converted" },
  { key: "archived", label: "Archived" },
]

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-001",
    fullName: "Jordan Miles",
    email: "jordan@example.com",
    phone: "803-555-0123",
    source: "website",
    status: "new",
    owner: "Marcus",
    tags: ["fade", "weekday"],
    createdAt: "2026-05-22T10:00:00.000Z",
    potentialService: "Skin Fade",
    notes: "Requested morning slot",
  },
  {
    id: "lead-002",
    fullName: "Chris Bennett",
    email: "chris@example.com",
    phone: "803-555-0188",
    source: "instagram",
    status: "qualified",
    owner: "DeShawn",
    tags: ["beard", "vip"],
    createdAt: "2026-05-20T14:20:00.000Z",
    qualifiedAt: "2026-05-21T09:00:00.000Z",
    potentialService: "Cut + Beard",
  },
  {
    id: "lead-003",
    fullName: "Andre Cole",
    email: "andre@example.com",
    phone: "803-555-0110",
    source: "referral",
    status: "converted",
    owner: "Ray",
    tags: ["new-client", "lineup"],
    createdAt: "2026-05-16T17:00:00.000Z",
    qualifiedAt: "2026-05-17T11:00:00.000Z",
    convertedAt: "2026-05-19T13:35:00.000Z",
    potentialService: "Classic Cut",
  },
  {
    id: "lead-004",
    fullName: "Sam Everett",
    email: "sam@example.com",
    phone: "803-555-0191",
    source: "walk-in",
    status: "archived",
    owner: "Unassigned",
    tags: ["no-response"],
    createdAt: "2026-05-10T12:30:00.000Z",
    archivedAt: "2026-05-18T12:30:00.000Z",
    potentialService: "Hot Towel Shave",
    notes: "Follow up next month",
  },
]

export const MOCK_CLIENTS: Client[] = [
  {
    id: "client-001",
    fullName: "Andre Cole",
    email: "andre@example.com",
    phone: "803-555-0110",
    status: "active",
    owner: "Ray",
    tags: ["lineup", "new-client"],
    joinedAt: "2026-05-19T13:35:00.000Z",
    lastVisitAt: "2026-05-27T15:10:00.000Z",
    preferredServices: ["Classic Cut", "Lineup"],
    totalVisits: 3,
    lifetimeValueUsd: 108,
    notes: "Prefers late afternoon appointments.",
    timeline: [
      {
        id: "ev-1",
        at: "2026-05-19T13:35:00.000Z",
        label: "Converted from lead",
        detail: "Completed first paid appointment.",
        type: "lifecycle",
      },
      {
        id: "ev-2",
        at: "2026-05-23T13:10:00.000Z",
        label: "Visit",
        detail: "Classic Cut + beard cleanup",
        type: "visit",
      },
      {
        id: "ev-3",
        at: "2026-05-27T15:10:00.000Z",
        label: "Team note",
        detail: "Requested recurring two-week schedule.",
        type: "note",
      },
    ],
  },
  {
    id: "client-002",
    fullName: "Monica Reed",
    email: "monica@example.com",
    phone: "803-555-0172",
    status: "active",
    owner: "Marcus",
    tags: ["fade", "biweekly"],
    joinedAt: "2026-04-12T09:10:00.000Z",
    lastVisitAt: "2026-05-25T09:30:00.000Z",
    preferredServices: ["Fade"],
    totalVisits: 9,
    lifetimeValueUsd: 315,
    timeline: [
      {
        id: "ev-4",
        at: "2026-04-12T09:10:00.000Z",
        label: "Client onboarded",
        detail: "Converted from referral campaign.",
        type: "lifecycle",
      },
      {
        id: "ev-5",
        at: "2026-05-25T09:30:00.000Z",
        label: "Visit",
        detail: "High fade refresh",
        type: "visit",
      },
    ],
  },
  {
    id: "client-003",
    fullName: "Kevin White",
    email: "kevin@example.com",
    phone: "803-555-0109",
    status: "archived",
    owner: "DeShawn",
    tags: ["inactive", "beard"],
    joinedAt: "2025-12-01T11:00:00.000Z",
    lastVisitAt: "2026-02-14T11:45:00.000Z",
    preferredServices: ["Cut + Beard"],
    totalVisits: 5,
    lifetimeValueUsd: 200,
    notes: "Moved out of state.",
    timeline: [
      {
        id: "ev-6",
        at: "2026-03-01T13:00:00.000Z",
        label: "Archived",
        detail: "Marked inactive after relocation.",
        type: "lifecycle",
      },
    ],
  },
]
