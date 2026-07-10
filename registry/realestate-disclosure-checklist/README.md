# Disclosure Checklist

> **Status: alpha** — installable via `npx agentskit add realestate-disclosure-checklist` for experimentation. Not yet `validated`.

## Pain

Disclosures missed

## Output

Checklist typed

## Usage

```ts
import { createRealestateDisclosureChecklistAgent } from './agents/realestate-disclosure-checklist/agent'
const result = await createRealestateDisclosureChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
