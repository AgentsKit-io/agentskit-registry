# SOP Generator

> **Status: alpha** — installable via `npx agentskit add ops-sop-generator` for experimentation. Not yet `validated`.

## Pain

SOPs manual

## Output

SOP typed

## Usage

```ts
import { createOpsSopGeneratorAgent } from './agents/ops-sop-generator/agent'
const result = await createOpsSopGeneratorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
