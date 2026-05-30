"use server"

import { mockPaymentProvider } from "@/lib/services/payments/mock-provider"
import {
  type ActionResult,
  type CheckoutConfirmPayload,
  type CheckoutConfirmResponse,
  type CheckoutStartPayload,
  type CheckoutStartResponse,
  type PaymentReceipt,
} from "@/lib/types/payments"

import {
  validateCheckoutConfirmPayload,
  validateCheckoutStartPayload,
  validateReceiptId,
} from "./validation"

export async function startCheckout(
  payload: CheckoutStartPayload
): Promise<ActionResult<CheckoutStartResponse>> {
  const validation = validateCheckoutStartPayload(payload)

  if (!validation.ok) {
    return validation
  }

  const normalized = validation.data

  const intentResult = await mockPaymentProvider.createIntent({
    amountCents: normalized.amountCents,
    currency: normalized.currency,
    paymentMethodToken: normalized.paymentMethodToken,
    customerName: normalized.customerName,
    customerEmail: normalized.customerEmail,
    serviceName: normalized.serviceName,
    simulation: normalized.simulation,
    metadata: {
      ...normalized.metadata,
      customerName: normalized.customerName,
      customerEmail: normalized.customerEmail,
      serviceName: normalized.serviceName,
    },
  })

  if (!intentResult.ok) {
    return intentResult
  }

  return {
    ok: true,
    data: { intent: intentResult.data },
    message: intentResult.message,
  }
}

export async function confirmCheckout(
  payload: CheckoutConfirmPayload
): Promise<ActionResult<CheckoutConfirmResponse>> {
  const validation = validateCheckoutConfirmPayload(payload)

  if (!validation.ok) {
    return validation
  }

  return mockPaymentProvider.captureIntent(validation.data)
}

export async function fetchReceipt(receiptId: string): Promise<ActionResult<PaymentReceipt>> {
  const validation = validateReceiptId(receiptId)

  if (!validation.ok) {
    return validation
  }

  return mockPaymentProvider.getReceipt(validation.data)
}
