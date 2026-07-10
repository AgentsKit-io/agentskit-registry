# Incident Postmortem

> **Status: alpha** — installable via `npx agentskit add coding-incident-postmortem` for experimentation. Not yet `validated`.

## Pain

Post-incident chaos

## Output

Timeline + RCA + actions typed

## Usage

```ts
import { createCodingIncidentPostmortemAgent } from './agents/coding-incident-postmortem/agent'
const result = await createCodingIncidentPostmortemAgent({ adapter }).run(input)
```

## Gates

- cite-sources
- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
