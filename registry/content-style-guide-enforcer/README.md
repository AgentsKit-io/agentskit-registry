# Style Guide Enforcer

> **Status: alpha** — installable via `npx agentskit add content-style-guide-enforcer` for experimentation. Not yet `validated`.

## Pain

Style drift

## Output

Violations typed

## Usage

```ts
import { createContentStyleGuideEnforcerAgent } from './agents/content-style-guide-enforcer/agent'
const result = await createContentStyleGuideEnforcerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
