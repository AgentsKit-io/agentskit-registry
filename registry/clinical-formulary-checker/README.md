# Formulary Checker

> **Status: alpha** — installable via `npx agentskit add clinical-formulary-checker` for experimentation. Not yet `validated`.

## Pain

Coverage unknown

## Output

Coverage typed

## Usage

```ts
import { createClinicalFormularyCheckerAgent } from './agents/clinical-formulary-checker/agent'
const result = await createClinicalFormularyCheckerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
