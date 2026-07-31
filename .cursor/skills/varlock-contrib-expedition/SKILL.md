---
name: varlock-contrib-expedition
description: >-
  Hunt bugs in the varlock monorepo, implement small mergeable fixes with tests,
  push attributed commits to the WalksWithASwagger fork, and report back with
  upstream compare URLs for the user to open PRs. Use when the user asks for a
  bug hunt, contribution expedition, to crush/fix upstream issues for credit,
  to land PRs under their GitHub account, or to repeat the find-fix-submit-report
  loop against dmno-dev/varlock.
---

# Varlock contribution expedition

Goal: find real bugs, ship fixes that can merge into `dmno-dev/varlock`, and get **contributor credit under WalksWithASwagger**. Filing issues as `cursor[bot]` alone does not count.

## Defaults (this fork)

| Item | Value |
|------|--------|
| Upstream | `dmno-dev/varlock` |
| Fork remote | `origin` → `WalksWithASwagger/varlock` |
| Upstream remote | `upstream` (add if missing) |
| Git author | `Kris Krüg <140290088+WalksWithASwagger@users.noreply.github.com>` |
| Branch template | `cursor/<short-kebab>-21b2` |
| Base | current `upstream/main` |

If the user overrides identity or branch suffix, follow their values.

## Constraints learned the hard way

1. **Cannot open PRs on `dmno-dev/varlock`** from the cloud token (403). Always push to the fork and give the user a **compare URL** so they open the upstream PR while logged in as WalksWithASwagger.
2. **Issue author is `cursor[bot]`** when filed via this environment. Prefer **fix-first PRs** for credit. Only file an upstream issue when the bug is large/ambiguous or the user asks; still ship the fix under their git author.
3. **Stacked PRs can “merge” without landing on `main`**. After claiming a fix exists, verify the distinctive code is on `upstream/main` (raw file or `git merge-base --is-ancestor`).
4. **Do not re-file** bugs already fixed or tracked. Check open/closed issues and recent merged PRs before hunting.

## Loop (repeat until user stops)

```
hunt → verify new → pick 1–2 small fixes → implement+test → bumpy → commit as user → push fork → fork PR optional → report compare URLs → await user
```

### 1. Sync

```bash
export PATH="$HOME/.bun/bin:$PATH"
git remote | grep -q upstream || git remote add upstream https://github.com/dmno-dev/varlock.git
git fetch upstream main
git checkout -B main upstream/main
git config user.name "Kris Krüg"
git config user.email "140290088+WalksWithASwagger@users.noreply.github.com"
# Keep fork main aligned so compare links are clean (force-push only to origin/main on the fork)
git push origin upstream/main:main --force
```

Install/build as needed: `bun install`, `bun run build:libs` when vitest cannot resolve workspace packages.

### 2. Hunt (new bugs only)

Rank **3–6** candidates with: title, severity, file:line evidence on **current** `upstream/main`, minimal repro, why it’s a bug, fix sketch, nearby tests.

Prefer: correctness, security/leak, one-PR size. Skip: already-fixed issues, docs mega-gaps already tracked, pure features unless user asks.

Useful probes: TODOs that admit holes, asymmetric paths (write vs end, load vs run), falsy checks that skip `0`/`false`, docs vs coerce, override/`process.env` string paths.

Dedup via `gh issue list` / `gh search issues` on `dmno-dev/varlock`.

### 3. Pick and surface assumptions

Before implementing, briefly state:

```
ASSUMPTIONS:
1. Fix-first under WalksWithASwagger authorship for contributor credit
2. User will open the upstream PR from the compare URL
3. Starting with: <chosen bug(s)>
→ Proceeding unless redirected.
```

Default pick order: high-severity security/correctness with a small patch and existing test file nearby.

### 4. Implement

- Branch: `git checkout -B cursor/<fix-name>-21b2 upstream/main`
- Minimal diff; match repo style; tests that fail before / pass after
- User-facing behavior → update docs in `packages/varlock-website/src/content/docs/` (plain tone, no em dashes)
- Publishable package change → `bunx @varlock/bumpy add --packages "varlock:patch" --message "..." --name "<name>"`
- `bun run lint:fix`
- Targeted vitest (and `bun run build:libs` if imports break)

Follow [AGENTS.md](../../../AGENTS.md): Bun, no AI attribution lines in commits/PRs, meaningful branch names.

### 5. Commit and push (attribution)

```bash
git config user.name "Kris Krüg"
git config user.email "140290088+WalksWithASwagger@users.noreply.github.com"
git add <files>
git -c core.hooksPath=/dev/null commit -m "$(cat <<'EOF'
fix(varlock): <short user-facing summary>

<1–3 lines why>
EOF
)"
# Confirm before push:
git log -1 --format='%an <%ae>'
git push -u origin cursor/<fix-name>-21b2
```

Verify GitHub maps the commit: `gh api repos/WalksWithASwagger/varlock/commits/<sha> --jq .author.login` should be `WalksWithASwagger`.

Optional: create a **fork** PR with `ManagePullRequest` for tracking. That is **not** the upstream PR.

### 6. Report back (required every turn with new work)

Use this shape; keep it short:

```markdown
## Expedition report

### Shipped to fork (open these as YOU on upstream)
1. **<title>** — <one line>
   Compare: https://github.com/dmno-dev/varlock/compare/main...WalksWithASwagger:varlock:cursor/<branch>-21b2?expand=1
   Commit author: WalksWithASwagger ✓/✗
   Tests: <command> (<n> passed)

### Also found (not fixed this round)
- ...

### Blocked / needs you
- Open the compare URL(s) while logged in as WalksWithASwagger → Create pull request
- This environment cannot PR to dmno-dev/varlock (403)

### Status of prior hand-offs
- <PR/issue>: merged / open / still missing on upstream main
```

Do **not** claim upstream acceptance until the distinctive fix is on `dmno-dev/varlock` `main`.

### 7. Optional: file upstream issue

Only if useful for discussion. Body: problem, evidence, repro, expected vs actual. Label `bug` when available. Note in the report that the issue author will be `cursor[bot]`; the **PR** is the credit path.

## Anti-patterns

- Filing a batch of issues and stopping (no credit, easy for maintainers to scoop)
- Committing as `Cursor Agent <cursoragent@cursor.com>` when the goal is profile credit
- Merging only into the fork and calling the upstream issue “done”
- Re-filing #428 / #897 / already-closed #898–#905 without verifying `main`
- Huge refactors or drive-by cleanups unrelated to the bug

## Repo commands cheat sheet

| Task | Command |
|------|---------|
| Lint | `bun run lint:fix` |
| Package tests | `cd packages/varlock && bunx vitest run <path>` |
| Build workspace libs | `bun run build:libs` |
| Changeset | `bunx @varlock/bumpy add --packages "varlock:patch" --message "..." --name "..."` |
| Open bugs | `gh issue list --repo dmno-dev/varlock --state open --limit 30` |

## When the user says “proceed” / “again” / “another expedition”

Run the full loop from sync → hunt → 1–2 fixes → report. Do not wait for per-bug confirmation after assumptions are stated once in the session, unless requirements conflict.
