# Benefits FAQ

> **Status: alpha** — installable via `npx agentskit add hr-benefits-faq-bot` for experimentation. Not yet `validated`.

## Pain

Benefits questions repetitive

## Output

Answer typed

## Usage

```ts
import { createHrBenefitsFaqBotAgent } from './agents/hr-benefits-faq-bot/agent'
const result = await createHrBenefitsFaqBotAgent({ adapter }).run(input)
```

## Gates

- grounded-only

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
