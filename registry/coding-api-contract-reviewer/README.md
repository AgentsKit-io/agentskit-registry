# API Contract Reviewer

> **Status: alpha** — installable via `npx agentskit add coding-api-contract-reviewer` for experimentation. Not yet `validated`.

## Pain

Breaking API changes

## Output

Breaking/non-breaking diff typed

## Usage

```ts
import { createCodingApiContractReviewerAgent } from './agents/coding-api-contract-reviewer/agent'
const result = await createCodingApiContractReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
