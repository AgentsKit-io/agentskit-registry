# License Compliance

> **Status: alpha** — installable via `npx agentskit add coding-license-compliance` for experimentation. Not yet `validated`.

## Pain

Incompatible OSS licenses

## Output

Conflicts typed

## Usage

```ts
import { createCodingLicenseComplianceAgent } from './agents/coding-license-compliance/agent'
const result = await createCodingLicenseComplianceAgent({ adapter }).run(input)
```

## Gates

- deterministic-gpl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
