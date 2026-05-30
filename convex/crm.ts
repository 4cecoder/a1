import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { type Role, assertHasRole, STAFF_OR_ADMIN } from "./roles";

const LEAD_SOURCES = ["walk-in", "website", "referral", "instagram", "other"] as const;
const LEAD_STATUSES = ["new", "qualified", "converted", "archived"] as const;
const CLIENT_STATUSES = ["active", "archived"] as const;

type LeadSource = (typeof LEAD_SOURCES)[number];
type LeadStatus = (typeof LEAD_STATUSES)[number];
type ClientStatus = (typeof CLIENT_STATUSES)[number];

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

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/g).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export const listLeads = query({
  args: {
    status: v.optional(
      v.union(v.literal("all"), v.literal("new"), v.literal("qualified"), v.literal("converted"), v.literal("archived")),
    ),
    ownerUserId: v.optional(v.union(v.literal("all"), v.id("users"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const status = args.status ?? "all";
    const ownerUserId = args.ownerUserId ?? "all";
    const limit = Math.min(Math.max(args.limit ?? 200, 1), 500);

    let leads =
      status === "all"
        ? await ctx.db.query("leads").withIndex("by_created_at").order("desc").take(limit)
        : await ctx.db.query("leads").withIndex("by_status", (q) => q.eq("status", status)).order("desc").take(limit);

    if (ownerUserId !== "all") {
      leads = leads.filter((lead) => lead.ownerUserId === ownerUserId);
    }

    return leads;
  },
});

export const createLead = mutation({
  args: {
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.optional(
      v.union(v.literal("walk-in"), v.literal("website"), v.literal("referral"), v.literal("instagram"), v.literal("other")),
    ),
    potentialService: v.optional(v.string()),
    ownerUserId: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await getAuthenticatedUserWithRole(ctx);
    const now = Date.now();

    const leadId = await ctx.db.insert("leads", {
      ownerUserId: args.ownerUserId,
      fullName: args.fullName.trim(),
      email: args.email,
      phone: args.phone,
      source: args.source ?? "other",
      potentialService: args.potentialService,
      status: "new",
      tags: (args.tags ?? []).filter(Boolean),
      notes: args.notes,
      clientId: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return { leadId, createdByUserId: user._id };
  },
});

export const qualifyLead = mutation({
  args: {
    leadId: v.id("leads"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new ConvexError("Lead not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.leadId, {
      status: "qualified",
      qualifiedAt: lead.qualifiedAt ?? now,
      notes: args.notes ?? lead.notes,
      updatedAt: now,
    });

    return { leadId: args.leadId, status: "qualified" as LeadStatus };
  },
});

export const convertLead = mutation({
  args: {
    leadId: v.id("leads"),
    ownerUserId: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
    preferredServices: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new ConvexError("Lead not found");
    }

    const now = Date.now();

    const existingClient = lead.email
      ? await ctx.db.query("clients").withIndex("by_email", (q) => q.eq("email", lead.email)).unique()
      : null;

    let clientId = existingClient?._id;
    if (!clientId) {
      const { firstName, lastName } = splitName(lead.fullName);
      clientId = await ctx.db.insert("clients", {
        ownerUserId: args.ownerUserId ?? lead.ownerUserId,
        firstName,
        lastName,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        status: "active",
        tags: Array.from(new Set([...(lead.tags ?? []), ...((args.tags ?? []).filter(Boolean))])),
        preferredServices: (args.preferredServices ?? []).filter(Boolean),
        joinedAt: now,
        lastVisitAt: undefined,
        totalVisits: 0,
        lifetimeValueCents: 0,
        timeline: [
          {
            at: now,
            label: "Converted from lead",
            detail: `Lead ${lead.fullName} converted to client record`,
            type: "lifecycle",
          },
        ],
        notes: args.notes ?? lead.notes,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(args.leadId, {
      status: "converted",
      convertedAt: lead.convertedAt ?? now,
      clientId,
      updatedAt: now,
    });

    return { leadId: args.leadId, clientId };
  },
});

export const archiveLead = mutation({
  args: {
    leadId: v.id("leads"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new ConvexError("Lead not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.leadId, {
      status: "archived",
      archivedAt: lead.archivedAt ?? now,
      notes: args.notes ?? lead.notes,
      updatedAt: now,
    });

    return { leadId: args.leadId, status: "archived" as LeadStatus };
  },
});

export const createClient = mutation({
  args: {
    ownerUserId: v.optional(v.id("users")),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    preferredServices: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const now = Date.now();
    const { firstName, lastName } = splitName(args.fullName);

    const clientId = await ctx.db.insert("clients", {
      ownerUserId: args.ownerUserId,
      firstName,
      lastName,
      fullName: args.fullName.trim(),
      email: args.email,
      phone: args.phone,
      status: "active",
      tags: (args.tags ?? []).filter(Boolean),
      preferredServices: (args.preferredServices ?? []).filter(Boolean),
      joinedAt: now,
      lastVisitAt: undefined,
      totalVisits: 0,
      lifetimeValueCents: 0,
      timeline: [
        {
          at: now,
          label: "Client created",
          detail: "Client profile created in CRM",
          type: "lifecycle",
        },
      ],
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return { clientId, status: "active" as ClientStatus };
  },
});

export const archiveClient = mutation({
  args: {
    clientId: v.id("clients"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new ConvexError("Client not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.clientId, {
      status: "archived",
      archivedAt: now,
      timeline: [
        {
          at: now,
          label: "Archived",
          detail: args.note ?? "Client archived by staff",
          type: "lifecycle",
        },
        ...client.timeline,
      ],
      updatedAt: now,
    });

    return { clientId: args.clientId, status: "archived" as ClientStatus };
  },
});
