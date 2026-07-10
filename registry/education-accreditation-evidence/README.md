# Accreditation Evidence

> **Status: alpha** — installable via `npx agentskit add education-accreditation-evidence` for experimentation. Not yet `validated`.

## Pain

Accreditation prep

## Output

Evidence typed

## Usage

```ts
import { createEducationAccreditationEvidenceAgent } from './agents/education-accreditation-evidence/agent'
const result = await createEducationAccreditationEvidenceAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
