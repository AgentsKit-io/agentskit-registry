# IEP Drafter

> **Status: alpha** — installable via `npx agentskit add education-iep-drafter` for experimentation. Not yet `validated`.

## Pain

IEP paperwork

## Output

IEP draft typed

## Usage

```ts
import { createEducationIepDrafterAgent } from './agents/education-iep-drafter/agent'
const result = await createEducationIepDrafterAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
