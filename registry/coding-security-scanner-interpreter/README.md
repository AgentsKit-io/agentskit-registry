# Security Scanner Interpreter

> **Status: alpha** — installable via `npx agentskit add coding-security-scanner-interpreter` for experimentation. Not yet `validated`.

## Pain

SARIF/semgrep noise

## Output

Grouped findings + FP flags typed

## Usage

```ts
import { createCodingSecurityScannerInterpreterAgent } from './agents/coding-security-scanner-interpreter/agent'
const result = await createCodingSecurityScannerInterpreterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
