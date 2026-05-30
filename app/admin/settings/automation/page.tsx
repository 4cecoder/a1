import AutomationForm from "./components/AutomationForm"
import { getNotificationAutomationSettings } from "@/lib/notifications/templates"

export default function AdminAutomationSettingsPage() {
  const settings = getNotificationAutomationSettings()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Automation Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure notification cadence and message templates for confirmations, reminders, no-show follow-ups, and internal gap alerts.
        </p>
      </header>

      <AutomationForm initialSettings={settings} />
    </main>
  )
}
