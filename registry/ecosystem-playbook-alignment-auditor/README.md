# Playbook Alignment Auditor

> **Status: alpha** — installable via `npx agentskit add ecosystem-playbook-alignment-auditor` for experimentation. Not yet `validated`.

## Pain

Registry agents must align with playbook.agentskit.io standards

## Output

Alignment findings typed vs playbook patterns

## Usage

```ts
import { createEcosystemPlaybookAlignmentAuditorAgent } from './agents/ecosystem-playbook-alignment-auditor/agent'
const result = await createEcosystemPlaybookAlignmentAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
