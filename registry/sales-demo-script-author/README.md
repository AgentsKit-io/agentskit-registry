# Demo Script Author

> **Status: alpha** — installable via `npx agentskit add sales-demo-script-author` for experimentation. Not yet `validated`.

## Pain

Demos unstructured

## Output

Script typed

## Usage

```ts
import { createSalesDemoScriptAuthorAgent } from './agents/sales-demo-script-author/agent'
const result = await createSalesDemoScriptAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
