# Patent Prior Art

> **Status: alpha** — installable via `npx agentskit add research-patent-prior-art` for experimentation. Not yet `validated`.

## Pain

Prior art search slow

## Output

Results typed + citations

## Usage

```ts
import { createResearchPatentPriorArtAgent } from './agents/research-patent-prior-art/agent'
const result = await createResearchPatentPriorArtAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
