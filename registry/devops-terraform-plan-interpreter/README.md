# Terraform Plan Interpreter

> **Status: alpha** — installable via `npx agentskit add devops-terraform-plan-interpreter` for experimentation. Not yet `validated`.

## Pain

TF plans opaque

## Output

Summary typed

## Usage

```ts
import { createDevopsTerraformPlanInterpreterAgent } from './agents/devops-terraform-plan-interpreter/agent'
const result = await createDevopsTerraformPlanInterpreterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
