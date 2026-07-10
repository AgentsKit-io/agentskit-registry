# Policy Drafter

> **Status: alpha** — installable via `npx agentskit add hr-policy-drafter` for experimentation. Not yet `validated`.

## Pain

Policies manual

## Output

Policy draft typed

## Usage

```ts
import { createHrPolicyDrafterAgent } from './agents/hr-policy-drafter/agent'
const result = await createHrPolicyDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
