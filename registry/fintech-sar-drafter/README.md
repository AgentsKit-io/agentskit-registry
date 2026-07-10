# SAR Drafter

> **Status: alpha** — installable via `npx agentskit add fintech-sar-drafter` for experimentation. Not yet `validated`.

## Pain

SAR writing manual

## Output

SAR draft typed

## Usage

```ts
import { createFintechSarDrafterAgent } from './agents/fintech-sar-drafter/agent'
const result = await createFintechSarDrafterAgent({ adapter }).run(input)
```

## Gates

- hitl
- never-files

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
