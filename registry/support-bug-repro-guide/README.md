# Bug Repro Guide

> **Status: alpha** — installable via `npx agentskit add support-bug-repro-guide` for experimentation. Not yet `validated`.

## Pain

Bugs without repro

## Output

Repro steps typed

## Usage

```ts
import { createSupportBugReproGuideAgent } from './agents/support-bug-repro-guide/agent'
const result = await createSupportBugReproGuideAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
