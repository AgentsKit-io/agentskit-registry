# Secrets Leak Scanner

> **Status: alpha** — installable via `npx agentskit add devops-secrets-leak-scanner` for experimentation. Not yet `validated`.

## Pain

Secrets in repos

## Output

Findings typed

## Usage

```ts
import { createDevopsSecretsLeakScannerAgent } from './agents/devops-secrets-leak-scanner/agent'
const result = await createDevopsSecretsLeakScannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
