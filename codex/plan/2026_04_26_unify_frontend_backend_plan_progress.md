Progress summary (2026-04-26)

Completed:
- Plan saved to codex/plan/2026_04_26_unify_frontend_backend_plan.md
- tsconfig paths updated: added "@wuh.site/*" -> "packages/*/src"
- packages/shared-contracts created with DTOs (User/Post/Content/Comment types) and build config
- CI workflow added (.github/workflows/ci.yml)
- Backend DTOs updated to implement shared-contracts interfaces (content, comment modules)

Current focus:
- migrate-frontend-usage: auditing frontend type usage to identify places to reuse shared-contracts types without breaking existing runtime shapes.

Findings from quick audit:
- Frontend exports several local types (e.g., app/post/PostView.types.ts) describing GitHub Issue shapes used for rendering.
- No direct use of server DTO class names (Create*Dto) found in frontend; frontend primarily consumes API responses and uses internal types.

Planned next steps for migrate-frontend-usage:
1. Identify API clients and response shapes (e.g., /app/api/*) and add type annotations using shared-contracts where semantics match (comments, content creation endpoints).
2. Gradually replace duplicated frontend types with imports from @wuh.site/shared-contracts when compatible, keeping any GitHub-specific Issue shape separate.
3. Add a small integration test or TypeScript check to ensure frontend types are assignable to shared-contracts where intended.

Notes:
- Backend keeps runtime class-validator DTOs; shared-contracts provides compile-time interfaces.
- Proceeding incrementally avoids breaking rendering behavior.

Next action: starting migrate-frontend-usage (in-progress).