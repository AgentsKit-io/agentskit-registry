# Email Personalizer

> **Status: alpha** — installable via `npx agentskit add sales-email-personalizer` for experimentation. Not yet `validated`.

## Pain

Generic outreach

## Output

Emails typed

## Usage

```ts
import { createSalesEmailPersonalizerAgent } from './agents/sales-email-personalizer/agent'
const result = await createSalesEmailPersonalizerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
