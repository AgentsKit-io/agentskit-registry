# Clause Comparator

> **Status: alpha** — installable via `npx agentskit add legal-clause-comparator` for experimentation. Not yet `validated`.

## Pain

Clause diffs tedious

## Output

Diff typed

## Usage

```ts
import { createLegalClauseComparatorAgent } from './agents/legal-clause-comparator/agent'
const result = await createLegalClauseComparatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
