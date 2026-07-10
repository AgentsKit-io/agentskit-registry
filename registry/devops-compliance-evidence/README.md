# Compliance Evidence

> **Status: alpha** — installable via `npx agentskit add devops-compliance-evidence` for experimentation. Not yet `validated`.

## Pain

SOC2 evidence

## Output

Evidence typed

## Usage

```ts
import { createDevopsComplianceEvidenceAgent } from './agents/devops-compliance-evidence/agent'
const result = await createDevopsComplianceEvidenceAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
