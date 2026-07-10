# Observability Gap Finder

> **Status: alpha** — installable via `npx agentskit add coding-observability-gap` for experimentation. Not yet `validated`.

## Pain

Missing metrics/logs

## Output

Gaps per service typed

## Usage

```ts
import { createCodingObservabilityGapAgent } from './agents/coding-observability-gap/agent'
const result = await createCodingObservabilityGapAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
