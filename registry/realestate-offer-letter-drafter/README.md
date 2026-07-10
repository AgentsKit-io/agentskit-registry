# Offer Letter Drafter

> **Status: alpha** — installable via `npx agentskit add realestate-offer-letter-drafter` for experimentation. Not yet `validated`.

## Pain

Offers manual

## Output

Offer typed

## Usage

```ts
import { createRealestateOfferLetterDrafterAgent } from './agents/realestate-offer-letter-drafter/agent'
const result = await createRealestateOfferLetterDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
