# Dependency Auditor

> **Status: alpha** — installable via `npx agentskit add coding-dependency-auditor` for experimentation. Not yet `validated`.

## Pain

CVEs and stale deps

## Output

Findings per package typed

## Usage

```ts
import { createCodingDependencyAuditorAgent } from './agents/coding-dependency-auditor/agent'
const result = await createCodingDependencyAuditorAgent({ adapter }).run(input)
```

## Gates

- cite-lockfile

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
