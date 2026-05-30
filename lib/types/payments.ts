export const PAYMENT_INTENT_STATUSES = [
  "requires_capture",
  "succeeded",
  "failed",
  "canceled",
] as const

export type PaymentIntentStatus = (typeof PAYMENT_INTENT_STATUSES)[number]

export type PaymentCurrency = "USD"

export type PaymentFailureCode =
  | "invalid_request"
  | "intent_not_found"
  | "intent_failed"
  | "capture_failed"
  | "already_captured"

export type CheckoutSimulationMode = "none" | "intent_failure" | "capture_failure"

export type PaymentLineItem = {
  id: string
  label: string
  quantity: number
  unitAmountCents: number
  totalAmountCents: number
}

export type PaymentIntent = {
  id: string
  amountCents: number
  currency: PaymentCurrency
  status: PaymentIntentStatus
  paymentMethodToken: string
  createdAt: string
  capturedAt?: string
  failedAt?: string
  failureCode?: PaymentFailureCode
  failureMessage?: string
  metadata: Record<string, string>
}

export type PaymentReceipt = {
  id: string
  intentId: string
  amountCents: number
  currency: PaymentCurrency
  status: Extract<PaymentIntentStatus, "succeeded" | "failed">
  customerName: string
  customerEmail: string
  serviceName: string
  issuedAt: string
  lineItems: PaymentLineItem[]
  notes?: string
}

export type CreatePaymentIntentInput = {
  amountCents: number
  currency: PaymentCurrency
  paymentMethodToken: string
  customerName: string
  customerEmail: string
  serviceName: string
  metadata?: Record<string, string>
  simulation?: CheckoutSimulationMode
}

export type CapturePaymentIntentInput = {
  intentId: string
  simulation?: CheckoutSimulationMode
}

export type CheckoutStartPayload = {
  amountCents: number
  currency: PaymentCurrency
  paymentMethodToken: string
  customerName: string
  customerEmail: string
  serviceName: string
  metadata?: Record<string, string>
  simulation?: CheckoutSimulationMode
}

export type CheckoutConfirmPayload = {
  intentId: string
  simulation?: CheckoutSimulationMode
}

export type CheckoutStartResponse = {
  intent: PaymentIntent
}

export type CheckoutConfirmResponse = {
  intent: PaymentIntent
  receipt: PaymentReceipt
}

export type ActionErrorCode =
  | PaymentFailureCode
  | "validation_error"
  | "receipt_not_found"
  | "unknown_error"

export type ActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; code: ActionErrorCode }

export interface PaymentProvider {
  createIntent(input: CreatePaymentIntentInput): Promise<ActionResult<PaymentIntent>>
  captureIntent(input: CapturePaymentIntentInput): Promise<ActionResult<CheckoutConfirmResponse>>
  getReceipt(receiptId: string): Promise<ActionResult<PaymentReceipt>>
}
