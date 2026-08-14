# Registry Agent Spec Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Turns an agent idea into a typed pre-scaffold specification: pain, output, gates, tags, and a Zod shape outline.

## Install and try

```bash
npx agentskit add ecosystem-registry-agent-spec-author
npm test -- --run registry/ecosystem-registry-agent-spec-author/agent.test.ts
```

The test uses an HR resume-screener idea and checks that an empty request is rejected.

## Limits and contribution

The specification is not an implementation or validation approval. A contributor still needs to scaffold the agent, implement the contract, add eval coverage, and pass Registry checks.

Activation: turn an approved specification into a small vertical-slice issue with contract, eval, and Registry acceptance checks.

Evidence: `registry/ecosystem-registry-agent-spec-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
