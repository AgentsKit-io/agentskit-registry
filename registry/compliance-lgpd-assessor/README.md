# LGPD Assessor

> **Status: alpha** — installable via `npx agentskit add compliance-lgpd-assessor` for experimentation. Not yet `validated`.

## Pain

LGPD gap analysis

## Output

Assessment typed

## Usage

```ts
import { createComplianceLgpdAssessorAgent } from './agents/compliance-lgpd-assessor/agent'
const result = await createComplianceLgpdAssessorAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
