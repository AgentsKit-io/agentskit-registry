# Glossary Builder

> **Status: alpha** — installable via `npx agentskit add content-glossary-builder` for experimentation. Not yet `validated`.

## Pain

Terminology inconsistent

## Output

Glossary typed

## Usage

```ts
import { createContentGlossaryBuilderAgent } from './agents/content-glossary-builder/agent'
const result = await createContentGlossaryBuilderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
