# Fork notes

This folder's other file, [smoke-tests.md](smoke-tests.md), is upstream product docs. Leave it alone unless the smoke suite itself changes.

This page is the fork overlay: what on `WalksWithASwagger/varlock` is not (or was not) on `dmno-dev/varlock`.

Checked against fork `main` at `49c487e` (2026-09-02) and `dmno-dev/varlock` `main` as of 2026-09-28.

## What this fork is for

Working copy for credited contributions to [dmno-dev/varlock](https://github.com/dmno-dev/varlock). See [CLAUDE.md](../CLAUDE.md) for the branch and PR steps.

Issues are disabled here. Track work in [WalksWithASwagger/kk-agents](https://github.com/WalksWithASwagger/kk-agents).

## Unpublished product changes

None on this checkout.

The only commits on fork `main` after the last shared upstream tip (`fbfd415`, smoke-tests vitest 4) are:

| Fork commit | What it was | Upstream |
|-------------|-------------|----------|
| `3ec810e` (fork PR [#17](https://github.com/WalksWithASwagger/varlock/pull/17)) | Type coercions, imported `@currentEnv` (#428), leak-scan `ServerResponse.end` hang (#897) | Sent as [dmno-dev/varlock#1061](https://github.com/dmno-dev/varlock/pull/1061) (closed, not merged). Maintainer split and merged [\#1064](https://github.com/dmno-dev/varlock/pull/1064), [\#1065](https://github.com/dmno-dev/varlock/pull/1065), [\#1066](https://github.com/dmno-dev/varlock/pull/1066). Review changed some of the original behavior (for example `url` `allowedDomains` and `noTrailingSlash`). |
| `49c487e` (fork PR [#18](https://github.com/WalksWithASwagger/varlock/pull/18)) | Imported `@currentEnv` docs and the macOS Homebrew Python re-exec note | Merged as [dmno-dev/varlock#1062](https://github.com/dmno-dev/varlock/pull/1062) |

Older fork PRs that already went upstream include WSL encrypt-helper install ([#896](https://github.com/dmno-dev/varlock/pull/896)).

## Leftovers on this checkout

- `.bumpy/land-pending-fixes.md` is the changeset from `3ec810e`. Upstream released those fixes under their own process. This file is leftover, not a second unpublished change.
- This checkout still has `packages/varlock` at 1.18.0. Upstream `main` has since shipped 1.21.0 (and later commits through 2026-09-28). The fork is behind.

## Fork-only tooling that is missing here

`.cursor/skills/varlock-contrib-expedition` was added on this fork in PRs [#9](https://github.com/WalksWithASwagger/varlock/pull/9) and [#16](https://github.com/WalksWithASwagger/varlock/pull/16). It is not on current `main` (likely dropped in a later sync). TODO KK: restore it, or keep [CLAUDE.md](../CLAUDE.md) as the only workflow note.

## What we did not change

Upstream 1Password plugin docs stay as they are. That includes the README `op()` example, the website plugin pages, and the local-plugin snippet in `CONTRIBUTING.md`.

## TODO KK

- Sync (or reset) this fork's `main` to current `dmno-dev/varlock` `main` when you want new work to start from upstream.
- Confirm whether the contrib skill should come back.
- Confirm whether `.bumpy/land-pending-fixes.md` should be deleted after the next sync.
