# HR Compliance Checklist

> **Status: alpha** — installable via `npx agentskit add hr-compliance-checklist` for experimentation. Not yet `validated`.

## Pain

Labor compliance ad-hoc

## Output

Checklist typed

## Usage

```ts
import { createHrComplianceChecklistAgent } from './agents/hr-compliance-checklist/agent'
const result = await createHrComplianceChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
