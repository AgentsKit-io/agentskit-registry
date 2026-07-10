# Vuln Prioritizer

> **Status: alpha** — installable via `npx agentskit add security-vuln-prioritizer` for experimentation. Not yet `validated`.

## Pain

Vuln backlog

## Output

Priority typed

## Usage

```ts
import { createSecurityVulnPrioritizerAgent } from './agents/security-vuln-prioritizer/agent'
const result = await createSecurityVulnPrioritizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
