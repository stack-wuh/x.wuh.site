@wuh.site/core

This package contains TypeScript DTOs and shared types used by both frontend (@wuh.site/site) and backend (@wuh.site/server).

Usage

- Import types directly in TypeScript code:

  import { UserDto, CreatePostDto } from '@wuh.site/core';

Build

- Build declarations only:
  pnpm --filter @wuh.site/core run build

Notes

- This package is types-only; it emits declaration files to dist/ for consumption by other packages.
- Keep DTOs backward-compatible; add new fields as optional where possible.
