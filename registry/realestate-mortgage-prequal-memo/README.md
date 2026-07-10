# Mortgage Prequal Memo

> **Status: alpha** — installable via `npx agentskit add realestate-mortgage-prequal-memo` for experimentation. Not yet `validated`.

## Pain

Prequal slow

## Output

Memo typed

## Usage

```ts
import { createRealestateMortgagePrequalMemoAgent } from './agents/realestate-mortgage-prequal-memo/agent'
const result = await createRealestateMortgagePrequalMemoAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
