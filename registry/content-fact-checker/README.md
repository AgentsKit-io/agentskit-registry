# Fact Checker

> **Status: alpha** — installable via `npx agentskit add content-fact-checker` for experimentation. Not yet `validated`.

## Pain

Facts unverified

## Output

Claims typed

## Usage

```ts
import { createContentFactCheckerAgent } from './agents/content-fact-checker/agent'
const result = await createContentFactCheckerAgent({ adapter }).run(input)
```

## Gates

- cite-sources

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
