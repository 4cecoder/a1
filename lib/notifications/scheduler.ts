import {
  type NotificationJob,
  type NotificationScheduleRequest,
  type ScheduleNotificationResult,
} from "@/lib/types/notifications"

const scheduledJobs = new Map<string, NotificationJob>()

function hashSeed(input: string): string {
  let hash = 5381

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index)
  }

  return (hash >>> 0).toString(16).padStart(8, "0")
}

export function buildNotificationDedupeKey(input: NotificationScheduleRequest): string {
  const scope = input.dedupeScope?.trim() || "global"
  const recipientId = input.recipient.id.trim().toLowerCase()

  const parts = [
    input.eventType,
    input.channel,
    recipientId,
    input.scheduledFor,
    input.templateId,
    String(input.templateVersion),
    scope,
  ]

  return `notif:${hashSeed(parts.join("|"))}`
}

export function scheduleNotification(
  request: NotificationScheduleRequest
): ScheduleNotificationResult {
  if (!request.recipient.id.trim()) {
    return { ok: false, error: "recipient.id is required" }
  }

  const dedupeKey = buildNotificationDedupeKey(request)
  const existing = scheduledJobs.get(dedupeKey)

  if (existing) {
    return { ok: true, deduped: true, job: existing }
  }

  const now = new Date().toISOString()
  const job: NotificationJob = {
    ...request,
    id: `job-${dedupeKey.slice(-8)}-${Date.now()}`,
    dedupeKey,
    status: "scheduled",
    createdAt: now,
  }

  scheduledJobs.set(dedupeKey, job)

  return { ok: true, deduped: false, job }
}

export function listScheduledNotifications(): NotificationJob[] {
  return Array.from(scheduledJobs.values()).sort((a, b) =>
    a.scheduledFor.localeCompare(b.scheduledFor)
  )
}

export function clearScheduledNotifications(): void {
  scheduledJobs.clear()
}
