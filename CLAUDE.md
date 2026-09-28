@AGENTS.md

# This fork

`WalksWithASwagger/varlock` is a working fork of [dmno-dev/varlock](https://github.com/dmno-dev/varlock). Use it to land fixes here, then open PRs upstream. It is not a separate product or release line.

GitHub issues are disabled on this repo. File and track work in [WalksWithASwagger/kk-agents](https://github.com/WalksWithASwagger/kk-agents) (see [#110](https://github.com/WalksWithASwagger/kk-agents/issues/110)).

`AGENTS.md` (included above) is the upstream contributor contract: Bun, turbo, tests, bumps, docs tone. This file is the fork overlay.

For fork-only history vs what already landed upstream, see [docs/fork.md](docs/fork.md).

## Upstream contributions

Work on this fork, then send the same branch to `dmno-dev/varlock`. That is how the Sept 2026 expedition fixes went up ([WalksWithASwagger/varlock#17](https://github.com/WalksWithASwagger/varlock/pull/17) here, then [dmno-dev/varlock#1061](https://github.com/dmno-dev/varlock/pull/1061) upstream).

1. Add `upstream` if it is missing: `git remote add upstream https://github.com/dmno-dev/varlock.git`
2. Fetch `upstream/main` and branch from that, not from a stale fork `main`. Meaningful kebab-case branch names only. Rename auto-generated session names first. See `AGENTS.md`.
3. Commit as Kris (`Kris Krüg <140290088+WalksWithASwagger@users.noreply.github.com>`). No AI attribution in commits or PR text.
4. Commit locally as you go. Push to `origin` (this fork) when the work is ready, not after every commit.
5. Optional: open a tracking PR on this fork.
6. Open the real PR on `dmno-dev/varlock` from the fork branch (`--head WalksWithASwagger:<branch> --base main`), or hand Kris a compare URL:
   `https://github.com/dmno-dev/varlock/compare/main...WalksWithASwagger:varlock:<branch>?expand=1`
7. Do not call it landed until the distinctive change is on `dmno-dev/varlock` `main`. A closed fork PR or a closed upstream PR is not enough. `#1061` was closed unmerged; the maintainer split and merged it as `#1064`, `#1065`, `#1066`.

Cloud agents can push to this fork. Opening the upstream PR needs Kris logged in as WalksWithASwagger, or a user PAT in the `GH_TOKEN` env var (never commit that token). If neither is available, stop at the compare URL.

A fork-only contrib skill used to live at `.cursor/skills/varlock-contrib-expedition` (fork PRs [#9](https://github.com/WalksWithASwagger/varlock/pull/9) and [#16](https://github.com/WalksWithASwagger/varlock/pull/16)). It is not on current `main`. TODO KK: restore it, or drop it and keep this file as the workflow.

TODO KK: say whether fork `main` should be reset to match `dmno-dev/varlock` `main` after each sync.

## Test commands

Install with `bun install`. Build workspace libs before package-level vitest if imports fail: `bun run build:libs`.

| Task | Command |
|------|---------|
| Full check (lint, typecheck, libs, unit CI) | `bun run check` |
| Lint | `bun run lint` / `bun run lint:fix` |
| Typecheck (skip website, smoke-tests, docs MCP) | `bun run typecheck:all` |
| Build all packages | `bun run build` |
| Build libs only (no website) | `bun run build:libs` |
| One package (builds workspace deps first) | `bunx turbo run build --filter=varlock` |
| Unit/integration CI | `bun run test:ci` |
| One varlock test file | `cd packages/varlock && bunx vitest run <path>` |
| Smoke tests | `bun run smoke-test` |
| Framework tests | `bun run test:frameworks` |
| Local SEA binary smoke | `bun run --filter varlock test:binary:local` |
| Docs site build | `bun run --filter @varlock/website build` |

Do not use `bun run --filter <pkg> build` for a package that needs workspace dist output. Use turbo. See `AGENTS.md`.

Smoke and binary notes: [docs/smoke-tests.md](docs/smoke-tests.md). Binary tests in `smoke-tests/tests/binary.test.ts` need the SEA binary built first.

## Secrets

This repo is the Varlock product. Load env with `.env.schema` plus `varlock load` / `varlock run`. Do not add `op://`, `op read`, or 1Password vault steps. Do not commit secrets or real key values.

Leave upstream 1Password plugin docs alone: the README plugin example, `packages/varlock-website` plugin pages, and the `CONTRIBUTING.md` local-plugin snippet.
