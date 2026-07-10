# Landing CRO Auditor

> **Status: alpha** — installable via `npx agentskit add marketing-landing-cro-auditor` for experimentation. Not yet `validated`.

## Pain

LP not converting

## Output

CRO findings typed

## Usage

```ts
import { createMarketingLandingCroAuditorAgent } from './agents/marketing-landing-cro-auditor/agent'
const result = await createMarketingLandingCroAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
