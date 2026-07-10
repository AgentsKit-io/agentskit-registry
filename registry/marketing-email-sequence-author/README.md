# Email Sequence Author

> **Status: alpha** — installable via `npx agentskit add marketing-email-sequence-author` for experimentation. Not yet `validated`.

## Pain

Drip campaigns manual

## Output

Sequence typed

## Usage

```ts
import { createMarketingEmailSequenceAuthorAgent } from './agents/marketing-email-sequence-author/agent'
const result = await createMarketingEmailSequenceAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
