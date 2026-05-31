"use server"

import { api } from "@/convex/_generated/api"
import { runConvexMutation } from "@/lib/server-actions/convex-client"

export type SubmitBookingInput = {
  customerName: string
  phone?: string
  service: string
  startAt: number
  endAt: number
  staffUserId?: string
  notes?: string
}

export type BookingResult = {
  appointmentId: string
  confirmationCode: string
}

export type BookingActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string }

export async function submitBooking(
  input: SubmitBookingInput
): Promise<BookingActionResult<BookingResult>> {
  const customerName = input.customerName?.trim() ?? ""
  if (!customerName) {
    return { ok: false, error: "customerName is required" }
  }
  if (!input.service?.trim()) {
    return { ok: false, error: "service is required" }
  }
  if (!input.startAt || !input.endAt) {
    return { ok: false, error: "startAt and endAt are required" }
  }

  try {
    const data = await runConvexMutation(api.booking.createAppointment, {
      clientId: undefined as unknown as never,
      serviceId: input.service as unknown as never,
      staffUserId: input.staffUserId as unknown as never,
      startAt: input.startAt,
      endAt: input.endAt,
      customerName,
      source: "website",
      notes: input.notes,
    })
    const appt = data as { _id: string; confirmationCode?: string }
    return {
      ok: true,
      data: {
        appointmentId: appt._id ?? String(data),
        confirmationCode: appt.confirmationCode ?? `CONF-${Date.now()}`,
      },
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
