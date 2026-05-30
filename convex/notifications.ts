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

export const getAutomationSettings = query({
  args: {
    scope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUserWithRole(ctx);

    const scope = args.scope ?? "default";
    const existing = await ctx.db
      .query("notificationAutomationSettings")
      .withIndex("by_scope", (q) => q.eq("scope", scope))
      .unique();

    if (existing) return existing;

    return {
      scope,
      confirmationEnabled: true,
      confirmationSendImmediately: true,
      reminderOffsetsMinutes: [24 * 60, 2 * 60],
      noShowFollowUpEnabled: true,
      noShowFollowUpOffsetMinutes: 12 * 60,
      internalGapAlertEnabled: false,
      internalGapAlertThresholdMinutes: 6 * 60,
      updatedByUserId: undefined,
      createdAt: 0,
      updatedAt: 0,
    };
  },
});

export const saveAutomationSettings = mutation({
  args: {
    scope: v.optional(v.string()),
    confirmationEnabled: v.boolean(),
    confirmationSendImmediately: v.boolean(),
    reminderOffsetsMinutes: v.array(v.number()),
    noShowFollowUpEnabled: v.boolean(),
    noShowFollowUpOffsetMinutes: v.number(),
    internalGapAlertEnabled: v.boolean(),
    internalGapAlertThresholdMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await getAuthenticatedUserWithRole(ctx);

    const scope = args.scope ?? "default";
    const now = Date.now();
    const reminderOffsetsMinutes = Array.from(
      new Set(args.reminderOffsetsMinutes.filter((value) => Number.isFinite(value) && value >= 0)),
    ).sort((a, b) => b - a);

    const existing = await ctx.db
      .query("notificationAutomationSettings")
      .withIndex("by_scope", (q) => q.eq("scope", scope))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        confirmationEnabled: args.confirmationEnabled,
        confirmationSendImmediately: args.confirmationSendImmediately,
        reminderOffsetsMinutes,
        noShowFollowUpEnabled: args.noShowFollowUpEnabled,
        noShowFollowUpOffsetMinutes: args.noShowFollowUpOffsetMinutes,
        internalGapAlertEnabled: args.internalGapAlertEnabled,
        internalGapAlertThresholdMinutes: args.internalGapAlertThresholdMinutes,
        updatedByUserId: user._id,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("notificationAutomationSettings", {
      scope,
      confirmationEnabled: args.confirmationEnabled,
      confirmationSendImmediately: args.confirmationSendImmediately,
      reminderOffsetsMinutes,
      noShowFollowUpEnabled: args.noShowFollowUpEnabled,
      noShowFollowUpOffsetMinutes: args.noShowFollowUpOffsetMinutes,
      internalGapAlertEnabled: args.internalGapAlertEnabled,
      internalGapAlertThresholdMinutes: args.internalGapAlertThresholdMinutes,
      updatedByUserId: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const enqueueNotificationJob = mutation({
  args: {
    eventType: v.union(
      v.literal("confirmation"),
      v.literal("reminder"),
      v.literal("no_show_follow_up"),
      v.literal("internal_gap_alert"),
    ),
    channel: v.union(v.literal("sms"), v.literal("email"), v.literal("internal")),
    status: v.optional(
      v.union(v.literal("queued"), v.literal("scheduled"), v.literal("sent"), v.literal("failed"), v.literal("cancelled")),
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
  },
  handler: async (ctx, args) => {
    const { user } = await getAuthenticatedUserWithRole(ctx);

    const now = Date.now();
    const jobId = await ctx.db.insert("notificationJobs", {
      eventType: args.eventType,
      channel: args.channel,
      status: args.status ?? "queued",
      recipientId: args.recipientId,
      recipientDisplayName: args.recipientDisplayName,
      recipientEmail: args.recipientEmail,
      recipientPhone: args.recipientPhone,
      scheduledFor: args.scheduledFor,
      templateId: args.templateId,
      templateVersion: args.templateVersion,
      dedupeKey: args.dedupeKey,
      context: args.context,
      metadata: args.metadata,
      createdByUserId: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return { jobId };
  },
});
