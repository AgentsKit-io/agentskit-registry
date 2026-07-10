# SEO Brief

> **Status: alpha** — installable via `npx agentskit add marketing-seo-brief` for experimentation. Not yet `validated`.

## Pain

Content without SEO intent

## Output

Keywords/structure typed

## Usage

```ts
import { createMarketingSeoBriefAgent } from './agents/marketing-seo-brief/agent'
const result = await createMarketingSeoBriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
