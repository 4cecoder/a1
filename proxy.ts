import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_ROUTE_PREFIX = "/admin"
const ADMIN_ACCESS_PATH = "/admin/access"

type AdminRole = "admin" | "staff" | "customer" | "guest"

const ALLOWED_ADMIN_ROLES = new Set<AdminRole>(["admin", "staff"])
const ROLE_HEADER_KEYS = ["x-user-role", "x-role", "x-admin-role", "x-admin-access-role"] as const
const ROLE_COOKIE_KEYS = ["a1_role", "role", "user_role", "admin_role"] as const

function normalizeRole(value: string | null | undefined): AdminRole {
  const normalized = value?.trim().toLowerCase()

  if (normalized === "admin" || normalized === "staff" || normalized === "customer") {
    return normalized
  }

  return "guest"
}

function readRole(request: NextRequest): AdminRole {
  for (const header of ROLE_HEADER_KEYS) {
    const value = request.headers.get(header)
    if (value) {
      return normalizeRole(value)
    }
  }

  for (const cookie of ROLE_COOKIE_KEYS) {
    const value = request.cookies.get(cookie)?.value
    if (value) {
      return normalizeRole(value)
    }
  }

  return "guest"
}

function isAllowedAdminRequest(request: NextRequest): boolean {
  const role = readRole(request)
  return ALLOWED_ADMIN_ROLES.has(role)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    return NextResponse.next()
  }

  if (pathname === ADMIN_ACCESS_PATH) {
    const headers = new Headers(request.headers)
    headers.set("x-admin-access-exempt", "1")

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }

  if (isAllowedAdminRequest(request)) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = ADMIN_ACCESS_PATH
  redirectUrl.search = ""

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ["/admin/:path*"],
}
