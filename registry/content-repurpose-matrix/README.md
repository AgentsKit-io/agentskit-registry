# Repurpose Matrix

> **Status: alpha** — installable via `npx agentskit add content-repurpose-matrix` for experimentation. Not yet `validated`.

## Pain

Content repurposing

## Output

Matrix typed

## Usage

```ts
import { createContentRepurposeMatrixAgent } from './agents/content-repurpose-matrix/agent'
const result = await createContentRepurposeMatrixAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
