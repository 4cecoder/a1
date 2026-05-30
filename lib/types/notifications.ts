export const NOTIFICATION_EVENT_TYPES = [
  "confirmation",
  "reminder",
  "no_show_follow_up",
  "internal_gap_alert",
] as const

export type NotificationEventType = (typeof NOTIFICATION_EVENT_TYPES)[number]

export const NOTIFICATION_CHANNELS = ["sms", "email", "internal"] as const

export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]

export type NotificationTemplate = {
  id: string
  eventType: NotificationEventType
  channel: NotificationChannel
  name: string
  subject?: string
  body: string
  enabled: boolean
  version: number
  updatedAt: string
}

export type ReminderCadence = {
  enabled: boolean
  offsetMinutesBefore: number
}

export type FollowUpCadence = {
  enabled: boolean
  offsetMinutesAfter: number
}

export type InternalGapAlertCadence = {
  enabled: boolean
  thresholdMinutesWithoutBooking: number
}

export type NotificationCadenceSettings = {
  confirmation: {
    enabled: boolean
    sendImmediately: boolean
  }
  reminder: ReminderCadence[]
  noShowFollowUp: FollowUpCadence
  internalGapAlert: InternalGapAlertCadence
}

export type NotificationAutomationSettings = {
  cadence: NotificationCadenceSettings
  templates: NotificationTemplate[]
  updatedAt: string
}

export type NotificationRecipient = {
  id: string
  displayName?: string
  email?: string
  phone?: string
}

export type NotificationScheduleRequest = {
  eventType: NotificationEventType
  channel: NotificationChannel
  recipient: NotificationRecipient
  scheduledFor: string
  context: Record<string, string>
  templateId: string
  templateVersion: number
  dedupeScope?: string
  metadata?: Record<string, string>
}

export type NotificationJob = NotificationScheduleRequest & {
  id: string
  dedupeKey: string
  status: "scheduled" | "sent" | "cancelled"
  createdAt: string
}

export type ScheduleNotificationResult =
  | { ok: true; deduped: false; job: NotificationJob }
  | { ok: true; deduped: true; job: NotificationJob }
  | { ok: false; error: string }

export type NotificationActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string }

export const DEFAULT_NOTIFICATION_CADENCE: NotificationCadenceSettings = {
  confirmation: {
    enabled: true,
    sendImmediately: true,
  },
  reminder: [
    { enabled: true, offsetMinutesBefore: 24 * 60 },
    { enabled: true, offsetMinutesBefore: 2 * 60 },
  ],
  noShowFollowUp: {
    enabled: true,
    offsetMinutesAfter: 12 * 60,
  },
  internalGapAlert: {
    enabled: false,
    thresholdMinutesWithoutBooking: 6 * 60,
  },
}
