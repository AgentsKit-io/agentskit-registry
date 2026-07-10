# Macro Suggester

> **Status: alpha** — installable via `npx agentskit add support-macro-suggester` for experimentation. Not yet `validated`.

## Pain

Repetitive replies

## Output

Macro draft typed

## Usage

```ts
import { createSupportMacroSuggesterAgent } from './agents/support-macro-suggester/agent'
const result = await createSupportMacroSuggesterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
