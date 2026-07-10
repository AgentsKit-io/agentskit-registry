# Competitive Landscape

> **Status: alpha** — installable via `npx agentskit add research-competitive-landscape` for experimentation. Not yet `validated`.

## Pain

Landscape maps stale

## Output

Players/moves typed + sources

## Usage

```ts
import { createResearchCompetitiveLandscapeAgent } from './agents/research-competitive-landscape/agent'
const result = await createResearchCompetitiveLandscapeAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
