# Dashboard Spec Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Turns a dashboard request into a typed specification for metrics, views, and intended users.

## Install and try

```bash
npx agentskit add data-dashboard-spec-author
npm test -- --run registry/data-dashboard-spec-author/agent.test.ts
```

The test covers a structured dashboard specification and rejects empty input.

## Limits and contribution

The specification is not a data contract or implementation. Validate metric definitions, access controls, freshness, ownership, and source-system availability with the data team.

Activation: contribute a fixture where a requested metric lacks a source or access control, plus the accepted specification change.

Evidence: `registry/data-dashboard-spec-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
