import Link from "next/link"

export default function AdminAccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center p-6">
      <section className="w-full rounded-xl border p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Access restricted</p>
        <h1 className="text-2xl font-semibold">You do not have admin access.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The admin area is available to users with role `admin` or `staff`. If this is unexpected, contact an
          administrator.
        </p>

        <div className="mt-5 flex gap-3">
          <Link href="/" className="inline-flex h-9 items-center rounded-md border px-3 text-sm">
            Return home
          </Link>
          <Link href="/admin" className="inline-flex h-9 items-center rounded-md border px-3 text-sm">
            Try admin again
          </Link>
        </div>
      </section>
    </main>
  )
}
