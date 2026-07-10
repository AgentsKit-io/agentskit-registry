# Offer Letter Drafter

> **Status: alpha** — installable via `npx agentskit add hr-offer-letter-drafter` for experimentation. Not yet `validated`.

## Pain

Offers manual

## Output

Offer draft typed

## Usage

```ts
import { createHrOfferLetterDrafterAgent } from './agents/hr-offer-letter-drafter/agent'
const result = await createHrOfferLetterDrafterAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
