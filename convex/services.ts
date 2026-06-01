import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { type Role, assertHasRole, STAFF_OR_ADMIN } from "./roles";

async function getAuthenticatedUserWithRole(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (!user) throw new ConvexError("User not found");

  const role = assertHasRole(user.role as Role, STAFF_OR_ADMIN);
  return { user, role };
}

export const listServices = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    if (args.activeOnly) {
      return ctx.db.query("services").withIndex("by_active", (q) => q.eq("isActive", true)).collect();
    }
    return ctx.db.query("services").collect();
  },
});

export const listServicesPublic = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("services").withIndex("by_active", (q) => q.eq("isActive", true)).collect();
  },
});

export const createService = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    durationMinutes: v.number(),
    priceCents: v.number(),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    const now = Date.now();
    const slug = args.slug ?? args.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const id = await ctx.db.insert("services", {
      name: args.name.trim(),
      slug,
      description: args.description,
      durationMinutes: args.durationMinutes,
      priceCents: args.priceCents,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
    return { serviceId: id };
  },
});

export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    priceCents: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    const { serviceId, ...rest } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (rest.name !== undefined) patch.name = rest.name.trim();
    if (rest.description !== undefined) patch.description = rest.description;
    if (rest.durationMinutes !== undefined) patch.durationMinutes = rest.durationMinutes;
    if (rest.priceCents !== undefined) patch.priceCents = rest.priceCents;
    if (rest.isActive !== undefined) patch.isActive = rest.isActive;
    await ctx.db.patch(serviceId, patch);
    return { serviceId };
  },
});

export const deleteService = mutation({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    await ctx.db.delete(args.serviceId);
    return { serviceId: args.serviceId };
  },
});
