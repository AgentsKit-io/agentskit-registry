# Weekly Digest

> **Status: alpha** — installable via `npx agentskit add productivity-weekly-digest` for experimentation. Not yet `validated`.

## Pain

Weekly review manual

## Output

Digest typed

## Usage

```ts
import { createProductivityWeeklyDigestAgent } from './agents/productivity-weekly-digest/agent'
const result = await createProductivityWeeklyDigestAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
