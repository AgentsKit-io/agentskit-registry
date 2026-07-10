# PRD from Interviews

> **Status: alpha** — installable via `npx agentskit add product-prd-from-interviews` for experimentation. Not yet `validated`.

## Pain

Interview→PRD slow

## Output

PRD typed

## Usage

```ts
import { createProductPrdFromInterviewsAgent } from './agents/product-prd-from-interviews/agent'
const result = await createProductPrdFromInterviewsAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
