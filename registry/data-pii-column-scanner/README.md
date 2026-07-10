# PII Column Scanner

> **Status: alpha** — installable via `npx agentskit add data-pii-column-scanner` for experimentation. Not yet `validated`.

## Pain

PII in tables

## Output

Columns typed

## Usage

```ts
import { createDataPiiColumnScannerAgent } from './agents/data-pii-column-scanner/agent'
const result = await createDataPiiColumnScannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
