# CI Failure Grouper

> **Status: alpha** — installable via `npx agentskit add devops-ci-failure-grouper` for experimentation. Not yet `validated`.

## Pain

CI noise

## Output

Groups typed

## Usage

```ts
import { createDevopsCiFailureGrouperAgent } from './agents/devops-ci-failure-grouper/agent'
const result = await createDevopsCiFailureGrouperAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
