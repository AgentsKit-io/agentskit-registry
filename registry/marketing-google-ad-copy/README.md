# Google Ad Copy

> **Status: alpha** — installable via `npx agentskit add marketing-google-ad-copy` for experimentation. Not yet `validated`.

## Pain

RSA writing slow

## Output

RSA variants typed

## Usage

```ts
import { createMarketingGoogleAdCopyAgent } from './agents/marketing-google-ad-copy/agent'
const result = await createMarketingGoogleAdCopyAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
