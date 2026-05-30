import { cookies, headers } from "next/headers";

export type AdminRole = "admin" | "staff" | "customer" | "guest";

export type AdminAccessContext = {
  role: AdminRole;
  canAccessAdmin: boolean;
};

const ALLOWED_ADMIN_ROLES: ReadonlySet<AdminRole> = new Set(["admin", "staff"]);
const ROLE_HEADER_KEYS = ["x-user-role", "x-role", "x-admin-role", "x-admin-access-role"] as const;
const ROLE_COOKIE_KEYS = ["a1_role", "role", "user_role", "admin_role"] as const;

function normalizeRole(value: string | undefined): AdminRole {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "admin" || normalized === "staff" || normalized === "customer") {
    return normalized;
  }

  return "guest";
}

function readRoleFromHeaderStore(headerStore: Headers): string | undefined {
  for (const key of ROLE_HEADER_KEYS) {
    const value = headerStore.get(key);
    if (value) {
      return value;
    }
  }

  return undefined;
}

function readRoleFromCookieStore(cookieStore: Awaited<ReturnType<typeof cookies>>): string | undefined {
  for (const key of ROLE_COOKIE_KEYS) {
    const value = cookieStore.get(key)?.value;
    if (value) {
      return value;
    }
  }

  return undefined;
}

export async function getAdminAccessContext(): Promise<AdminAccessContext> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const isAdminAccessExempt = headerStore.get("x-admin-access-exempt") === "1";

  const role = normalizeRole(readRoleFromHeaderStore(headerStore) ?? readRoleFromCookieStore(cookieStore));

  return {
    role,
    canAccessAdmin: isAdminAccessExempt || ALLOWED_ADMIN_ROLES.has(role),
  };
}
