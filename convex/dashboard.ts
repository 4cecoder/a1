import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { type Role, assertHasRole, STAFF_OR_ADMIN } from "./roles";

async function getAuthenticatedUserWithRole(ctx: QueryCtx) {
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

export const getDashboardKpis = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUserWithRole(ctx);

    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // All appointments
    const allAppointments = await ctx.db.query("appointments").withIndex("by_start").collect();

    // Today's revenue: completed appointments today
    const todayRevenueCents = allAppointments
      .filter(
        (a) =>
          a.status === "completed" &&
          a.startAt >= startOfToday.getTime() &&
          a.startAt <= endOfToday.getTime()
      )
      .reduce((sum, a) => sum + (a.priceCents ?? 0), 0);

    // Upcoming appointments (scheduled/confirmed, future)
    const upcomingAppointments = allAppointments.filter(
      (a) =>
        (a.status === "scheduled" || a.status === "confirmed") &&
        a.startAt > now
    ).length;

    // Active clients
    const activeClients = await ctx.db
      .query("clients")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // New leads this week
    const newLeadsThisWeek = await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();

    // Recent appointments (last 10, by start desc)
    const recentAppointments = allAppointments
      .sort((a, b) => b.startAt - a.startAt)
      .slice(0, 10);

    // Enrich with client + service names
    const enriched = await Promise.all(
      recentAppointments.map(async (appt) => {
        const [client, service] = await Promise.all([
          ctx.db.get(appt.clientId),
          ctx.db.get(appt.serviceId),
        ]);
        return {
          ...appt,
          clientName: client?.fullName ?? appt.customerName ?? "Unknown",
          serviceName: service?.name ?? "Unknown",
        };
      })
    );

    return {
      todayRevenueCents,
      upcomingAppointments,
      activeClients: activeClients.length,
      newLeadsThisWeek: newLeadsThisWeek.length,
      recentAppointments: enriched,
    };
  },
});

export const getNewLeadsCount = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUserWithRole(ctx);
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return leads.length;
  },
});

export const getReportsData = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUserWithRole(ctx);

    const allAppointments = await ctx.db.query("appointments").withIndex("by_start").collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recent = allAppointments.filter((a) => a.startAt >= thirtyDaysAgo);

    // Revenue by day (last 30 days)
    const revenueByDay: Record<string, number> = {};
    for (const appt of recent) {
      if (appt.status !== "completed") continue;
      const d = new Date(appt.startAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      revenueByDay[key] = (revenueByDay[key] ?? 0) + (appt.priceCents ?? 0);
    }

    // Top services by booking count
    const serviceCount: Record<string, number> = {};
    for (const appt of recent) {
      const key = String(appt.serviceId);
      serviceCount[key] = (serviceCount[key] ?? 0) + 1;
    }

    const serviceIds = Object.keys(serviceCount);
    const serviceNames: Record<string, string> = {};
    for (const sid of serviceIds) {
      try {
        const svc = await ctx.db.get(sid as any);
        serviceNames[sid] = (svc as any)?.name ?? "Unknown";
      } catch {
        serviceNames[sid] = "Unknown";
      }
    }

    const topServices = Object.entries(serviceCount)
      .map(([id, count]) => ({ name: serviceNames[id] ?? "Unknown", count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Busiest day of week
    const dowCounts = [0, 0, 0, 0, 0, 0, 0];
    for (const appt of recent) {
      const dow = new Date(appt.startAt).getDay();
      dowCounts[dow]++;
    }

    return { revenueByDay, topServices, dowCounts };
  },
});

// Public booking: create appointment without auth (for public book page)
