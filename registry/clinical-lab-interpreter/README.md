# Lab Interpreter

> **Status: alpha** — installable via `npx agentskit add clinical-lab-interpreter` for experimentation. Not yet `validated`.

## Pain

Lab results hard to scan

## Output

Interpretation typed

## Usage

```ts
import { createClinicalLabInterpreterAgent } from './agents/clinical-lab-interpreter/agent'
const result = await createClinicalLabInterpreterAgent({ adapter }).run(input)
```

## Gates

- never-diagnose

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
