# Regulatory Tracker

> **Status: alpha** — installable via `npx agentskit add research-regulatory-tracker` for experimentation. Not yet `validated`.

## Pain

Reg changes missed

## Output

Delta report typed + sources

## Usage

```ts
import { createResearchRegulatoryTrackerAgent } from './agents/research-regulatory-tracker/agent'
const result = await createResearchRegulatoryTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
