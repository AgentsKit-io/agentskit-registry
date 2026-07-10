# Multilingual Reply Drafter

> **Status: alpha** — installable via `npx agentskit add support-multilang-reply-drafter` for experimentation. Not yet `validated`.

## Pain

i18n support slow

## Output

Reply draft typed

## Usage

```ts
import { createSupportMultilangReplyDrafterAgent } from './agents/support-multilang-reply-drafter/agent'
const result = await createSupportMultilangReplyDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
