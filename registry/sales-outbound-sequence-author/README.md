# Outbound Sequence Author

> **Status: alpha** — installable via `npx agentskit add sales-outbound-sequence-author` for experimentation. Not yet `validated`.

## Pain

Cold outreach manual

## Output

Sequence typed

## Usage

```ts
import { createSalesOutboundSequenceAuthorAgent } from './agents/sales-outbound-sequence-author/agent'
const result = await createSalesOutboundSequenceAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
