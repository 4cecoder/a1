import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("customer")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_external_id", ["externalId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  clients: defineTable({
    ownerUserId: v.optional(v.id("users")),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_user_id", ["ownerUserId"])
    .index("by_email", ["email"]),

  services: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    durationMinutes: v.number(),
    priceCents: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  appointments: defineTable({
    clientId: v.id("clients"),
    serviceId: v.id("services"),
    staffUserId: v.optional(v.id("users")),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
    ),
    startAt: v.number(),
    endAt: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_service", ["serviceId"])
    .index("by_staff", ["staffUserId"])
    .index("by_start", ["startAt"])  
    .index("by_status", ["status"]),

  payments: defineTable({
    appointmentId: v.optional(v.id("appointments")),
    clientId: v.id("clients"),
    amountCents: v.number(),
    method: v.union(
      v.literal("cash"),
      v.literal("card"),
      v.literal("bank_transfer"),
      v.literal("other"),
    ),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("refunded"), v.literal("failed")),
    externalReference: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_appointment", ["appointmentId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),
});
