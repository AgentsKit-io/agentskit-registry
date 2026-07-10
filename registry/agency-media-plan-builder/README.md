# Media Plan Builder

> **Status: alpha** — installable via `npx agentskit add agency-media-plan-builder` for experimentation. Not yet `validated`.

## Pain

Media plans ad-hoc

## Output

Plan per channel typed

## Usage

```ts
import { createAgencyMediaPlanBuilderAgent } from './agents/agency-media-plan-builder/agent'
const result = await createAgencyMediaPlanBuilderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
