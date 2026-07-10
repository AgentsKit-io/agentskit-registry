# SOW Drafter

> **Status: alpha** — installable via `npx agentskit add agency-sow-drafter` for experimentation. Not yet `validated`.

## Pain

SOW writing slow

## Output

SOW draft typed

## Usage

```ts
import { createAgencySowDrafterAgent } from './agents/agency-sow-drafter/agent'
const result = await createAgencySowDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
