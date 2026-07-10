# Meta Ad Copy

> **Status: alpha** — installable via `npx agentskit add marketing-meta-ad-copy` for experimentation. Not yet `validated`.

## Pain

Meta ads off-policy

## Output

3 variants typed + policy flags

## Usage

```ts
import { createMarketingMetaAdCopyAgent } from './agents/marketing-meta-ad-copy/agent'
const result = await createMarketingMetaAdCopyAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
