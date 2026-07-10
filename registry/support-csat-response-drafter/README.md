# CSAT Response Drafter

> **Status: alpha** — installable via `npx agentskit add support-csat-response-drafter` for experimentation. Not yet `validated`.

## Pain

Negative CSAT slow

## Output

Response draft typed

## Usage

```ts
import { createSupportCsatResponseDrafterAgent } from './agents/support-csat-response-drafter/agent'
const result = await createSupportCsatResponseDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
