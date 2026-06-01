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

export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUserWithRole(ctx);
    const staff = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "staff"))
      .collect();
    const admins = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    return [...admins, ...staff].filter((u) => u.isActive);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    await ctx.db.patch(args.userId, { role: args.role, updatedAt: Date.now() });
    return { userId: args.userId };
  },
});

export const deactivateUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);
    await ctx.db.patch(args.userId, { isActive: false, updatedAt: Date.now() });
    return { userId: args.userId };
  },
});
