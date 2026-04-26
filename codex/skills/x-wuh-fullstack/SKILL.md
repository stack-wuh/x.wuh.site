---
name: x-wuh-fullstack
description: Fullstack expert skill for x.wuh.site. Use when implementing or designing frontend `packages/wuh.site.next`, local libraries in `packages/components` and `packages/hooks`, or the upcoming backend `wuh.site.nest` using NestJS + MongoDB.
---

# x.wuh.site Fullstack Expert

## Purpose
Provide practical, repository-aware guidance for x.wuh.site by combining frontend and backend expertise.

## Scope
- Frontend: implement and refactor UI in `packages/wuh.site.next` using the local component library and hooks.
- Backend: design and implement NestJS + MongoDB services, including modules, controllers, services, DTOs, and schemas.
- API integration: align frontend request payloads, routes, and data contracts with backend endpoints and validation.
- Monorepo consistency: preserve existing package boundaries, alias imports, token-driven themes, and SSR-safe client logic.

## Implementation rules
- Prefer `@wuh.site/components/<name>` for component imports inside `packages/wuh.site.next`.
- Use CSS variable theme tokens and existing styled-components patterns when styling components.
- Add `'use client'` only for components that require client-side state, effects, or interaction.
- Guard browser-only code using `typeof window !== 'undefined'` or similar runtime checks.
- Use existing hook entrypoints in `packages/hooks`, keep hook contracts stable, and avoid introducing new side effects.
- For backend work, follow NestJS conventions: module → controller → service → DTO/validation → schema.
- Define clear MongoDB schema models and validation rules; prefer conservative defaults and explicit field types.

## Use When
- Building or refactoring frontend features in `packages/wuh.site.next`.
- Extending or reusing the local component and hook libraries.
- Designing backend APIs or data models for `wuh.site.nest`.
- Connecting frontend requests with NestJS endpoint contracts.

## Verification checklist
- Validate import paths through repository package aliases.
- Confirm theme and styling remain consistent with existing provider setup.
- Confirm SSR-safe handling for browser-only code.
- Confirm backend API signatures match frontend expectations.
- Confirm NestJS modules, controllers, DTOs, and MongoDB schemas are structured clearly.
