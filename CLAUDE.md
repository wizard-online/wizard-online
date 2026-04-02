# Wizard Online — Claude Code Context

## Project summary
Online multiplayer implementation of the Wizard card game (trick-taking, 3–6 players).
- **Frontend:** React 18 + MUI v7 + React Router v6 + styled-components
- **Game framework:** boardgame.io 0.41.0 (client: `boardgame.io/react`, server: `boardgame.io/server`)
- **Backend:** Node.js server with PostgreSQL via `bgio-postgres` (optional — falls back to in-memory)
- **Build:** Vite 6 (frontend bundler + dev server) + tsc (server build) + TypeScript 5.x
- **Package manager:** pnpm

## Key commands
```bash
pnpm test                   # run unit tests
pnpm test:coverage          # run tests with coverage report
pnpm run type-check         # TypeScript type check (no emit)
pnpm run lint               # ESLint + Stylelint
pnpm run build:app          # build frontend to dist/app/
pnpm run build:server       # build server to dist/server/
```

## Test setup
- Framework: Jest 29 + ts-jest 29 + @testing-library/react 14 + @testing-library/jest-dom 6
- `pnpm test` runs unit tests (ts-jest); `pnpm test:scenario` runs the integration test (babel-jest)
- **`src/test/scenario.test.tsx`** runs via `jest.scenario.config.js` (separate from unit tests — long-running, ~60s)
- Active unit tests live in `src/shared/` and `src/app/ui/services/`
- Scenario test is excluded from `jest.config.js` via `testPathIgnorePatterns` (intentional — kept separate)

## Dependency upgrade plan

### Status
| Phase | Goal | Status |
|-------|------|--------|
| 0 | Re-enable scenario.test.tsx, establish test baseline | **DONE** |
| 1 | Remove legacy `babel-preset-env`, update `@babel/*` packages | **DONE** |
| 2 | Jest 25→29, ts-jest, babel-jest, @testing-library stack | **DONE** |
| 3 | dotenv 8→16, date-fns 2→4, remove unused redux, sentry 5→8 | **DONE** |
| 4 | React 16→18, MUI v4→v7, react-router-dom v5→v6, react-ga→react-ga4 | **DONE** |
| 5 | boardgame.io 0.41→0.50 (highest risk — do last) | **DONE** |
| 6 | Parcel 1→Vite (frontend), tsc (server) | **DONE** |

### Constraints
- All phases (0–6) are complete — dependency upgrade project is finished
- boardgame.io 0.50.2 uses new callback signatures: `({ G, ctx, events, random, ... }, ...args)` instead of `(G, ctx, ...args)`

### Security vulnerabilities (as of 2026-03-29)
187 total: **20 critical, 80 high**, 69 moderate, 18 low.
Root causes:
- `sequelize` via `bgio-postgres` — 3 critical SQL injection CVEs (fixed by Phase 5 or bgio-postgres update)
- `xmlhttprequest-ssl` via `boardgame.io` socket.io-client — 2 critical CVEs (fixed by Phase 5)
- ~~`@babel/traverse` via `parcel-bundler` — critical RCE (fixed in Phase 6 — Parcel removed, migrated to Vite)~~
- ~~`@babel/traverse` via `@babel/core` — critical RCE (fixed in Phase 1)~~
- ~~`babel-traverse` via legacy `babel-preset-env` v1.7 — critical RCE (fixed in Phase 1, package removed)~~

## Architecture notes
- Game logic lives in `src/shared/` — shared between client and server
- Game phases: Setup → SelectingTrump → Bidding → Playing (defined in `src/shared/phases/`)
- Server uses custom `ServerPostgres` class wrapping `bgio-postgres`
- Client entry: `src/app/WizardClient.tsx` using `Client` from `boardgame.io/react`
- Custom boardgame.io type overrides in `src/shared/boardgame.io.d.ts`
