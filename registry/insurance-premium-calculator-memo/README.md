# Premium Calculator Memo

> **Status: alpha** — installable via `npx agentskit add insurance-premium-calculator-memo` for experimentation. Not yet `validated`.

## Pain

Premium opaque

## Output

Memo typed

## Usage

```ts
import { createInsurancePremiumCalculatorMemoAgent } from './agents/insurance-premium-calculator-memo/agent'
const result = await createInsurancePremiumCalculatorMemoAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
