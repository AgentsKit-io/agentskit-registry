# Deposition Prep

> **Status: alpha** — installable via `npx agentskit add legal-deposition-prep` for experimentation. Not yet `validated`.

## Pain

Depo prep unstructured

## Output

Question bank typed

## Usage

```ts
import { createLegalDepositionPrepAgent } from './agents/legal-deposition-prep/agent'
const result = await createLegalDepositionPrepAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
