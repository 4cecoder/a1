"use server"

import {
  getNotificationAutomationSettings,
  renderNotificationTemplate,
  saveNotificationAutomationSettings,
} from "@/lib/notifications/templates"
import { scheduleNotification } from "@/lib/notifications/scheduler"
import {
  type NotificationActionResult,
  type NotificationAutomationSettings,
  type NotificationChannel,
  type NotificationEventType,
  type NotificationJob,
  type NotificationRecipient,
} from "@/lib/types/notifications"

export type SaveNotificationAutomationInput = NotificationAutomationSettings

export type NotificationPreviewInput = {
  templateId: string
  eventType: NotificationEventType
  channel: NotificationChannel
  recipient: NotificationRecipient
  context: Record<string, string>
  scheduledFor: string
  dedupeScope?: string
}

export type NotificationPreviewResult = {
  rendered: {
    subject?: string
    body: string
  }
  job: NotificationJob
  deduped: boolean
}

function validateCadence(input: NotificationAutomationSettings): string | null {
  if (input.cadence.reminder.some((item) => item.offsetMinutesBefore < 0)) {
    return "Reminder offsets must be non-negative."
  }

  if (input.cadence.noShowFollowUp.offsetMinutesAfter < 0) {
    return "No-show follow-up offset must be non-negative."
  }

  if (input.cadence.internalGapAlert.thresholdMinutesWithoutBooking < 0) {
    return "Gap alert threshold must be non-negative."
  }

  return null
}

export async function getNotificationAutomationSettingsAction(): Promise<
  NotificationActionResult<NotificationAutomationSettings>
> {
  return {
    ok: true,
    data: getNotificationAutomationSettings(),
  }
}

export async function saveNotificationAutomationSettingsAction(
  input: SaveNotificationAutomationInput
): Promise<NotificationActionResult<NotificationAutomationSettings>> {
  const cadenceError = validateCadence(input)

  if (cadenceError) {
    return { ok: false, error: cadenceError }
  }

  const duplicateTemplateIds = new Set<string>()
  for (const template of input.templates) {
    if (duplicateTemplateIds.has(template.id)) {
      return { ok: false, error: `Duplicate template id: ${template.id}` }
    }

    duplicateTemplateIds.add(template.id)
  }

  const saved = saveNotificationAutomationSettings(input)

  return {
    ok: true,
    data: saved,
    message: "Notification automation settings saved (stub).",
  }
}

export async function triggerNotificationPreviewSendAction(
  input: NotificationPreviewInput
): Promise<NotificationActionResult<NotificationPreviewResult>> {
  const settings = getNotificationAutomationSettings()
  const template = settings.templates.find((item) => item.id === input.templateId)

  if (!template) {
    return { ok: false, error: `Template ${input.templateId} not found` }
  }

  const rendered = renderNotificationTemplate(template, input.context)

  const scheduled = scheduleNotification({
    eventType: input.eventType,
    channel: input.channel,
    recipient: input.recipient,
    scheduledFor: input.scheduledFor,
    context: input.context,
    templateId: template.id,
    templateVersion: template.version,
    dedupeScope: input.dedupeScope,
    metadata: {
      mode: "preview",
    },
  })

  if (!scheduled.ok) {
    return { ok: false, error: scheduled.error }
  }

  return {
    ok: true,
    data: {
      rendered,
      job: scheduled.job,
      deduped: scheduled.deduped,
    },
    message: scheduled.deduped
      ? "Preview request deduped against an existing scheduled item."
      : "Preview notification scheduled (stub).",
  }
}
