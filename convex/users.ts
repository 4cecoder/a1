import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { assertRole, type Role } from "./roles";

async function getUserFromAuth(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
    .unique();
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getUserFromAuth(ctx);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getUserFromAuth(ctx);
  },
});

export const getMyRole = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    return user?.role ?? null;
  },
});

export const upsertFromIdentity = mutation({
  args: {
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("staff"), v.literal("customer"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const role: Role = assertRole(args.role ?? "customer");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        image: args.image,
        role,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      externalId: args.externalId,
      email: args.email,
      name: args.name,
      image: args.image,
      role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});
