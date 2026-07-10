# NDA Reviewer

> **Status: alpha** — installable via `npx agentskit add legal-nda-reviewer` for experimentation. Not yet `validated`.

## Pain

NDA review bottleneck

## Output

Findings typed

## Usage

```ts
import { createLegalNdaReviewerAgent } from './agents/legal-nda-reviewer/agent'
const result = await createLegalNdaReviewerAgent({ adapter }).run(input)
```

## Gates

- hitl
- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
