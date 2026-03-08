---
name: x-wuh-hooks
description: Implement and refactor interaction logic in x.wuh.site using the local hooks library in packages/hooks. Use when tasks involve dialog open/close control, image preview index and loop state, token lookup from the theme context, or choosing the correct hook integration pattern with Dialog and ImagePreview components.
---

# x.wuh.site Hooks

## Workflow
1. Read `references/hooks-api-map.md` to pick the correct hook and understand caveats.
2. Use `useDialog` for modal open state and `Dialog` binding.
3. Use `useImagePreview` for preview open/index state and `ImagePreview` binding.
4. Use `useTokens` for typed token lookup under `ThemeProvider` context.
5. Keep hook usage controlled/uncontrolled behavior consistent with consuming components.

## Hook integration rules
- Prefer hook `bind` objects when available:
  - `useDialog().bind` -> `{ open, onClose }`
  - `useImagePreview().bind` -> `{ open, currentIndex, onClose, onIndexChange }`
- Pass `itemCount` to `useImagePreview` when index clamping is needed from hook level.
- Keep open/index callbacks side-effect free and deterministic.
- Guard browser-only operations in consumer components, not inside pure state hooks.

## Constraints and caveats
- `packages/hooks/useTheme/index.ts` is currently empty; do not depend on that path.
- `packages/hooks/useTokens/index.ts` exports both `useTheme` and `useTokens`; this is the working token hook entry.
- `useTokens` requires styled-components `ThemeProvider` to be present, otherwise it throws.

## Verification checklist
- Confirm hook return signatures are used as defined in `references/hooks-api-map.md`.
- Confirm component contracts line up:
  - Dialog expects `open` and `onClose`.
  - ImagePreview expects `open`, `currentIndex`, `onClose`, `onIndexChange`.
- Confirm no stale closure bugs by using callback setters when deriving next state.
