# Invoice Fraud Detector

> **Status: alpha** — installable via `npx agentskit add fintech-invoice-fraud-detector` for experimentation. Not yet `validated`.

## Pain

Invoice fraud

## Output

Findings typed

## Usage

```ts
import { createFintechInvoiceFraudDetectorAgent } from './agents/fintech-invoice-fraud-detector/agent'
const result = await createFintechInvoiceFraudDetectorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
