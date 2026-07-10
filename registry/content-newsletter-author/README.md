# Newsletter Author

> **Status: alpha** — installable via `npx agentskit add content-newsletter-author` for experimentation. Not yet `validated`.

## Pain

Newsletters slow

## Output

Newsletter typed

## Usage

```ts
import { createContentNewsletterAuthorAgent } from './agents/content-newsletter-author/agent'
const result = await createContentNewsletterAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
