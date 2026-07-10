# News Monitor

> **Status: alpha** — installable via `npx agentskit add research-news-monitor` for experimentation. Not yet `validated`.

## Pain

Topic monitoring

## Output

Digest typed + URLs

## Usage

```ts
import { createResearchNewsMonitorAgent } from './agents/research-news-monitor/agent'
const result = await createResearchNewsMonitorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
