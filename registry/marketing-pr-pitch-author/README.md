# PR Pitch Author

> **Status: alpha** — installable via `npx agentskit add marketing-pr-pitch-author` for experimentation. Not yet `validated`.

## Pain

PR outreach generic

## Output

Pitches per outlet typed

## Usage

```ts
import { createMarketingPrPitchAuthorAgent } from './agents/marketing-pr-pitch-author/agent'
const result = await createMarketingPrPitchAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
