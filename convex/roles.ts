import { ConvexError } from "convex/values";

export const ROLES = ["admin", "staff", "customer"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function assertRole(value: unknown): Role {
  if (!isRole(value)) {
    throw new ConvexError("Invalid role");
  }
  return value;
}

export function hasRole(userRole: Role | null | undefined, required: Role | readonly Role[]): boolean {
  if (!userRole) return false;
  const allowed = Array.isArray(required) ? required : [required];
  return allowed.includes(userRole);
}

export function assertHasRole(userRole: Role | null | undefined, required: Role | readonly Role[]): Role {
  if (!hasRole(userRole, required)) {
    throw new ConvexError("Forbidden");
  }
  return userRole as Role;
}

export const ADMIN_ONLY: readonly Role[] = ["admin"] as const;
export const STAFF_OR_ADMIN: readonly Role[] = ["staff", "admin"] as const;
export const ANY_AUTHENTICATED: readonly Role[] = ["customer", "staff", "admin"] as const;
