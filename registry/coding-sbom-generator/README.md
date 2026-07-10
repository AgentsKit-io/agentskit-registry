# SBOM Generator

> **Status: alpha** — installable via `npx agentskit add coding-sbom-generator` for experimentation. Not yet `validated`.

## Pain

Supply chain audits

## Output

SBOM summary typed

## Usage

```ts
import { createCodingSbomGeneratorAgent } from './agents/coding-sbom-generator/agent'
const result = await createCodingSbomGeneratorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
