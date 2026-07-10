# Cross-border Transfer Memo

> **Status: alpha** — installable via `npx agentskit add compliance-cross-border-transfer-memo` for experimentation. Not yet `validated`.

## Pain

Transfer risk

## Output

Memo typed

## Usage

```ts
import { createComplianceCrossBorderTransferMemoAgent } from './agents/compliance-cross-border-transfer-memo/agent'
const result = await createComplianceCrossBorderTransferMemoAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
