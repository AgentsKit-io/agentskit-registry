# Incident Timeline

> **Status: alpha** — installable via `npx agentskit add security-incident-timeline` for experimentation. Not yet `validated`.

## Pain

IR timelines manual

## Output

Timeline typed

## Usage

```ts
import { createSecurityIncidentTimelineAgent } from './agents/security-incident-timeline/agent'
const result = await createSecurityIncidentTimelineAgent({ adapter }).run(input)
```

## Gates

- cite-sources

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
