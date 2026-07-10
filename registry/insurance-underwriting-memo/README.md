# Underwriting Memo

> **Status: alpha** — installable via `npx agentskit add insurance-underwriting-memo` for experimentation. Not yet `validated`.

## Pain

Underwriting slow

## Output

Memo typed

## Usage

```ts
import { createInsuranceUnderwritingMemoAgent } from './agents/insurance-underwriting-memo/agent'
const result = await createInsuranceUnderwritingMemoAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
