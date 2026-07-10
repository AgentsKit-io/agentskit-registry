# Schema Documenter

> **Status: alpha** — installable via `npx agentskit add data-schema-documenter` for experimentation. Not yet `validated`.

## Pain

Undocumented schemas

## Output

Docs typed

## Usage

```ts
import { createDataSchemaDocumenterAgent } from './agents/data-schema-documenter/agent'
const result = await createDataSchemaDocumenterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
