# Feature Flag Reviewer

> **Status: alpha** — installable via `npx agentskit add coding-feature-flag-reviewer` for experimentation. Not yet `validated`.

## Pain

Risky flags in PRs

## Output

Risk findings typed

## Usage

```ts
import { createCodingFeatureFlagReviewerAgent } from './agents/coding-feature-flag-reviewer/agent'
const result = await createCodingFeatureFlagReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
