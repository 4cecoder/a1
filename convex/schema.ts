import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const roleValidator = v.union(v.literal("admin"), v.literal("staff"), v.literal("customer"));

const leadStatusValidator = v.union(
  v.literal("new"),
  v.literal("qualified"),
  v.literal("converted"),
  v.literal("archived"),
);

const clientStatusValidator = v.union(v.literal("active"), v.literal("archived"));

const timelineItemValidator = v.object({
  at: v.number(),
  label: v.string(),
  detail: v.string(),
  type: v.union(v.literal("visit"), v.literal("note"), v.literal("lifecycle")),
});

const appointmentStatusValidator = v.union(
  v.literal("scheduled"),
  v.literal("confirmed"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("no_show"),
);

const paymentMethodValidator = v.union(
  v.literal("cash"),
  v.literal("card"),
  v.literal("bank_transfer"),
  v.literal("stripe"),
  v.literal("other"),
);

const paymentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("requires_capture"),
  v.literal("paid"),
  v.literal("succeeded"),
  v.literal("refunded"),
  v.literal("failed"),
  v.literal("canceled"),
);

const notificationEventTypeValidator = v.union(
  v.literal("confirmation"),
  v.literal("reminder"),
  v.literal("no_show_follow_up"),
  v.literal("internal_gap_alert"),
);

const notificationChannelValidator = v.union(v.literal("sms"), v.literal("email"), v.literal("internal"));

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: roleValidator,
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_external_id", ["externalId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  leads: defineTable({
    ownerUserId: v.optional(v.id("users")),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.union(
      v.literal("walk-in"),
      v.literal("website"),
      v.literal("referral"),
      v.literal("instagram"),
      v.literal("other"),
    ),
    potentialService: v.optional(v.string()),
    status: leadStatusValidator,
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    qualifiedAt: v.optional(v.number()),
    convertedAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),
    clientId: v.optional(v.id("clients")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_owner_user_id", ["ownerUserId"])
    .index("by_created_at", ["createdAt"])
    .index("by_email", ["email"])
    .index("by_client_id", ["clientId"]),

  clients: defineTable({
    ownerUserId: v.optional(v.id("users")),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: clientStatusValidator,
    tags: v.array(v.string()),
    preferredServices: v.array(v.string()),
    joinedAt: v.optional(v.number()),
    lastVisitAt: v.optional(v.number()),
    totalVisits: v.number(),
    lifetimeValueCents: v.number(),
    timeline: v.array(timelineItemValidator),
    archivedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_user_id", ["ownerUserId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

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
    createdByUserId: v.optional(v.id("users")),
    status: appointmentStatusValidator,
    startAt: v.number(),
    endAt: v.number(),
    dateKey: v.optional(v.string()),
    slotId: v.optional(v.string()),
    barberPreferenceId: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    paymentStatus: v.optional(paymentStatusValidator),
    checkoutIntentId: v.optional(v.string()),
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
    currency: v.optional(v.string()),
    method: paymentMethodValidator,
    status: paymentStatusValidator,
    paymentIntentId: v.optional(v.string()),
    receiptId: v.optional(v.string()),
    externalReference: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.string())),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_appointment", ["appointmentId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_payment_intent_id", ["paymentIntentId"]),

  notificationAutomationSettings: defineTable({
    scope: v.string(),
    confirmationEnabled: v.boolean(),
    confirmationSendImmediately: v.boolean(),
    reminderOffsetsMinutes: v.array(v.number()),
    noShowFollowUpEnabled: v.boolean(),
    noShowFollowUpOffsetMinutes: v.number(),
    internalGapAlertEnabled: v.boolean(),
    internalGapAlertThresholdMinutes: v.number(),
    updatedByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_scope", ["scope"]),

  notificationJobs: defineTable({
    eventType: notificationEventTypeValidator,
    channel: notificationChannelValidator,
    status: v.union(
      v.literal("queued"),
      v.literal("scheduled"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),
    recipientId: v.optional(v.string()),
    recipientDisplayName: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    recipientPhone: v.optional(v.string()),
    scheduledFor: v.number(),
    templateId: v.optional(v.string()),
    templateVersion: v.optional(v.number()),
    dedupeKey: v.optional(v.string()),
    context: v.optional(v.record(v.string(), v.string())),
    metadata: v.optional(v.record(v.string(), v.string())),
    errorMessage: v.optional(v.string()),
    createdByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_scheduled_for", ["scheduledFor"])
    .index("by_event_type", ["eventType"])
    .index("by_created_at", ["createdAt"]),
});
