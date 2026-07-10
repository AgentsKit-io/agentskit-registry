# Settlement Memo

> **Status: alpha** — installable via `npx agentskit add legal-settlement-memo` for experimentation. Not yet `validated`.

## Pain

Settlement analysis slow

## Output

Memo typed

## Usage

```ts
import { createLegalSettlementMemoAgent } from './agents/legal-settlement-memo/agent'
const result = await createLegalSettlementMemoAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
