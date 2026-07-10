# Exhibit Indexer

> **Status: alpha** — installable via `npx agentskit add legal-exhibit-indexer` for experimentation. Not yet `validated`.

## Pain

Exhibits disorganized

## Output

Index typed

## Usage

```ts
import { createLegalExhibitIndexerAgent } from './agents/legal-exhibit-indexer/agent'
const result = await createLegalExhibitIndexerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
