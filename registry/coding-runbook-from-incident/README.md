# Runbook from Incident

> **Status: alpha** — installable via `npx agentskit add coding-runbook-from-incident` for experimentation. Not yet `validated`.

## Pain

Incidents not captured as runbooks

## Output

Runbook draft typed

## Usage

```ts
import { createCodingRunbookFromIncidentAgent } from './agents/coding-runbook-from-incident/agent'
const result = await createCodingRunbookFromIncidentAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
