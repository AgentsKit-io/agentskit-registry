# PRD Author

Transforms a free-form product description into a **typed, testable PRD** — never invents business logic.

```bash
npx agentskit add coding-prd-author
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createPrdAuthorAgent } from './agents/coding-prd-author/agent'

const r = await createPrdAuthorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(productDescription)
// → { prd: { problem, users[], criteria[], outOfScope[], openQuestions[] }, requiresReview }
```

- **Typed PRD** — `invokeStructured` + zod; 3–5 testable acceptance criteria.
- **Never invents** — anything the input doesn't specify becomes an `openQuestion`, not a guess.
- **Always a draft** — `requiresReview` always true. Untrusted input is **fenced**.

`run(description)` → `PrdResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Feeds [`coding-qa-author`](../coding-qa-author) and [`coding-issue-creator`](../coding-issue-creator).
