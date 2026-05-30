import {
  type ActionResult,
  type CheckoutConfirmPayload,
  type CheckoutStartPayload,
} from "@/lib/types/payments"

function fail(message: string, code: "validation_error" = "validation_error"): ActionResult<never> {
  return {
    ok: false,
    error: message,
    code,
  }
}

export function validateCheckoutStartPayload(
  payload: CheckoutStartPayload
): ActionResult<CheckoutStartPayload> {
  if (!payload || typeof payload !== "object") {
    return fail("Checkout start payload is required")
  }

  if (!Number.isInteger(payload.amountCents) || payload.amountCents <= 0) {
    return fail("amountCents must be a positive integer")
  }

  if (payload.currency !== "USD") {
    return fail("currency must be USD")
  }

  if (!payload.paymentMethodToken?.trim()) {
    return fail("paymentMethodToken is required")
  }

  if (!payload.customerName?.trim()) {
    return fail("customerName is required")
  }

  if (!payload.customerEmail?.trim() || !payload.customerEmail.includes("@")) {
    return fail("customerEmail must be a valid email")
  }

  if (!payload.serviceName?.trim()) {
    return fail("serviceName is required")
  }

  if (
    payload.simulation &&
    payload.simulation !== "none" &&
    payload.simulation !== "intent_failure" &&
    payload.simulation !== "capture_failure"
  ) {
    return fail("simulation mode is invalid")
  }

  return {
    ok: true,
    data: {
      ...payload,
      paymentMethodToken: payload.paymentMethodToken.trim(),
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim().toLowerCase(),
      serviceName: payload.serviceName.trim(),
      simulation: payload.simulation ?? "none",
      metadata: payload.metadata ?? {},
    },
  }
}

export function validateCheckoutConfirmPayload(
  payload: CheckoutConfirmPayload
): ActionResult<CheckoutConfirmPayload> {
  if (!payload || typeof payload !== "object") {
    return fail("Checkout confirm payload is required")
  }

  if (!payload.intentId?.trim()) {
    return fail("intentId is required")
  }

  if (
    payload.simulation &&
    payload.simulation !== "none" &&
    payload.simulation !== "intent_failure" &&
    payload.simulation !== "capture_failure"
  ) {
    return fail("simulation mode is invalid")
  }

  return {
    ok: true,
    data: {
      intentId: payload.intentId.trim(),
      simulation: payload.simulation ?? "none",
    },
  }
}

export function validateReceiptId(receiptId: string): ActionResult<string> {
  if (!receiptId?.trim()) {
    return fail("receiptId is required")
  }

  return {
    ok: true,
    data: receiptId.trim(),
  }
}
