import { mockPaymentProvider } from "@/lib/services/payments/mock-provider"
import {
  PAYMENT_PROVIDER_NAMES,
  type PaymentProvider,
  type PaymentProviderName,
} from "@/lib/services/payments/types"

const DEFAULT_PAYMENT_PROVIDER: PaymentProviderName = "mock"

function normalizeProviderName(value: string | undefined): PaymentProviderName {
  const candidate = value?.trim().toLowerCase()

  if (!candidate) {
    return DEFAULT_PAYMENT_PROVIDER
  }

  if ((PAYMENT_PROVIDER_NAMES as readonly string[]).includes(candidate)) {
    return candidate as PaymentProviderName
  }

  return DEFAULT_PAYMENT_PROVIDER
}

export function resolvePaymentProviderName(): PaymentProviderName {
  return normalizeProviderName(process.env.PAYMENT_PROVIDER)
}

export function getPaymentProvider(name = resolvePaymentProviderName()): PaymentProvider {
  switch (name) {
    case "mock":
      return mockPaymentProvider
    default:
      return mockPaymentProvider
  }
}
