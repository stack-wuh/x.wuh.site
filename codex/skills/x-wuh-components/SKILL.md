---
name: x-wuh-components
description: Implement and refactor UI in x.wuh.site with the local base component library in packages/components. Use when tasks involve selecting or updating components, wiring styled-components theme providers and CSS variables, extending existing primitives (Alert, Button, Card, Dialog, Empty, Image, ImagePreview, LinkGroup, SharedLinkGroup, Tag, Flex, Skeleton), or deciding whether a placeholder component folder must be implemented first.
---

# x.wuh.site Components

## Workflow
1. Read `references/component-library-map.md` to identify implemented vs placeholder components.
2. Reuse existing components before creating new primitives.
3. Keep styling token-driven via CSS variables from `packages/components/themes`.
4. Add or adjust component APIs only when usage requires it; preserve backward compatibility where already present (for example `Button.type` legacy mapping).
5. Validate by checking target pages and ensuring no server/client mismatch for interactive components.

## Implementation rules
- Prefer imports from `@wuh.site/components/<name>` inside `packages/wuh.site.next`.
- Add `'use client'` for interactive components using state/effects/events.
- Use styled-components patterns already used in this repo (transient props with `$` prefix for style-only props).
- Use theme CSS variables (`--primary-color`, `--space-*`, `--font-size-*`, `--normal-*`, `--background-*`) instead of hardcoded palette values when practical.
- Keep SSR compatibility for portal/fullscreen/browser APIs by guarding `document`/`window` access.

## Extension strategy
- Extend existing implemented components directly when the requested behavior belongs to that component's scope.
- For `Alert`, prefer metadata-row composition (`label: value`) and keep backward compatibility by layering new props (for example `updatedBy`, `license`) over old ones.
- If the request targets a placeholder component folder, implement it in that folder instead of adding a one-off component elsewhere.
- Update the corresponding `readme.md` or `README.md` when API surface changes.

## Verification checklist
- Confirm imports resolve in target package (`packages/wuh.site.next/tsconfig.json` aliases).
- Confirm theme stack remains intact in app layout:
  - `ThemeProvider` from `themes/themeProvider`
  - `StyledComponentsRegistry` for SSR styles
  - `CssVariableStyles` global variable injection
- Confirm keyboard and accessibility behaviors for Dialog/ImagePreview after changes.
