# Internal Mobility Matcher

> **Status: alpha** — installable via `npx agentskit add hr-internal-mobility-matcher` for experimentation. Not yet `validated`.

## Pain

Internal roles missed

## Output

Matches typed

## Usage

```ts
import { createHrInternalMobilityMatcherAgent } from './agents/hr-internal-mobility-matcher/agent'
const result = await createHrInternalMobilityMatcherAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
