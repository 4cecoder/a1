"use client"

import { useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  saveNotificationAutomationSettingsAction,
  triggerNotificationPreviewSendAction,
} from "@/lib/server-actions/notifications/actions"
import {
  type NotificationAutomationSettings,
  type NotificationTemplate,
} from "@/lib/types/notifications"

type Props = {
  initialSettings: NotificationAutomationSettings
}

type SaveState = "idle" | "saving" | "saved" | "error"

type PreviewState = {
  status: "idle" | "sending" | "success" | "error"
  message?: string
  renderedBody?: string
  renderedSubject?: string
  deduped?: boolean
}

function parseTemplateContext(input: string): Record<string, string> {
  const context: Record<string, string> = {}

  for (const line of input.split("\n")) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (key) {
      context[key] = value
    }
  }

  return context
}

function toLocalDatetimeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const DEFAULT_SCHEDULED_FOR = toLocalDatetimeInputValue(new Date(Date.now() + 5 * 60 * 1000))

export default function AutomationForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState<NotificationAutomationSettings>(initialSettings)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveMessage, setSaveMessage] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialSettings.templates[0]?.id ?? ""
  )
  const [recipientId, setRecipientId] = useState("preview-recipient")
  const [recipientEmail, setRecipientEmail] = useState("preview@example.com")
  const [recipientPhone, setRecipientPhone] = useState("803-555-0100")
  const [scheduledFor, setScheduledFor] = useState<string>(DEFAULT_SCHEDULED_FOR)
  const [contextText, setContextText] = useState<string>(
    [
      "firstName=Jordan",
      "serviceName=Classic Cut",
      "appointmentDateTime=2026-06-01 10:00 AM",
      "rebookUrl=https://example.com/rebook",
      "gapMinutes=240",
      "today=2026-05-30",
    ].join("\n")
  )
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "idle" })

  const selectedTemplate = useMemo(
    () => settings.templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId, settings.templates]
  )

  function updateTemplate(templateId: string, updater: (template: NotificationTemplate) => NotificationTemplate) {
    setSettings((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...updater(template),
              updatedAt: new Date().toISOString(),
            }
          : template
      ),
    }))
  }

  function onSave() {
    setSaveState("saving")
    setSaveMessage("")

    startTransition(async () => {
      const result = await saveNotificationAutomationSettingsAction(settings)

      if (!result.ok) {
        setSaveState("error")
        setSaveMessage(result.error)
        return
      }

      setSettings(result.data)
      setSaveState("saved")
      setSaveMessage(result.message ?? "Saved")
    })
  }

  function onPreviewSend() {
    if (!selectedTemplate) {
      setPreviewState({ status: "error", message: "Select a template first." })
      return
    }

    setPreviewState({ status: "sending", message: "Scheduling preview..." })

    startTransition(async () => {
      const context = parseTemplateContext(contextText)

      const result = await triggerNotificationPreviewSendAction({
        templateId: selectedTemplate.id,
        eventType: selectedTemplate.eventType,
        channel: selectedTemplate.channel,
        recipient: {
          id: recipientId,
          email: recipientEmail,
          phone: recipientPhone,
          displayName: context.firstName ?? "Preview Recipient",
        },
        context,
        scheduledFor: new Date(scheduledFor).toISOString(),
        dedupeScope: "admin-preview",
      })

      if (!result.ok) {
        setPreviewState({ status: "error", message: result.error })
        return
      }

      setPreviewState({
        status: "success",
        message: result.message,
        renderedBody: result.data.rendered.body,
        renderedSubject: result.data.rendered.subject,
        deduped: result.data.deduped,
      })
    })
  }

  const busy = isPending || saveState === "saving" || previewState.status === "sending"

  return (
    <div className="grid gap-6">
      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Cadence</h2>
        <p className="mb-4 text-sm text-muted-foreground">Baseline timing configuration (mock persistence for now).</p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            Confirmation enabled
            <input
              type="checkbox"
              checked={settings.cadence.confirmation.enabled}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    confirmation: {
                      ...prev.cadence.confirmation,
                      enabled: event.target.checked,
                    },
                  },
                }))
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            Send confirmation immediately
            <input
              type="checkbox"
              checked={settings.cadence.confirmation.sendImmediately}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    confirmation: {
                      ...prev.cadence.confirmation,
                      sendImmediately: event.target.checked,
                    },
                  },
                }))
              }
            />
          </label>

          <label className="rounded-md border px-3 py-2 text-sm">
            Reminder #1 minutes before
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              type="number"
              min={0}
              value={settings.cadence.reminder[0]?.offsetMinutesBefore ?? 0}
              onChange={(event) => {
                const value = Math.max(0, Number(event.target.value) || 0)
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    reminder: prev.cadence.reminder.map((item, index) =>
                      index === 0 ? { ...item, offsetMinutesBefore: value } : item
                    ),
                  },
                }))
              }}
            />
          </label>

          <label className="rounded-md border px-3 py-2 text-sm">
            Reminder #2 minutes before
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              type="number"
              min={0}
              value={settings.cadence.reminder[1]?.offsetMinutesBefore ?? 0}
              onChange={(event) => {
                const value = Math.max(0, Number(event.target.value) || 0)
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    reminder: prev.cadence.reminder.map((item, index) =>
                      index === 1 ? { ...item, offsetMinutesBefore: value } : item
                    ),
                  },
                }))
              }}
            />
          </label>

          <label className="rounded-md border px-3 py-2 text-sm">
            No-show follow-up minutes after
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              type="number"
              min={0}
              value={settings.cadence.noShowFollowUp.offsetMinutesAfter}
              onChange={(event) => {
                const value = Math.max(0, Number(event.target.value) || 0)
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    noShowFollowUp: {
                      ...prev.cadence.noShowFollowUp,
                      offsetMinutesAfter: value,
                    },
                  },
                }))
              }}
            />
          </label>

          <label className="rounded-md border px-3 py-2 text-sm">
            Internal gap alert threshold (minutes)
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              type="number"
              min={0}
              value={settings.cadence.internalGapAlert.thresholdMinutesWithoutBooking}
              onChange={(event) => {
                const value = Math.max(0, Number(event.target.value) || 0)
                setSettings((prev) => ({
                  ...prev,
                  cadence: {
                    ...prev.cadence,
                    internalGapAlert: {
                      ...prev.cadence.internalGapAlert,
                      thresholdMinutesWithoutBooking: value,
                    },
                  },
                }))
              }}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="mb-4 text-base font-medium">Templates</h2>
        <div className="grid gap-4">
          {settings.templates.map((template) => (
            <article key={template.id} className="rounded-lg border p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                <strong>{template.name}</strong>
                <span className="rounded bg-muted px-2 py-0.5 text-xs">{template.eventType}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs">{template.channel}</span>
                <label className="ml-auto flex items-center gap-2 text-xs">
                  enabled
                  <input
                    type="checkbox"
                    checked={template.enabled}
                    onChange={(event) =>
                      updateTemplate(template.id, (current) => ({
                        ...current,
                        enabled: event.target.checked,
                      }))
                    }
                  />
                </label>
              </div>

              <input
                className="mb-2 h-8 w-full rounded border px-2 text-sm"
                value={template.name}
                onChange={(event) =>
                  updateTemplate(template.id, (current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />

              {template.subject ? (
                <input
                  className="mb-2 h-8 w-full rounded border px-2 text-sm"
                  value={template.subject}
                  onChange={(event) =>
                    updateTemplate(template.id, (current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                />
              ) : null}

              <textarea
                className="min-h-24 w-full rounded border p-2 text-sm"
                value={template.body}
                onChange={(event) =>
                  updateTemplate(template.id, (current) => ({
                    ...current,
                    body: event.target.value,
                  }))
                }
              />
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="mb-4 text-base font-medium">Preview send (stub)</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Template
            <select
              className="mt-1 h-8 w-full rounded border px-2"
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
            >
              {settings.templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Scheduled for
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              type="datetime-local"
              value={scheduledFor}
              onChange={(event) => setScheduledFor(event.target.value)}
            />
          </label>

          <label className="text-sm">
            Recipient ID
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              value={recipientId}
              onChange={(event) => setRecipientId(event.target.value)}
            />
          </label>

          <label className="text-sm">
            Recipient email
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              value={recipientEmail}
              onChange={(event) => setRecipientEmail(event.target.value)}
            />
          </label>

          <label className="text-sm md:col-span-2">
            Recipient phone
            <input
              className="mt-1 h-8 w-full rounded border px-2"
              value={recipientPhone}
              onChange={(event) => setRecipientPhone(event.target.value)}
            />
          </label>

          <label className="text-sm md:col-span-2">
            Template context (key=value per line)
            <textarea
              className="mt-1 min-h-24 w-full rounded border p-2"
              value={contextText}
              onChange={(event) => setContextText(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-3 flex gap-2">
          <Button type="button" variant="outline" onClick={onPreviewSend} disabled={busy || !selectedTemplateId}>
            {previewState.status === "sending" ? "Sending preview..." : "Send preview"}
          </Button>
        </div>

        {previewState.message ? (
          <p className={`mt-2 text-sm ${previewState.status === "error" ? "text-red-600" : "text-muted-foreground"}`}>
            {previewState.message}
            {previewState.deduped ? " (deduped)" : ""}
          </p>
        ) : null}

        {previewState.renderedSubject || previewState.renderedBody ? (
          <div className="mt-3 rounded-md border bg-muted/40 p-3 text-sm">
            {previewState.renderedSubject ? (
              <p>
                <strong>Rendered subject:</strong> {previewState.renderedSubject}
              </p>
            ) : null}
            {previewState.renderedBody ? (
              <p className="mt-2 whitespace-pre-wrap">
                <strong>Rendered body:</strong> {previewState.renderedBody}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <footer className="flex items-center gap-3">
        <Button type="button" onClick={onSave} disabled={busy}>
          {saveState === "saving" ? "Saving..." : "Save automation settings"}
        </Button>
        {saveMessage ? (
          <span className={`text-sm ${saveState === "error" ? "text-red-600" : "text-muted-foreground"}`}>
            {saveMessage}
          </span>
        ) : null}
      </footer>
    </div>
  )
}
