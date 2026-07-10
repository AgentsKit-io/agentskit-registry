# Creative QA Checklist

> **Status: alpha** — installable via `npx agentskit add agency-creative-qa-checklist` for experimentation. Not yet `validated`.

## Pain

Creative QA inconsistent

## Output

Checklist pass/fail typed

## Usage

```ts
import { createAgencyCreativeQaChecklistAgent } from './agents/agency-creative-qa-checklist/agent'
const result = await createAgencyCreativeQaChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
