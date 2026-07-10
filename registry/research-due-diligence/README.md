# Due Diligence Pack

> **Status: alpha** — installable via `npx agentskit add research-due-diligence` for experimentation. Not yet `validated`.

## Pain

M&A/vendor DD manual

## Output

DD pack typed claim→URL

## Usage

```ts
import { createResearchDueDiligenceAgent } from './agents/research-due-diligence/agent'
const result = await createResearchDueDiligenceAgent({ adapter }).run(input)
```

## Gates

- injection-defense

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
