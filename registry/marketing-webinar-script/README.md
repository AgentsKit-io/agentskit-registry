# Webinar Script

> **Status: alpha** — installable via `npx agentskit add marketing-webinar-script` for experimentation. Not yet `validated`.

## Pain

Webinars unstructured

## Output

Script + timing typed

## Usage

```ts
import { createMarketingWebinarScriptAgent } from './agents/marketing-webinar-script/agent'
const result = await createMarketingWebinarScriptAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
