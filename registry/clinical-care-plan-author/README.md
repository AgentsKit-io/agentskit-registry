# Care Plan Author

> **Status: alpha** — installable via `npx agentskit add clinical-care-plan-author` for experimentation. Not yet `validated`.

## Pain

Care plans manual

## Output

Plan typed

## Usage

```ts
import { createClinicalCarePlanAuthorAgent } from './agents/clinical-care-plan-author/agent'
const result = await createClinicalCarePlanAuthorAgent({ adapter }).run(input)
```

## Gates

- hitl
- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
