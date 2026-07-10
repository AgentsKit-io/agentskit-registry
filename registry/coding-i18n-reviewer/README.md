# i18n Reviewer

> **Status: alpha** — installable via `npx agentskit add coding-i18n-reviewer` for experimentation. Not yet `validated`.

## Pain

Hardcoded/missing strings

## Output

i18n findings typed

## Usage

```ts
import { createCodingI18nReviewerAgent } from './agents/coding-i18n-reviewer/agent'
const result = await createCodingI18nReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
