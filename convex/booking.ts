import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { type Role, assertHasRole, STAFF_OR_ADMIN } from "./roles";

async function getAuthenticatedUserWithRole(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Unauthorized");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError("User not found");
  }

  const role = assertHasRole(user.role as Role, STAFF_OR_ADMIN);
  return { user, role };
}

function intersects(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export const createAppointment = mutation({
  args: {
    clientId: v.id("clients"),
    serviceId: v.id("services"),
    staffUserId: v.optional(v.id("users")),
    startAt: v.number(),
    endAt: v.number(),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show"),
      ),
    ),
    dateKey: v.optional(v.string()),
    slotId: v.optional(v.string()),
    barberPreferenceId: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    paymentStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("requires_capture"),
        v.literal("paid"),
        v.literal("succeeded"),
        v.literal("refunded"),
        v.literal("failed"),
        v.literal("canceled"),
      ),
    ),
    checkoutIntentId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await getAuthenticatedUserWithRole(ctx);

    if (args.endAt <= args.startAt) {
      throw new ConvexError("Invalid appointment window");
    }

    const [client, service] = await Promise.all([ctx.db.get(args.clientId), ctx.db.get(args.serviceId)]);
    if (!client) {
      throw new ConvexError("Client not found");
    }
    if (!service) {
      throw new ConvexError("Service not found");
    }

    if (args.staffUserId) {
      const nearby = await ctx.db.query("appointments").withIndex("by_staff", (q) => q.eq("staffUserId", args.staffUserId)).collect();
      const conflicts = nearby.filter(
        (appointment) =>
          appointment.status !== "cancelled" &&
          intersects(args.startAt, args.endAt, appointment.startAt, appointment.endAt),
      );

      if (conflicts.length > 0) {
        throw new ConvexError("Scheduling conflict for selected staff member");
      }
    }

    const now = Date.now();
    const appointmentId = await ctx.db.insert("appointments", {
      clientId: args.clientId,
      serviceId: args.serviceId,
      staffUserId: args.staffUserId,
      createdByUserId: user._id,
      status: args.status ?? "scheduled",
      startAt: args.startAt,
      endAt: args.endAt,
      dateKey: args.dateKey,
      slotId: args.slotId,
      barberPreferenceId: args.barberPreferenceId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      priceCents: args.priceCents,
      currency: args.currency,
      paymentStatus: args.paymentStatus,
      checkoutIntentId: args.checkoutIntentId,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return { appointmentId };
  },
});

export const listAppointmentsByDate = query({
  args: {
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const appointments = await ctx.db.query("appointments").withIndex("by_start").collect();
    return appointments.filter((appointment) => appointment.startAt >= args.from && appointment.startAt < args.to);
  },
});

// Public booking mutation — no authentication required
export const createPublicAppointment = mutation({
  args: {
    serviceId: v.id("services"),
    startAt: v.number(),
    endAt: v.number(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.endAt <= args.startAt) {
      throw new ConvexError("Invalid appointment window");
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service) throw new ConvexError("Service not found");

    const now = Date.now();

    // Find or create a walk-in client record
    let clientId = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", args.customerEmail ?? ""))
      .unique()
      .then((c) => c?._id ?? null);

    if (!clientId) {
      const nameParts = args.customerName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? args.customerName;
      const lastName = nameParts.slice(1).join(" ");
      clientId = await ctx.db.insert("clients", {
        firstName,
        lastName,
        fullName: args.customerName.trim(),
        email: args.customerEmail,
        phone: args.customerPhone,
        status: "active",
        tags: [],
        preferredServices: [service.name],
        joinedAt: now,
        totalVisits: 0,
        lifetimeValueCents: 0,
        timeline: [
          {
            at: now,
            label: "Booked online",
            detail: `Booked ${service.name} via public booking page`,
            type: "lifecycle",
          },
        ],
        createdAt: now,
        updatedAt: now,
      });
    }

    const appointmentId = await ctx.db.insert("appointments", {
      clientId,
      serviceId: args.serviceId,
      status: "scheduled",
      startAt: args.startAt,
      endAt: args.endAt,
      customerName: args.customerName.trim(),
      customerEmail: args.customerEmail,
      priceCents: service.priceCents,
      currency: "USD",
      paymentStatus: "pending",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return { appointmentId };
  },
});

export const listAppointmentsByClient = query({
  args: {
    clientId: v.id("clients"),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    return await ctx.db.query("appointments").withIndex("by_client", (q) => q.eq("clientId", args.clientId)).order("desc").collect();
  },
});
