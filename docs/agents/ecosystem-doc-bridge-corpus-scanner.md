# Doc-bridge Corpus Scanner

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Scans a corpus description into typed paths, document types, and staleness signals. It is useful before an index run when the team needs to distinguish agent docs, human docs, config files, and unknown files.

## Install and try

```bash
npx agentskit add ecosystem-doc-bridge-corpus-scanner
npm test -- --run registry/ecosystem-doc-bridge-corpus-scanner/agent.test.ts
```

The test covers a corpus with `packages/auth.md`, a human guide, an empty Markdown set, and stale/symlink review signals.

## Limits and contribution

The report is a draft for review; it does not publish, edit, or certify a corpus. Add cases for symlinks, stale timestamps, and mixed extensions in `agent.test.ts`.

Activation: add one of those edge-case fixtures to `agent.test.ts` and link the resulting discussion or issue from the guide.

Evidence: `registry/ecosystem-doc-bridge-corpus-scanner/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
