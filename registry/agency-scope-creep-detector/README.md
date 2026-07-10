# Scope Creep Detector

> **Status: alpha** — installable via `npx agentskit add agency-scope-creep-detector` for experimentation. Not yet `validated`.

## Pain

Scope creep unnoticed

## Output

Flags vs SOW typed

## Usage

```ts
import { createAgencyScopeCreepDetectorAgent } from './agents/agency-scope-creep-detector/agent'
const result = await createAgencyScopeCreepDetectorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
