# User Story Splitter

> **Status: alpha** — installable via `npx agentskit add product-user-story-splitter` for experimentation. Not yet `validated`.

## Pain

Stories too large

## Output

Stories typed

## Usage

```ts
import { createProductUserStorySplitterAgent } from './agents/product-user-story-splitter/agent'
const result = await createProductUserStorySplitterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
