# Audit Evidence Collector

> **Status: alpha** — installable via `npx agentskit add ops-audit-evidence-collector` for experimentation. Not yet `validated`.

## Pain

Audit prep chaotic

## Output

Evidence map typed

## Usage

```ts
import { createOpsAuditEvidenceCollectorAgent } from './agents/ops-audit-evidence-collector/agent'
const result = await createOpsAuditEvidenceCollectorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
