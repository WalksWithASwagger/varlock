---
name: varlock-contrib-expedition
description: >-
  Hunt bugs in the varlock monorepo, implement small mergeable fixes with tests,
  push attributed commits to the WalksWithASwagger fork, open upstream PRs when
  GH_TOKEN is configured, and report back. Use when the user asks for a bug hunt,
  contribution expedition, to crush/fix upstream issues for credit, to land PRs
  under their GitHub account, to set up upstream PR auth, or to repeat the
  find-fix-submit-report loop against dmno-dev/varlock.
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
| Upstream PR auth | env `GH_TOKEN` = WalksWithASwagger PAT (see setup below) |

If the user overrides identity or branch suffix, follow their values.

## Setup: open upstream PRs from the agent (required once)

Default Cursor cloud auth is a GitHub App token (`ghs_`, account `cursor`). It can **push to the fork** and open **fork-local** PRs, but **`createPullRequest` on `dmno-dev/varlock` returns 403**.

To let the agent open fork → upstream PRs as **you**:

1. On GitHub (as WalksWithASwagger), create a **fine-grained PAT**:
   - Resource owner: `WalksWithASwagger`
   - Repository access: `WalksWithASwagger/varlock` (and public repos if the UI requires it)
   - Permissions: **Contents: Read**, **Metadata: Read**, **Pull requests: Read and write**
   - Or classic PAT with `public_repo` / `repo`
2. In [Cursor Cloud Agents → Environments / Secrets](https://cursor.com/dashboard/cloud-agents):
   - Add secret **`GH_TOKEN`** = that PAT value  
   - Do **not** commit the token to the repo
3. **Start a new cloud agent** (or refresh the environment snapshot) so `GH_TOKEN` is injected. Existing VMs often miss newly added secrets.
4. Agent verifies at session start:

```bash
# Must NOT be ghs_ (App token). User PATs are ghp_ / github_pat_
echo "token prefix: ${GH_TOKEN:0:4}"
gh auth status
# Probe: should succeed once GH_TOKEN is your PAT
gh api user --jq .login   # expect WalksWithASwagger
```

When `GH_TOKEN` is set, `gh` uses it instead of the Cursor App token. Prefer `GH_TOKEN` over `GITHUB_TOKEN` (Cursor may inject the App token under other names).

If `GH_TOKEN` is missing, fall back to compare URLs for the user to open on their laptop.

## Constraints learned the hard way

1. **Without `GH_TOKEN`**, cannot open PRs on `dmno-dev/varlock` (403). Push to the fork + compare URL handoff.
2. **With `GH_TOKEN`**, open upstream PRs via `gh pr create --repo dmno-dev/varlock --head WalksWithASwagger:<branch> --base main`.
3. **Issue author is `cursor[bot]`** when filed via App token. Prefer **fix-first PRs** under WalksWithASwagger authorship for credit.
4. **Stacked PRs can “merge” without landing on `main`**. Verify distinctive code is on `upstream/main`.
5. **Do not re-file** bugs already fixed or tracked.

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

Optional: create a **fork** PR with `ManagePullRequest` for tracking.

### 5b. Open upstream PR (when `GH_TOKEN` is a user PAT)

```bash
if [[ "${GH_TOKEN:-}" == ghp_* || "${GH_TOKEN:-}" == github_pat_* ]]; then
  gh pr create \
    --repo dmno-dev/varlock \
    --head "WalksWithASwagger:cursor/<fix-name>-21b2" \
    --base main \
    --title "fix(varlock): <short summary>" \
    --body "$(cat <<'EOF'
## Summary
<what and why>

## Test plan
- [x] <vitest command>

EOF
)"
else
  echo "No user PAT in GH_TOKEN — hand off compare URL"
fi
```

Do not use `ManagePullRequest` for upstream (it targets the fork / cloud PR tooling). Use `gh pr create --repo dmno-dev/varlock`.

### 6. Report back (required every turn with new work)

```markdown
## Expedition report

### Upstream PRs (opened by agent) OR compare links
1. **<title>** — <one line>
   PR: <url>   OR   Compare: https://github.com/dmno-dev/varlock/compare/main...WalksWithASwagger:varlock:cursor/<branch>-21b2?expand=1
   Commit author: WalksWithASwagger ✓/✗
   Tests: <command> (<n> passed)

### Also found (not fixed this round)
- ...

### Auth status
- GH_TOKEN: user PAT (WalksWithASwagger) / missing / still App token (ghs_)

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
