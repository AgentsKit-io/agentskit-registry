# eDiscovery Privilege Log

> **Status: alpha** — installable via `npx agentskit add legal-ediscovery-privilege-log` for experimentation. Not yet `validated`.

## Pain

Privilege logs manual

## Output

Log typed

## Usage

```ts
import { createLegalEdiscoveryPrivilegeLogAgent } from './agents/legal-ediscovery-privilege-log/agent'
const result = await createLegalEdiscoveryPrivilegeLogAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
