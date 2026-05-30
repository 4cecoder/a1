import Link from "next/link"

import { fetchReceipt } from "@/lib/server-actions/checkout/actions"

type ParamsInput = Promise<{ id?: string }> | { id?: string }

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function formatTimestamp(input: string): string {
  const date = new Date(input)

  if (Number.isNaN(date.getTime())) {
    return "Unknown issue time"
  }

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function ReceiptPage({ params }: { params: ParamsInput }) {
  const resolvedParams = await params
  const receiptId = resolvedParams?.id?.trim()

  if (!receiptId) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">Receipt unavailable</h1>
        <p className="text-sm text-muted-foreground">A receipt ID is required to view this page.</p>
        <Link href="/" className="text-sm underline">
          Return home
        </Link>
      </main>
    )
  }

  const receiptResult = await fetchReceipt(receiptId)

  if (!receiptResult.ok) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">Receipt not found</h1>
        <p className="text-sm text-muted-foreground">{receiptResult.error}</p>
        <p className="text-xs text-muted-foreground">Reference: {receiptResult.code}</p>
        <Link href="/" className="text-sm underline">
          Return home
        </Link>
      </main>
    )
  }

  const receipt = receiptResult.data

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Payment receipt</h1>
        <p className="text-sm text-muted-foreground">Receipt ID: {receipt.id}</p>
      </header>

      <section className="rounded-lg border p-4">
        <p className="text-sm">Status: {receipt.status}</p>
        <p className="text-sm">Service: {receipt.serviceName}</p>
        <p className="text-sm">Customer: {receipt.customerName}</p>
        <p className="text-sm">Email: {receipt.customerEmail}</p>
        <p className="text-sm">Issued: {formatTimestamp(receipt.issuedAt)}</p>
        <p className="text-sm">Total: {formatCurrency(receipt.amountCents, receipt.currency)}</p>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-base font-medium">Line items</h2>
        {receipt.lineItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No line items were provided.</p>
        ) : (
          <ul className="space-y-2">
            {receipt.lineItems.map((line) => (
              <li key={line.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {line.label} × {line.quantity}
                </span>
                <span>{formatCurrency(line.totalAmountCents, receipt.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {receipt.notes ? <p className="text-sm text-muted-foreground">Note: {receipt.notes}</p> : null}

      <div className="flex gap-4">
        <Link href="/" className="text-sm underline">
          Return home
        </Link>
      </div>
    </main>
  )
}
