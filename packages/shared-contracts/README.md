@wuh.site/shared-contracts

This package contains TypeScript DTOs and shared types used by both frontend (@wuh.site/next) and backend (@wuh.site/nest).

Usage

- Import types directly in TypeScript code:

  import { UserDto, CreatePostDto } from '@wuh.site/shared-contracts';

Build

- Build declarations only:
  pnpm --filter @wuh.site/shared-contracts run build

Notes

- This package is types-only; it emits declaration files to dist/ for consumption by other packages.
- Keep DTOs backward-compatible; add new fields as optional where possible.
