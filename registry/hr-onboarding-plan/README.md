# Onboarding Plan

> **Status: alpha** — installable via `npx agentskit add hr-onboarding-plan` for experimentation. Not yet `validated`.

## Pain

30/60/90 ad-hoc

## Output

Plan typed

## Usage

```ts
import { createHrOnboardingPlanAgent } from './agents/hr-onboarding-plan/agent'
const result = await createHrOnboardingPlanAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
