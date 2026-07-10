# A/B Test Interpreter

> **Status: alpha** — installable via `npx agentskit add data-ab-test-interpreter` for experimentation. Not yet `validated`.

## Pain

A/B results misread

## Output

Interpretation typed

## Usage

```ts
import { createDataAbTestInterpreterAgent } from './agents/data-ab-test-interpreter/agent'
const result = await createDataAbTestInterpreterAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
