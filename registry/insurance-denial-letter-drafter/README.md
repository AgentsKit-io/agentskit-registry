# Denial Letter Drafter

> **Status: alpha** — installable via `npx agentskit add insurance-denial-letter-drafter` for experimentation. Not yet `validated`.

## Pain

Denial letters

## Output

Letter typed

## Usage

```ts
import { createInsuranceDenialLetterDrafterAgent } from './agents/insurance-denial-letter-drafter/agent'
const result = await createInsuranceDenialLetterDrafterAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
