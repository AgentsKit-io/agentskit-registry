# QBR Deck Builder

> **Status: alpha** — installable via `npx agentskit add sales-qbr-deck-builder` for experimentation. Not yet `validated`.

## Pain

QBR decks slow

## Output

Deck typed

## Usage

```ts
import { createSalesQbrDeckBuilderAgent } from './agents/sales-qbr-deck-builder/agent'
const result = await createSalesQbrDeckBuilderAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
