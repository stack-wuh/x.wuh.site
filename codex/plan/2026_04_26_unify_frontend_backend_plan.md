Problem

Need to unify front-end (packages/wuh.site.next) and planned back-end (wuh.site.nest) under a monorepo strategy that preserves package boundaries, reuses local components/hooks, keeps SSR safety, and defines clear API contracts and CI/deployment flows.

Proposed approach

1. Analyze repository and validate import aliases, package boundaries, and existing hooks/components usage.
2. Define shared contracts: create packages/shared-contracts (types/DTOs/OpenAPI schemas) used by both frontend and backend.
3. Prepare CI and incremental build strategy (pnpm workspaces + changesets or turborepo), ensure per-package pipelines and caching.
4. Implement backend skeleton (NestJS module/service/controller/DTO + Mongo schemas) aligned to shared contracts.
5. Migrate/verify frontend to consume shared contracts and local components, audit SSR-safety and theme tokens.
6. Add integration tests and API contract checks, finalize deployment pipelines (separate images, deploy configs).

Phases & Milestones

- Phase 0: Repo analysis & gating (aliases, package.json, tsconfig paths)
- Phase 1: Shared contracts + CI changes
- Phase 2: Backend scaffold + DTOs/schemas
- Phase 3: Frontend migration & SSR safety audit
- Phase 4: Integration tests, docs, release

Todos (high level)

- analyze-repo: Analyze repository aliases, package boundaries, and build config. Output: checklist of path/alias fixes.
- create-shared-contracts: Add packages/shared-contracts with TypeScript DTOs and OpenAPI definitions.
- setup-ci-incremental-builds: Update CI workflows to support per-package incremental builds and caching.
- scaffold-backend-nest: Create initial wuh.site.nest module, auth, and example resource module with DTOs and Mongo schemas.
- migrate-frontend-usage: Update frontend to import shared contracts, ensure imports from @wuh.site/components and hooks, and fix type errors.
- ssr-safety-audit: Audit 'use client' usage and browser guards; fix SSR-unsafe code.
- theme-token-check: Ensure theme provider and CSS variables live in packages/components/themes and are consumed consistently.
- integration-tests: Add end-to-end tests verifying API contracts between frontend and backend.

Acceptance criteria

1. @wuh.site/* imports resolve in both dev and CI builds.
2. Shared DTOs live in packages/shared-contracts and are consumed by frontend and backend.
3. All browser-specific code guarded for SSR; 'use client' used only when necessary.
4. Backend uses NestJS modules/DTOs/Mongo schemas matching shared contracts.
5. CI builds are incremental per-package and trigger appropriate deployments.

Notes

- Keep packages boundaries; avoid coupling by default.
- Provide migration PRs per-phase; prefer many small changes.

Plan created by Copilot CLI assistant.
