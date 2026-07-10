# Obligation Tracker

> **Status: alpha** — installable via `npx agentskit add legal-obligation-tracker` for experimentation. Not yet `validated`.

## Pain

Contract obligations missed

## Output

Obligations typed

## Usage

```ts
import { createLegalObligationTrackerAgent } from './agents/legal-obligation-tracker/agent'
const result = await createLegalObligationTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
