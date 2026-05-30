## Convex backend foundation (Wave 1 / Lane B)

This directory adds the initial Convex backend structure for A1:

- `schema.ts`: users + core business tables (`clients`, `services`, `appointments`, `payments`)
- `auth.ts`: `@convex-dev/auth` `convexAuth` bootstrap
- `roles.ts`: role constants/types and guard helpers (`admin`, `staff`, `customer`)
- `users.ts`: user helpers (`current`, `upsertFromIdentity`)
- `seed.ts`: idempotent-friendly seed mutation skeleton
- `tsconfig.json`: strict TS config scoped to `convex/`

### Notes

- Auth providers are intentionally left empty in `auth.ts` in this lane to avoid coupling with provider-specific setup handled elsewhere.
- Seed mutation is designed to be rerun safely by checking `services.by_slug` before insert.
- All domain tables include `createdAt` and `updatedAt` timestamps for future auditing.

### Next steps (outside this lane)

- Install/configure Convex runtime + `@convex-dev/auth` providers.
- Generate Convex `_generated` types and switch function wrappers to generated helpers where desired.
- Wire frontend auth/session flow and enforce role checks in mutations/queries.
