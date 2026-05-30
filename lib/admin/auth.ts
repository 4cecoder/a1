import { cookies, headers } from "next/headers";

export type AdminRole = "admin" | "staff" | "customer" | "guest";

export type AdminAccessContext = {
  role: AdminRole;
  canAccessAdmin: boolean;
};

const ALLOWED_ADMIN_ROLES: ReadonlySet<AdminRole> = new Set(["admin", "staff"]);

function normalizeRole(value: string | undefined): AdminRole {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "admin" || normalized === "staff" || normalized === "customer") {
    return normalized;
  }

  return "guest";
}

export async function getAdminAccessContext(): Promise<AdminAccessContext> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const role = normalizeRole(
    headerStore.get("x-user-role") ??
      headerStore.get("x-role") ??
      cookieStore.get("a1_role")?.value ??
      cookieStore.get("role")?.value ??
      cookieStore.get("user_role")?.value
  );

  return {
    role,
    canAccessAdmin: ALLOWED_ADMIN_ROLES.has(role),
  };
}
