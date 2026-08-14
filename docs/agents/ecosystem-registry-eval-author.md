# Registry Eval Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Drafts typed `@agentskit/eval` cases with an input, expected description, and rationale for a Registry agent.

## Install and try

```bash
npx agentskit add ecosystem-registry-eval-author
npm test -- --run registry/ecosystem-registry-eval-author/agent.test.ts
```

The test uses a contract-review agent prompt, an adversarial missing-evidence case, and rejects empty input.

## Limits and contribution

Generated cases are proposals, not proof of quality. A maintainer must review expected behavior, add adversarial cases, and run the actual eval suite before marking an agent validated.

Activation: contribute one adversarial eval case for an existing agent and record the maintainer's expected behavior rationale.

Evidence: `registry/ecosystem-registry-eval-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
