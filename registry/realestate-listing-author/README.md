# Listing Author

> **Status: alpha** — installable via `npx agentskit add realestate-listing-author` for experimentation. Not yet `validated`.

## Pain

Listings weak

## Output

Listing typed

## Usage

```ts
import { createRealestateListingAuthorAgent } from './agents/realestate-listing-author/agent'
const result = await createRealestateListingAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
