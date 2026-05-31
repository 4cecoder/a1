import { describe, it, expect, vi, beforeEach } from "vitest"

// ---- Hoist so refs are available inside vi.mock factory ----
const { mockQuery, mockMutation } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutation: vi.fn(),
}))

vi.mock("convex/browser", () => ({
  ConvexHttpClient: vi.fn().mockImplementation(function (this: unknown) {
    return { query: mockQuery, mutation: mockMutation }
  }),
}))

// ---- Mock convex/_generated/api ----
vi.mock("@/convex/_generated/api", () => ({
  api: {
    crm: {
      listLeads: "crm:listLeads",
      createLead: "crm:createLead",
      createClient: "crm:createClient",
      archiveClient: "crm:archiveClient",
    },
    booking: {
      createAppointment: "booking:createAppointment",
      listAppointmentsByDate: "booking:listAppointmentsByDate",
    },
    notifications: {
      getAutomationSettings: "notifications:getAutomationSettings",
    },
    users: {
      current: "users:current",
    },
  },
}))

// ---- Import actions after mocks ----
import { getClients, createClient } from "@/lib/server-actions/clients/actions"
import { getLeads, createLead } from "@/lib/server-actions/leads/actions"
import { submitBooking } from "@/lib/server-actions/booking/actions"

beforeEach(() => {
  vi.clearAllMocks()
  process.env.NEXT_PUBLIC_CONVEX_URL = "https://adventurous-marten-933.convex.cloud"
})

// ==================== CLIENTS ====================
describe("getClients", () => {
  it("returns ok:true with data on success", async () => {
    const fakeClients = [{ _id: "c1", fullName: "John Doe" }]
    mockQuery.mockResolvedValueOnce(fakeClients)
    const result = await getClients()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(fakeClients)
    }
  })

  it("returns ok:true with fallback data when Convex throws", async () => {
    mockQuery.mockRejectedValueOnce(new Error("network error"))
    const result = await getClients()
    expect(result.ok).toBe(true)
    // Returns MOCK_CLIENTS fallback — just check it's an array
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true)
    }
  })
})

describe("createClient", () => {
  it("returns ok:true with data on success", async () => {
    const fakeClient = { _id: "c2", fullName: "Jane Smith" }
    mockMutation.mockResolvedValueOnce(fakeClient)
    const result = await createClient({ fullName: "Jane Smith" })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(fakeClient)
    }
  })

  it("returns ok:false when fullName is missing", async () => {
    const result = await createClient({ fullName: "  " })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/fullName/i)
    }
  })

  it("returns ok:false when Convex throws", async () => {
    mockMutation.mockRejectedValueOnce(new Error("Unauthorized"))
    const result = await createClient({ fullName: "Jane Smith" })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain("Unauthorized")
    }
  })
})

// ==================== LEADS ====================
describe("getLeads", () => {
  it("returns ok:true with data on success", async () => {
    const fakeLeads = [{ _id: "l1", fullName: "Lead One" }]
    mockQuery.mockResolvedValueOnce(fakeLeads)
    const result = await getLeads()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(fakeLeads)
    }
  })

  it("returns ok:true with fallback data on throw", async () => {
    mockQuery.mockRejectedValueOnce(new Error("timeout"))
    const result = await getLeads()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(Array.isArray(result.data)).toBe(true)
    }
  })
})

describe("createLead", () => {
  it("returns ok:true on success", async () => {
    const fakeLead = { _id: "l2", fullName: "New Lead" }
    mockMutation.mockResolvedValueOnce(fakeLead)
    const result = await createLead({ fullName: "New Lead", source: "website", owner: undefined as never, tags: [], potentialService: "haircut" })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(fakeLead)
    }
  })

  it("returns ok:false when fullName is missing", async () => {
    const result = await createLead({ fullName: "", source: "website", owner: undefined as never, tags: [], potentialService: "" })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/fullName/i)
    }
  })
})

// ==================== BOOKING ====================
describe("submitBooking", () => {
  it("returns ok:true with appointmentId and confirmationCode on success", async () => {
    const fakeAppt = { _id: "appt-123", confirmationCode: "CONF-ABC" }
    mockMutation.mockResolvedValueOnce(fakeAppt)
    const result = await submitBooking({
      customerName: "Alex",
      service: "haircut",
      startAt: Date.now(),
      endAt: Date.now() + 3600000,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.appointmentId).toBe("appt-123")
      expect(result.data.confirmationCode).toBe("CONF-ABC")
    }
  })

  it("returns ok:false when Convex throws", async () => {
    mockMutation.mockRejectedValueOnce(new Error("slot taken"))
    const result = await submitBooking({
      customerName: "Alex",
      service: "haircut",
      startAt: Date.now(),
      endAt: Date.now() + 3600000,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain("slot taken")
    }
  })

  it("returns ok:false when customerName is missing", async () => {
    const result = await submitBooking({
      customerName: "",
      service: "haircut",
      startAt: Date.now(),
      endAt: Date.now() + 3600000,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/customerName/i)
    }
  })
})
