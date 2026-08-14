# RFC Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Drafts a typed RFC with the problem, options, and proposed decision before a large change.

## Install and try

```bash
npx agentskit add ecosystem-rfc-author
npm test -- --run registry/ecosystem-rfc-author/agent.test.ts
```

The test covers a structured RFC response and rejects empty input.

## Limits and contribution

An RFC is not approval or implementation. Owners must add evidence, trade-offs, non-goals, migration impact, and a decision record before execution.

Activation: open a discussion from the draft RFC with one explicit decision question and a requested reviewer.

Evidence: `registry/ecosystem-rfc-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
