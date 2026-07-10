# Pager Storm Summarizer

> **Status: alpha** — installable via `npx agentskit add devops-pager-storm-summarizer` for experimentation. Not yet `validated`.

## Pain

Alert storms

## Output

Summary typed

## Usage

```ts
import { createDevopsPagerStormSummarizerAgent } from './agents/devops-pager-storm-summarizer/agent'
const result = await createDevopsPagerStormSummarizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
