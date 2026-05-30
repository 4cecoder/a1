## Convex backend foundation (Wave 1 / Lane B)

This directory now includes live backend modules for A1 admin + booking flows:

- `schema.ts`:
  - users and roles
  - CRM data (`leads`, expanded `clients`)
  - booking + checkout persistence (`appointments`, expanded `payments`)
  - notification automation + job logging (`notificationAutomationSettings`, `notificationJobs`)
- `roles.ts`: role constants/types and guard helpers (`admin`, `staff`, `customer`)
- `users.ts`: user helpers (`current`, `getCurrentUser`, `getMyRole`, `upsertFromIdentity`)
- `crm.ts`: lead/client lifecycle functions for admin CRM actions
- `booking.ts`: appointment creation + querying with basic conflict checks
- `notifications.ts`: automation settings load/save + notification job enqueueing
- `seed.ts`: idempotent seed for services plus default notification automation settings
- `auth.ts`: `@convex-dev/auth` `convexAuth` bootstrap
- `tsconfig.json`: strict TS config scoped to `convex/`

### Role enforcement

Admin/staff checks are enforced in CRM, booking, and notification module operations intended for admin-side mutation/query usage.

### Notes

- Auth providers are intentionally left empty in `auth.ts` to avoid coupling with provider-specific setup handled in a different lane.
- Domain tables include `createdAt` and `updatedAt` timestamps for auditability and automation sequencing.
- Notification settings are scoped (default scope key: `default`) so future per-location/per-tenant settings can be layered in.
