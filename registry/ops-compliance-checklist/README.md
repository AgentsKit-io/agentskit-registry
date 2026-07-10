# Compliance Checklist

> **Status: alpha** — installable via `npx agentskit add ops-compliance-checklist` for experimentation. Not yet `validated`.

## Pain

Compliance ad-hoc

## Output

Checklist typed

## Usage

```ts
import { createOpsComplianceChecklistAgent } from './agents/ops-compliance-checklist/agent'
const result = await createOpsComplianceChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
