# Incident Commander Aide

> **Status: alpha** — installable via `npx agentskit add ops-incident-commander-aide` for experimentation. Not yet `validated`.

## Pain

IC overload

## Output

Status typed

## Usage

```ts
import { createOpsIncidentCommanderAideAgent } from './agents/ops-incident-commander-aide/agent'
const result = await createOpsIncidentCommanderAideAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
