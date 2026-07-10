# Employee Onboarding Checklist

> **Status: alpha** — installable via `npx agentskit add ops-onboarding-checklist` for experimentation. Not yet `validated`.

## Pain

Onboarding inconsistent

## Output

Checklist typed

## Usage

```ts
import { createOpsOnboardingChecklistAgent } from './agents/ops-onboarding-checklist/agent'
const result = await createOpsOnboardingChecklistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
