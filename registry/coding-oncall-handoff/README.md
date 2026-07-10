# On-call Handoff

> **Status: alpha** — installable via `npx agentskit add coding-oncall-handoff` for experimentation. Not yet `validated`.

## Pain

Shift changes lose context

## Output

Handoff typed: incidents, risks, next steps

## Usage

```ts
import { createCodingOncallHandoffAgent } from './agents/coding-oncall-handoff/agent'
const result = await createCodingOncallHandoffAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
