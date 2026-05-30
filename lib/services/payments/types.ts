import type {
  ActionResult,
  CapturePaymentIntentInput,
  CheckoutConfirmResponse,
  CreatePaymentIntentInput,
  PaymentReceipt,
  PaymentIntent,
} from "@/lib/types/payments"

export const PAYMENT_PROVIDER_NAMES = ["mock"] as const

export type PaymentProviderName = (typeof PAYMENT_PROVIDER_NAMES)[number]

export interface PaymentProvider {
  createIntent(input: CreatePaymentIntentInput): Promise<ActionResult<PaymentIntent>>
  captureIntent(input: CapturePaymentIntentInput): Promise<ActionResult<CheckoutConfirmResponse>>
  getReceipt(receiptId: string): Promise<ActionResult<PaymentReceipt>>
}
