#!/usr/bin/env bash
# Verify this VM can open PRs from WalksWithASwagger/* to dmno-dev/varlock.
set -euo pipefail

prefix="${GH_TOKEN:0:4}"
echo "GH_TOKEN prefix: ${prefix:-<unset>}"

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "FAIL: GH_TOKEN is not set."
  echo "Add a WalksWithASwagger PAT as secret GH_TOKEN in Cursor Cloud Agents → Secrets,"
  echo "then start a new agent so the secret is injected."
  exit 1
fi

if [[ "$prefix" == "ghs_" ]]; then
  echo "FAIL: GH_TOKEN is still a GitHub App installation token (ghs_)."
  echo "That token cannot create PRs on dmno-dev/varlock. Use a user PAT (ghp_ / github_pat_)."
  exit 1
fi

login="$(gh api user --jq .login 2>/dev/null || true)"
echo "gh api user login: ${login:-<error>}"

if [[ "$login" != "WalksWithASwagger" ]]; then
  echo "FAIL: expected login WalksWithASwagger, got '${login:-none}'."
  exit 1
fi

echo "OK: authenticated as WalksWithASwagger with a user PAT."
echo "Upstream PR command shape:"
echo "  gh pr create --repo dmno-dev/varlock --head WalksWithASwagger:<branch> --base main"
