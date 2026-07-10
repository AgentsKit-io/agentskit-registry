# Incident Triage

> **Status: alpha** — installable via `npx agentskit add devops-incident-triage` for experimentation. Not yet `validated`.

## Pain

Alert flood

## Output

Triage typed

## Usage

```ts
import { createDevopsIncidentTriageAgent } from './agents/devops-incident-triage/agent'
const result = await createDevopsIncidentTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
