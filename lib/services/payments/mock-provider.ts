import {
  type ActionResult,
  type CapturePaymentIntentInput,
  type CheckoutConfirmResponse,
  type CreatePaymentIntentInput,
  type PaymentIntent,
  type PaymentProvider,
  type PaymentReceipt,
} from "@/lib/types/payments"

const intentStore = new Map<string, PaymentIntent>()
const receiptStore = new Map<string, PaymentReceipt>()

function buildIntentId(): string {
  return `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function buildReceiptId(): string {
  return `rcpt_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function applyIntentFailure(intent: PaymentIntent): PaymentIntent {
  return {
    ...intent,
    status: "failed",
    failedAt: new Date().toISOString(),
    failureCode: "intent_failed",
    failureMessage: "Payment provider rejected intent during authorization.",
  }
}

function applyCaptureFailure(intent: PaymentIntent): PaymentIntent {
  return {
    ...intent,
    status: "failed",
    failedAt: new Date().toISOString(),
    failureCode: "capture_failed",
    failureMessage: "Payment capture failed at settlement time.",
  }
}

export const mockPaymentProvider: PaymentProvider = {
  async createIntent(input: CreatePaymentIntentInput): Promise<ActionResult<PaymentIntent>> {
    const metadata = input.metadata ?? {}

    const baseIntent: PaymentIntent = {
      id: buildIntentId(),
      amountCents: input.amountCents,
      currency: input.currency,
      status: "requires_capture",
      paymentMethodToken: input.paymentMethodToken,
      createdAt: new Date().toISOString(),
      metadata,
    }

    const intent = input.simulation === "intent_failure" ? applyIntentFailure(baseIntent) : baseIntent

    intentStore.set(intent.id, intent)

    if (intent.status === "failed") {
      return {
        ok: false,
        error: intent.failureMessage ?? "Failed to create payment intent",
        code: intent.failureCode ?? "intent_failed",
      }
    }

    return {
      ok: true,
      data: intent,
      message: "Mock payment intent created",
    }
  },

  async captureIntent(
    input: CapturePaymentIntentInput
  ): Promise<ActionResult<CheckoutConfirmResponse>> {
    const existingIntent = intentStore.get(input.intentId)

    if (!existingIntent) {
      return { ok: false, error: `Payment intent ${input.intentId} not found`, code: "intent_not_found" }
    }

    if (existingIntent.status === "succeeded") {
      return {
        ok: false,
        error: "Payment intent already captured",
        code: "already_captured",
      }
    }

    if (existingIntent.status === "failed" || existingIntent.status === "canceled") {
      return {
        ok: false,
        error: existingIntent.failureMessage ?? "Payment intent cannot be captured",
        code: existingIntent.failureCode ?? "intent_failed",
      }
    }

    const updatedIntent =
      input.simulation === "capture_failure"
        ? applyCaptureFailure(existingIntent)
        : {
            ...existingIntent,
            status: "succeeded" as const,
            capturedAt: new Date().toISOString(),
          }

    intentStore.set(updatedIntent.id, updatedIntent)

    const receipt: PaymentReceipt = {
      id: buildReceiptId(),
      intentId: updatedIntent.id,
      amountCents: updatedIntent.amountCents,
      currency: updatedIntent.currency,
      status: updatedIntent.status === "succeeded" ? "succeeded" : "failed",
      customerName: updatedIntent.metadata.customerName ?? "Guest Customer",
      customerEmail: updatedIntent.metadata.customerEmail ?? "unknown@example.com",
      serviceName: updatedIntent.metadata.serviceName ?? "Service",
      issuedAt: new Date().toISOString(),
      lineItems: [
        {
          id: "service-line-1",
          label: updatedIntent.metadata.serviceName ?? "Service",
          quantity: 1,
          unitAmountCents: updatedIntent.amountCents,
          totalAmountCents: updatedIntent.amountCents,
        },
      ],
      notes:
        updatedIntent.status === "succeeded"
          ? "Paid in full via mock provider."
          : updatedIntent.failureMessage ?? "Payment failed.",
    }

    receiptStore.set(receipt.id, receipt)

    if (updatedIntent.status !== "succeeded") {
      return {
        ok: false,
        error: updatedIntent.failureMessage ?? "Failed to capture payment intent",
        code: updatedIntent.failureCode ?? "capture_failed",
      }
    }

    return {
      ok: true,
      data: {
        intent: updatedIntent,
        receipt,
      },
      message: "Mock payment captured",
    }
  },

  async getReceipt(receiptId: string): Promise<ActionResult<PaymentReceipt>> {
    const receipt = receiptStore.get(receiptId)

    if (!receipt) {
      return {
        ok: false,
        error: `Receipt ${receiptId} not found`,
        code: "receipt_not_found",
      }
    }

    return {
      ok: true,
      data: receipt,
      message: "Mock receipt fetched",
    }
  },
}
