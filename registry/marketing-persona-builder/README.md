# Persona Builder

> **Status: alpha** — installable via `npx agentskit add marketing-persona-builder` for experimentation. Not yet `validated`.

## Pain

Vague personas

## Output

Persona typed from research

## Usage

```ts
import { createMarketingPersonaBuilderAgent } from './agents/marketing-persona-builder/agent'
const result = await createMarketingPersonaBuilderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
