import { mutation } from "./_generated/server";
import { v } from "convex/values";

const INITIAL_SERVICES = [
  {
    name: "Classic Haircut",
    slug: "classic-haircut",
    description: "Traditional barber haircut.",
    durationMinutes: 30,
    priceCents: 3000,
  },
  {
    name: "Skin Fade",
    slug: "skin-fade",
    description: "Skin fade with blending.",
    durationMinutes: 45,
    priceCents: 4000,
  },
  {
    name: "Beard Trim",
    slug: "beard-trim",
    description: "Line up and trim.",
    durationMinutes: 20,
    priceCents: 2000,
  },
] as const;

export const seedInitialData = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const now = Date.now();

    let inserted = 0;
    let skipped = 0;

    for (const service of INITIAL_SERVICES) {
      const existing = await ctx.db
        .query("services")
        .withIndex("by_slug", (q) => q.eq("slug", service.slug))
        .unique();

      if (existing) {
        skipped += 1;
        continue;
      }

      if (!dryRun) {
        await ctx.db.insert("services", {
          ...service,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
      }

      inserted += 1;
    }

    const existingAutomationDefaults = await ctx.db
      .query("notificationAutomationSettings")
      .withIndex("by_scope", (q) => q.eq("scope", "default"))
      .unique();

    if (!existingAutomationDefaults) {
      if (!dryRun) {
        await ctx.db.insert("notificationAutomationSettings", {
          scope: "default",
          confirmationEnabled: true,
          confirmationSendImmediately: true,
          reminderOffsetsMinutes: [24 * 60, 2 * 60],
          noShowFollowUpEnabled: true,
          noShowFollowUpOffsetMinutes: 12 * 60,
          internalGapAlertEnabled: false,
          internalGapAlertThresholdMinutes: 6 * 60,
          updatedByUserId: undefined,
          createdAt: now,
          updatedAt: now,
        });
      }
      inserted += 1;
    } else {
      skipped += 1;
    }

    return {
      ok: true,
      dryRun,
      inserted,
      skipped,
      note: "Idempotent-friendly seed skeleton. Services + default notification automation settings are safe to rerun.",
    };
  },
});
