# Revision Tracker

> **Status: alpha** — installable via `npx agentskit add agency-revision-tracker` for experimentation. Not yet `validated`.

## Pain

Revisions lost

## Output

Revision log typed

## Usage

```ts
import { createAgencyRevisionTrackerAgent } from './agents/agency-revision-tracker/agent'
const result = await createAgencyRevisionTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
