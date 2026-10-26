# Blocker: #172 not started

- The Bash tool cannot capture output: the temp filesystem `/tmp/claude-1001/...` is full (0 MB free, ENOSPC). Every shell call fails before it runs, so `git status`, `git fetch`, and `git rebase` could not be run.
- The fleet task allowlist also rejects compound shell syntax (`&&`, `;`) and some commands (`df`).
- Nothing was measured: no `ak-docs index`, `ak-docs doctor --json`, bench run, or `npm run lint && npm run test && npm run build`.
- No code, docs, or commits were made on this branch.

Unblock: free space on `/tmp` (or set `CLAUDE_CODE_TMPDIR` to a disk with room) and re-dispatch on a branch based on current `origin/main` (52a0eb0, which already has #174). Do not build on the stale ff2f52c base.
