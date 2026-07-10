# Doc-bridge Corpus Scanner

> **Status: alpha** — installable via `npx agentskit add ecosystem-doc-bridge-corpus-scanner` for experimentation. Not yet `validated`.

## Pain

doc-bridge needs corpus classification before indexing

## Output

Scan report typed: paths, doc types, staleness

## Usage

```ts
import { createEcosystemDocBridgeCorpusScannerAgent } from './agents/ecosystem-doc-bridge-corpus-scanner/agent'
const result = await createEcosystemDocBridgeCorpusScannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
