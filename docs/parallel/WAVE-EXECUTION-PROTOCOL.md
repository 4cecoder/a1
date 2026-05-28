# A1 Cuts wave protocol

## Wave order
1. Wave A (foundation sequential)
   - layout shell
   - home structure
2. Wave B (parallel)
   - navbar polish
   - UI primitives polish
   - e2e alignment
3. Wave C (integration sequential)
   - resolve patch requests
   - run full gates

## Small commit rule
- 1 concern per commit
- Prefer 1 to 5 files per commit
- Commit message: `<lane>: <scope>`

## Required gates
- `bun run build`
- `bun run lint`
- `bun run test:e2e`

## Pre-commit boundary check
- Stage files
- Run `bun run check:lanes`
- If blocked, unstage and file patch request
