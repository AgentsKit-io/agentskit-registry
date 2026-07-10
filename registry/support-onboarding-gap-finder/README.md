# Onboarding Gap Finder

> **Status: alpha** — installable via `npx agentskit add support-onboarding-gap-finder` for experimentation. Not yet `validated`.

## Pain

Onboarding failures

## Output

Gaps typed

## Usage

```ts
import { createSupportOnboardingGapFinderAgent } from './agents/support-onboarding-gap-finder/agent'
const result = await createSupportOnboardingGapFinderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
