# Policy Brief

> **Status: alpha** — installable via `npx agentskit add research-policy-brief` for experimentation. Not yet `validated`.

## Pain

Policy research scattered

## Output

Neutral brief typed

## Usage

```ts
import { createResearchPolicyBriefAgent } from './agents/research-policy-brief/agent'
const result = await createResearchPolicyBriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
