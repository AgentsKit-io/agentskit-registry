# Property Description

> **Status: alpha** — installable via `npx agentskit add realestate-property-description` for experimentation. Not yet `validated`.

## Pain

Descriptions generic

## Output

Description typed

## Usage

```ts
import { createRealestatePropertyDescriptionAgent } from './agents/realestate-property-description/agent'
const result = await createRealestatePropertyDescriptionAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
