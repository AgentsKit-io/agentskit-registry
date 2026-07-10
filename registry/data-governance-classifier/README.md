# Data Governance Classifier

> **Status: alpha** — installable via `npx agentskit add data-governance-classifier` for experimentation. Not yet `validated`.

## Pain

Classification missing

## Output

Classification typed

## Usage

```ts
import { createDataGovernanceClassifierAgent } from './agents/data-governance-classifier/agent'
const result = await createDataGovernanceClassifierAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
