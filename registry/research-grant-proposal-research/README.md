# Grant Proposal Research

> **Status: alpha** — installable via `npx agentskit add research-grant-proposal-research` for experimentation. Not yet `validated`.

## Pain

Grant background slow

## Output

Literature typed

## Usage

```ts
import { createResearchGrantProposalResearchAgent } from './agents/research-grant-proposal-research/agent'
const result = await createResearchGrantProposalResearchAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
