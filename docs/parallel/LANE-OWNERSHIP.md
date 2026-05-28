# A1 Cuts parallel lane ownership

Purpose: allow multiple subagents to work on the same branch without collisions.

## Lane map
- lane-layout-shell
  - Owns: `app/layout.tsx`, `app/globals.css`
- lane-navbar
  - Owns: `app/components/Navbar.tsx`
- lane-home-sections
  - Owns: `app/page.tsx`
- lane-ui-primitives
  - Owns: `components/ui/**`, `lib/utils.ts`
- lane-e2e
  - Owns: `tests/e2e/**`, `playwright.config.ts`

## Shared paths (allowed)
- `docs/**`
- `tools/**`
- `package.json`
- `bun.lock`
- `.gitignore`

## Single-writer rule
If your lane does not own a file, do not edit it directly.
Return a patch request in handoff for owner-lane application.

## Handoff format
```json
{
  "lane": "lane-e2e",
  "status": "completed|partial|blocked",
  "files_changed": ["..."],
  "commands_run": ["bun run build", "bun run test:e2e"],
  "results": [{"command": "bun run test:e2e", "outcome": "pass|fail", "details": "..."}],
  "patch_requests": [{"target_file": "app/page.tsx", "owner_lane": "lane-home-sections", "reason": "...", "proposed_patch": "...", "blocking": true}]
}
```
