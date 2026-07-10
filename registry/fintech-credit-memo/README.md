# Credit Memo

> **Status: alpha** — installable via `npx agentskit add fintech-credit-memo` for experimentation. Not yet `validated`.

## Pain

Credit decisions undocumented

## Output

Memo typed

## Usage

```ts
import { createFintechCreditMemoAgent } from './agents/fintech-credit-memo/agent'
const result = await createFintechCreditMemoAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
