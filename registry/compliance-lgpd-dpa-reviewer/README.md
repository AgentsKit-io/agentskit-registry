# LGPD DPA Reviewer

> **Status: alpha** — installable via `npx agentskit add compliance-lgpd-dpa-reviewer` for experimentation. Not yet `validated`.

## Pain

DPA review BR

## Output

Findings typed

## Usage

```ts
import { createComplianceLgpdDpaReviewerAgent } from './agents/compliance-lgpd-dpa-reviewer/agent'
const result = await createComplianceLgpdDpaReviewerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
