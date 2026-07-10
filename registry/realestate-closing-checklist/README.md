# Closing Checklist

> **Status: alpha** — installable via `npx agentskit add realestate-closing-checklist` for experimentation. Not yet `validated`.

## Pain

Closing items missed

## Output

Checklist typed

## Usage

```ts
import { createRealestateClosingChecklistAgent } from './agents/realestate-closing-checklist/agent'
const result = await createRealestateClosingChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
