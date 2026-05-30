import {
  type NotificationAutomationSettings,
  type NotificationTemplate,
  DEFAULT_NOTIFICATION_CADENCE,
} from "@/lib/types/notifications"

function nowIso(): string {
  return new Date().toISOString()
}

export const DEFAULT_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tpl-confirmation-sms-v1",
    eventType: "confirmation",
    channel: "sms",
    name: "Appointment confirmation (SMS)",
    body: "Hi {{firstName}}, your appointment for {{serviceName}} is confirmed for {{appointmentDateTime}}.",
    enabled: true,
    version: 1,
    updatedAt: nowIso(),
  },
  {
    id: "tpl-reminder-sms-v1",
    eventType: "reminder",
    channel: "sms",
    name: "Appointment reminder (SMS)",
    body: "Reminder: your {{serviceName}} appointment is at {{appointmentDateTime}}. Reply C to confirm.",
    enabled: true,
    version: 1,
    updatedAt: nowIso(),
  },
  {
    id: "tpl-no-show-follow-up-sms-v1",
    eventType: "no_show_follow_up",
    channel: "sms",
    name: "No-show follow-up (SMS)",
    body: "We missed you today, {{firstName}}. Rebook here: {{rebookUrl}}",
    enabled: true,
    version: 1,
    updatedAt: nowIso(),
  },
  {
    id: "tpl-internal-gap-alert-email-v1",
    eventType: "internal_gap_alert",
    channel: "internal",
    name: "Internal booking gap alert",
    subject: "Gap alert: {{gapMinutes}} minutes without booking",
    body: "No new booking has been recorded for {{gapMinutes}} minutes. Current date: {{today}}.",
    enabled: true,
    version: 1,
    updatedAt: nowIso(),
  },
]

let settingsStore: NotificationAutomationSettings = {
  cadence: DEFAULT_NOTIFICATION_CADENCE,
  templates: DEFAULT_NOTIFICATION_TEMPLATES,
  updatedAt: nowIso(),
}

export function getNotificationAutomationSettings(): NotificationAutomationSettings {
  return {
    cadence: {
      confirmation: { ...settingsStore.cadence.confirmation },
      reminder: settingsStore.cadence.reminder.map((item) => ({ ...item })),
      noShowFollowUp: { ...settingsStore.cadence.noShowFollowUp },
      internalGapAlert: { ...settingsStore.cadence.internalGapAlert },
    },
    templates: settingsStore.templates.map((tpl) => ({ ...tpl })),
    updatedAt: settingsStore.updatedAt,
  }
}

export function saveNotificationAutomationSettings(
  next: NotificationAutomationSettings
): NotificationAutomationSettings {
  settingsStore = {
    cadence: {
      confirmation: { ...next.cadence.confirmation },
      reminder: next.cadence.reminder.map((item) => ({ ...item })),
      noShowFollowUp: { ...next.cadence.noShowFollowUp },
      internalGapAlert: { ...next.cadence.internalGapAlert },
    },
    templates: next.templates.map((tpl) => ({ ...tpl })),
    updatedAt: nowIso(),
  }

  return getNotificationAutomationSettings()
}

export function renderNotificationTemplate(
  template: NotificationTemplate,
  variables: Record<string, string>
): { subject?: string; body: string } {
  const interpolate = (input: string) =>
    input.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => variables[key] ?? "")

  return {
    subject: template.subject ? interpolate(template.subject) : undefined,
    body: interpolate(template.body),
  }
}
