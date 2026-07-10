# Drift Detector

> **Status: alpha** — installable via `npx agentskit add devops-drift-detector` for experimentation. Not yet `validated`.

## Pain

Infra drift

## Output

Drift typed

## Usage

```ts
import { createDevopsDriftDetectorAgent } from './agents/devops-drift-detector/agent'
const result = await createDevopsDriftDetectorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
