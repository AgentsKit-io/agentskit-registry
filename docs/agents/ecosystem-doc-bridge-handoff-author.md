# Doc-bridge Handoff Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Drafts an `agent-handoff-v1` record from index context, including edit roots and a human-document safety check. It is intended to make the handoff between agent documentation and human adapters explicit.

## Install and try

```bash
npx agentskit add ecosystem-doc-bridge-handoff-author
npm test -- --run registry/ecosystem-doc-bridge-handoff-author/agent.test.ts
```

The test exercises a package with an `editRoot`, an unclear context, and a package without a human adapter.

## Limits and contribution

The output always requires human review and does not create a public guide automatically. Add fixtures for missing checks, invalid edit roots, and external human-doc URLs.

Activation: contribute a handoff fixture without a human adapter and document the maintainer decision that makes it safe.

Evidence: `registry/ecosystem-doc-bridge-handoff-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
